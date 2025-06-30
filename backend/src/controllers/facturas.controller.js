const { 
  Factura, 
  DetalleFactura, 
  Pedido, 
  Usuario, 
  Producto, 
  DetallePedido,
  sequelize 
} = require('../models');
const { formatearRespuesta, formatearError } = require('../utils/helpers');

class FacturasController {

  /**
   * Emitir una nueva factura basada en un pedido
   */
  async emitirFactura(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const { pedido_id, metodo_pago, observaciones } = req.body;
      const usuario_id = req.user?.id;

      // Validar que el pedido existe
      const pedido = await Pedido.findByPk(pedido_id, {
        include: [
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['id', 'nombre', 'email', 'telefono', 'direccion']
          },
          {
            model: DetallePedido,
            as: 'detalles',
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['id', 'nombre', 'descripcion', 'precio', 'codigo_sku']
              }
            ]
          }
        ],
        transaction
      });

      if (!pedido) {
        await transaction.rollback();
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Verificar que no existe ya una factura para este pedido
      const facturaExistente = await Factura.findOne({
        where: { pedido_id },
        transaction
      });

      if (facturaExistente) {
        await transaction.rollback();
        return res.status(400).json(formatearError('Ya existe una factura para este pedido'));
      }

      // Generar número de factura
      const numeroFactura = await Factura.generarNumeroFactura();

      // Crear la factura
      const factura = await Factura.create({
        numero_factura: numeroFactura,
        pedido_id: pedido_id,
        cliente_id: pedido.cliente.id,
        fecha_emision: new Date(),
        fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        subtotal: pedido.subtotal,
        descuento: pedido.descuento || 0,
        metodo_pago: metodo_pago,
        observaciones: observaciones,
        // Datos del cliente
        cliente_nombre: pedido.cliente.nombre,
        cliente_email: pedido.cliente.email,
        cliente_telefono: pedido.cliente.telefono,
        cliente_direccion: pedido.cliente.direccion
      }, { transaction });

      // Calcular totales
      factura.calcularTotales();
      await factura.save({ transaction });

      // Crear detalles de factura
      const detallesFactura = [];
      for (const detalle of pedido.detalles) {
        const detalleFactura = await DetalleFactura.create({
          factura_id: factura.id,
          producto_id: detalle.producto.id,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
          descuento: detalle.descuento || 0,
          producto_nombre: detalle.producto.nombre,
          producto_codigo: detalle.producto.codigo_sku,
          producto_descripcion: detalle.producto.descripcion
        }, { transaction });

        // Calcular totales del detalle
        detalleFactura.calcularTotales();
        await detalleFactura.save({ transaction });
        
        detallesFactura.push(detalleFactura);
      }

      await transaction.commit();

      // Obtener la factura completa con detalles
      const facturaCompleta = await Factura.findByPk(factura.id, {
        include: [
          {
            model: DetalleFactura,
            as: 'detalles',
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['nombre', 'codigo_sku']
              }
            ]
          },
          {
            model: Pedido,
            as: 'pedido',
            attributes: ['numero_pedido', 'estado']
          },
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['nombre', 'email']
          }
        ]
      });

      res.status(201).json(formatearRespuesta(
        'Factura emitida exitosamente',
        facturaCompleta
      ));

    } catch (error) {
      await transaction.rollback();
      console.error('Error al emitir factura:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Listar todas las facturas con paginación
   */
  async listarFacturas(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        estado, 
        cliente_id,
        fecha_inicio,
        fecha_fin 
      } = req.query;

      const offset = (page - 1) * limit;
      let whereClause = {};

      if (estado) {
        whereClause.estado = estado;
      }
      if (cliente_id) {
        whereClause.cliente_id = cliente_id;
      }
      if (fecha_inicio && fecha_fin) {
        whereClause.fecha_emision = {
          [sequelize.Op.between]: [fecha_inicio, fecha_fin]
        };
      }

      const { count, rows: facturas } = await Factura.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['nombre', 'email']
          },
          {
            model: Pedido,
            as: 'pedido',
            attributes: ['numero_pedido', 'estado']
          }
        ],
        order: [['fecha_emision', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json(formatearRespuesta(
        'Facturas obtenidas exitosamente',
        facturas,
        {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      ));

    } catch (error) {
      console.error('Error al listar facturas:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener una factura específica con todos sus detalles
   */
  async obtenerFactura(req, res) {
    try {
      const { id } = req.params;

      const factura = await Factura.findByPk(id, {
        include: [
          {
            model: DetalleFactura,
            as: 'detalles',
            include: [
              {
                model: Producto,
                as: 'producto',
                attributes: ['nombre', 'codigo_sku', 'descripcion']
              }
            ]
          },
          {
            model: Pedido,
            as: 'pedido',
            include: [
              {
                model: Usuario,
                as: 'cliente',
                attributes: ['nombre', 'email', 'telefono', 'direccion']
              }
            ]
          },
          {
            model: Usuario,
            as: 'cliente',
            attributes: ['nombre', 'email', 'telefono', 'direccion']
          }
        ]
      });

      if (!factura) {
        return res.status(404).json(formatearError('Factura no encontrada'));
      }

      res.json(formatearRespuesta(
        'Factura obtenida exitosamente',
        factura
      ));

    } catch (error) {
      console.error('Error al obtener factura:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Actualizar estado de una factura
   */
  async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const factura = await Factura.findByPk(id);
      if (!factura) {
        return res.status(404).json(formatearError('Factura no encontrada'));
      }

      await factura.update({ estado });

      res.json(formatearRespuesta(
        'Estado de factura actualizado exitosamente',
        factura
      ));

    } catch (error) {
      console.error('Error al actualizar estado de factura:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener estadísticas de facturas
   */
  async obtenerEstadisticas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      let whereClause = {};
      if (fecha_inicio && fecha_fin) {
        whereClause.fecha_emision = {
          [sequelize.Op.between]: [fecha_inicio, fecha_fin]
        };
      }

      const estadisticas = await Factura.findAll({
        where: whereClause,
        attributes: [
          'estado',
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
          [sequelize.fn('SUM', sequelize.col('total')), 'monto_total']
        ],
        group: ['estado']
      });

      const totalFacturas = await Factura.count({ where: whereClause });
      const totalMonto = await Factura.sum('total', { where: whereClause });

      res.json(formatearRespuesta(
        'Estadísticas de facturas obtenidas exitosamente',
        {
          total_facturas: totalFacturas,
          total_monto: totalMonto || 0,
          por_estado: estadisticas
        }
      ));

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }
}

module.exports = new FacturasController(); 