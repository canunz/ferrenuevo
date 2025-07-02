const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const { Pedido, Pago, sequelize } = require('../models'); // Importamos modelos y sequelize
const { formatearRespuesta, formatearError } = require('../utils/helpers');

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
                // Si no encontramos el pedido, hacemos un reembolso automático para no quedarnos con dinero que no corresponde.
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
            pedido.estado = 'aprobado'; // O el estado que corresponda
            await pedido.save({ transaction: t });
            
            await t.commit(); // Confirmamos la transacción en nuestra BD

            res.json(formatearRespuesta(
                'Pago confirmado y pedido actualizado exitosamente',
                {
                    status: resultado.status,
                    orden_compra: resultado.buy_order,
                    monto: resultado.amount,
                    pedido_id: pedido.id,
                    nuevo_estado_pedido: pedido.estado
                }
            ));

        } else {
            // El pago fue rechazado en Transbank
            await t.rollback(); // Deshacemos cualquier posible cambio en nuestra BD
            res.json(formatearRespuesta(
                'Pago rechazado por Transbank',
                resultado,
                false
            ));
        }

    } catch (error) {
        await t.rollback(); // Si algo falla, deshacemos todo
        console.error('Error al confirmar transacción:', error);
        res.status(500).json(formatearError('Error interno del servidor al confirmar el pago', error.message));
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