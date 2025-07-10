const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const { Pedido, Pago, sequelize } = require('../models'); // Importamos modelos y sequelize
const { formatearRespuesta, formatearError } = require('../utils/helpers');
const { enviarCorreo } = require('../services/emailService');
const PDFDocument = require('pdfkit');
const { Usuario, DetallePedido, Producto } = require('../models');

// Configuración de Transbank para ambiente de integración
const options = new Options(
    '597055555532', // Código de comercio Webpay Plus
    '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Api Key Secret
    Environment.Integration
);

const transaction = new WebpayPlus.Transaction(options);

// Crear transacción Webpay y guardar pedido pendiente
exports.crearTransaccion = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { 
            monto,
            ordenCompra,
            sessionId,
            returnUrl,
            items,
            cliente,
            metodoEntrega,
            metodoPago
        } = req.body;

        if (!monto || !ordenCompra || !sessionId || !returnUrl || !items || !cliente) {
            return res.status(400).json(formatearError('Faltan datos requeridos para crear la transacción'));
        }

        // 1. Crear el pedido en la base de datos
        const pedido = await Pedido.create({
            numero_pedido: ordenCompra,
            usuario_id: cliente.id, // Asegúrate de enviar el id del usuario en "cliente"
            estado: 'pendiente',
            subtotal: monto, // Puedes calcular subtotal real si tienes descuentos, etc.
            total: monto,
            metodo_entrega: metodoEntrega === 'despacho' ? 'despacho_domicilio' : 'retiro_tienda',
            direccion_entrega: cliente.direccion || '',
            observaciones: ''
        }, { transaction: t });

        // 2. Guardar los detalles del pedido
        const { DetallePedido } = require('../models');
        for (const item of items) {
            await DetallePedido.create({
                pedido_id: pedido.id,
                producto_id: item.id, // Asegúrate de enviar el id del producto en "items"
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                subtotal: item.precio * item.cantidad
            }, { transaction: t });
        }

        // 3. Crear transacción en Transbank
        const resultado = await transaction.create(
            ordenCompra,
            sessionId,
            monto,
            returnUrl
        );

        await t.commit();

        res.json(formatearRespuesta(
            'Transacción creada exitosamente',
            {
                token: resultado.token,
                url: resultado.url,
                orden_compra: ordenCompra
            }
        ));

    } catch (error) {
        await t.rollback();
        console.error('Error al crear transacción:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
    }
};

// Confirmar transacción Webpay
exports.confirmarTransaccion = async (req, res) => {
    console.log('🟢 Body recibido en confirmarTransaccion:', req.body); // Log de depuración
    const t = await sequelize.transaction(); // Iniciamos transacción
    try {
        const { token_ws } = req.body;
        if (!token_ws) {
            return res.status(400).json(formatearError('Token de transacción requerido'));
        }

        const resultado = await transaction.commit(token_ws);

        // Log para depuración
        console.log('Resultado de commit Transbank:', resultado);

        if (!resultado.buy_order) {
            throw new Error('No se recibió buy_order de Transbank. Resultado: ' + JSON.stringify(resultado));
        }

        if (resultado.status === 'AUTHORIZED') {
            // El pago fue exitoso en Transbank. Ahora actualizamos nuestro sistema.
            const pedido = await Pedido.findOne({ where: { numero_pedido: resultado.buy_order } });
            if (!pedido) {
                await transaction.refund(token_ws, resultado.amount);
                throw new Error(`Pedido ${resultado.buy_order} no encontrado. Reembolso automático iniciado.`);
            }

            // Buscar el método de pago 'Transbank'
            const { MetodoPago } = require('../models');
            const metodoPago = await MetodoPago.findOne({ where: { nombre: 'Transbank' } });
            if (!metodoPago) {
                throw new Error('Método de pago "Transbank" no encontrado en la base de datos');
            }
            await Pago.create({
                pedido_id: pedido.id,
                metodo_pago_id: metodoPago.id,
                monto: resultado.amount,
                estado: 'aprobado',
                referencia_externa: token_ws,
                fecha_pago: new Date()
            }, { transaction: t });

            // 2. Actualizar el estado del pedido
            pedido.estado = 'aprobado';
            await pedido.save({ transaction: t });

            // 2.5. Guardar en HistorialCompras
            const { HistorialCompras } = require('../models');
            console.log('Intentando crear HistorialCompras con:', {
              usuario_id: pedido.usuario_id,
              pedido_id: pedido.id,
              fecha_compra: new Date(),
              monto_total: pedido.total,
              descuento_aplicado: 0,
              metodo_pago: 'Transbank',
              estado: pedido.estado,
            });
            await HistorialCompras.create({
              usuario_id: pedido.usuario_id,
              pedido_id: pedido.id,
              fecha_compra: new Date(),
              monto_total: pedido.total,
              descuento_aplicado: 0,
              metodo_pago: 'Transbank',
              estado: pedido.estado,
            }, { transaction: t });
            console.log('HistorialCompras creado exitosamente');

            // 3. Obtener detalle completo del pedido y usuario
            const usuario = await Usuario.findByPk(pedido.usuario_id);
            const detalles = await DetallePedido.findAll({
                where: { pedido_id: pedido.id },
                include: [{ model: Producto, as: 'Producto' }]
            });

            // Usar los campos calculados del pedido
            const subtotal = parseFloat(pedido.subtotal) || 0;
            const iva = parseFloat(pedido.iva) || 0;
            const descuentos = parseFloat(pedido.descuento) || 0;
            const costoEnvio = parseFloat(pedido.costo_envio) || 0;
            const total = parseFloat(pedido.total) || 0;

            // 4. Generar HTML de la boleta con IVA y todos los cobros
            let html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f7f7; padding: 32px;">
              <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
                <h1 style="color: #2d3e50; text-align: center; margin-bottom: 16px;">FERREMAS</h1>
                <h2 style="color: #4e73df; text-align: center; margin-bottom: 32px;">Boleta de Compra</h2>
                <p style="font-size: 16px; margin-bottom: 8px;"><b>Cliente:</b> ${usuario.nombre} (${usuario.email})</p>
                <p style="font-size: 16px; margin-bottom: 8px;"><b>N° Pedido:</b> ${pedido.numero_pedido}</p>
                <p style="font-size: 16px; margin-bottom: 8px;"><b>Fecha:</b> ${new Date().toLocaleDateString('es-CL')}</p>
                <p style="font-size: 16px; margin-bottom: 8px;"><b>Método de Entrega:</b> ${pedido.metodo_entrega === 'despacho_domicilio' ? 'Despacho a Domicilio' : 'Retiro en Tienda'}</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                  <thead>
                    <tr style="background: #4e73df; color: #fff;">
                      <th style="padding: 10px; border-radius: 6px 0 0 6px;">Producto</th>
                      <th style="padding: 10px;">Cantidad</th>
                      <th style="padding: 10px;">Precio Unit.</th>
                      <th style="padding: 10px; border-radius: 0 6px 6px 0;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${detalles.map(det => `
                      <tr style="background: #f4f6fb; color: #222;">
                        <td style="padding: 10px; border-bottom: 1px solid #e3e6f0;">${det.Producto.nombre}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #e3e6f0; text-align: center;">${det.cantidad}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #e3e6f0; text-align: right;">$${Number(det.precio_unitario).toLocaleString('es-CL')}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #e3e6f0; text-align: right;">$${Number(det.subtotal).toLocaleString('es-CL')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                
                <!-- Resumen de Cobros -->
                <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 24px 0;">
                  <h3 style="color: #2d3e50; margin-bottom: 16px; font-size: 18px;">Resumen de Cobros</h3>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 500;">Subtotal:</span>
                    <span>$${subtotal.toLocaleString('es-CL')}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 500;">IVA (19%):</span>
                    <span style="color: #dc3545;">$${iva.toLocaleString('es-CL')}</span>
                  </div>
                  ${costoEnvio > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 500;">Costo de Envío:</span>
                    <span>$${costoEnvio.toLocaleString('es-CL')}</span>
                  </div>
                  ` : ''}
                  ${descuentos > 0 ? `
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 500;">Descuentos:</span>
                    <span style="color: #28a745;">-$${descuentos.toLocaleString('es-CL')}</span>
                  </div>
                  ` : ''}
                  <div style="display: flex; justify-content: space-between; margin-top: 16px; padding-top: 16px; border-top: 2px solid #dee2e6; font-weight: bold; font-size: 18px;">
                    <span>TOTAL A PAGAR:</span>
                    <span style="color: #1cc88a; font-size: 20px;">$${total.toLocaleString('es-CL')}</span>
                  </div>
                </div>
                
                <div style="text-align: center; color: #858796; font-size: 15px; margin-top: 32px;">
                  ¡Gracias por tu compra!<br/>
                  <span style="font-size: 13px;">Ferremas - Desde 1980</span>
                </div>
              </div>
            </div>`;

            // 5. Generar PDF de la boleta con IVA y todos los cobros
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', async () => {
                const pdfData = Buffer.concat(buffers);
                // 6. Enviar correo
                try {
                  await enviarCorreo({
                      to: usuario.email,
                      subject: `Boleta de tu compra en Ferremas (#${pedido.numero_pedido})`,
                      html,
                      attachments: [{
                          filename: `boleta_${pedido.numero_pedido}.pdf`,
                          content: pdfData
                      }]
                  });
                } catch (error) {
                  console.error('Error enviando correo:', error);
                  // No detener el flujo si falla el correo
                }
            });
            // Contenido PDF con IVA y todos los cobros
            doc.fontSize(18).text('Boleta de Compra - Ferremas', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Cliente: ${usuario.nombre} (${usuario.email})`);
            doc.text(`N° Pedido: ${pedido.numero_pedido}`);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`);
            doc.text(`Método de Entrega: ${pedido.metodo_entrega === 'despacho_domicilio' ? 'Despacho a Domicilio' : 'Retiro en Tienda'}`);
            doc.moveDown();
            doc.text('Detalle de Productos:');
            detalles.forEach(det => {
                doc.text(`- ${det.Producto.nombre} x${det.cantidad}  $${Number(det.precio_unitario).toLocaleString('es-CL')}  Subtotal: $${Number(det.subtotal).toLocaleString('es-CL')}`);
            });
            doc.moveDown();
            doc.text('RESUMEN DE COBROS:');
            doc.text(`Subtotal: $${subtotal.toLocaleString('es-CL')}`);
            doc.text(`IVA (19%): $${iva.toLocaleString('es-CL')}`);
            if (costoEnvio > 0) {
                doc.text(`Costo de Envío: $${costoEnvio.toLocaleString('es-CL')}`);
            }
            if (descuentos > 0) {
                doc.text(`Descuentos: -$${descuentos.toLocaleString('es-CL')}`);
            }
            doc.moveDown();
            doc.fontSize(14).text(`TOTAL A PAGAR: $${total.toLocaleString('es-CL')}`);
            doc.moveDown();
            doc.fontSize(12).text('¡Gracias por tu compra!');
            doc.end();

            await t.commit();

            // Preparar detalle completo para el frontend
            res.json({
                orden_compra: pedido.numero_pedido,
                monto: pedido.total,
                fecha: pedido.updatedAt || new Date(),
                numero_tarjeta: resultado.card_detail ? resultado.card_detail.card_number : '****',
                tipo_tarjeta: resultado.payment_type_code || 'No especificado',
                codigo_autorizacion: resultado.authorization_code || 'N/A',
                estado: resultado.status || pedido.estado,
                productos: detalles.map(det => ({
                    nombre: det.Producto ? det.Producto.nombre : 'Producto',
                    cantidad: det.cantidad,
                    precio: det.precio_unitario
                })),
                cliente: {
                    nombre: usuario.nombre,
                    email: usuario.email
                },
                direccion_envio: pedido.direccion_entrega ? { direccion: pedido.direccion_entrega } : null
            });

        } else {
            await t.rollback();
            res.json(formatearRespuesta(
                'Pago rechazado por Transbank',
                resultado,
                false
            ));
        }

    } catch (error) {
        await t.rollback();
        console.error('Error al confirmar transacción:', error, error.message); // Log de error mejorado
        res.status(500).json({
            success: false,
            mensaje: 'Error al confirmar el pago',
            detalle: error.message || 'Error interno del servidor al confirmar el pago'
        });
    }
};

// Obtener estado de transacción
exports.obtenerEstadoTransaccion = async (req, res) => {
    try {
        const { token } = req.params;

        const resultado = await transaction.status(token);

        res.json(formatearRespuesta(
            'Estado de transacción obtenido exitosamente',
            resultado
        ));

    } catch (error) {
        console.error('Error al obtener estado de transacción:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
    }
};

// Reembolsar transacción
exports.reembolsarTransaccion = async (req, res) => {
    try {
        const { token, monto } = req.body;

        const resultado = await transaction.refund(token, monto);

        res.json(formatearRespuesta(
            'Reembolso realizado exitosamente',
            resultado
        ));

    } catch (error) {
        console.error('Error al reembolsar transacción:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
    }
}; 