const { Pago, Pedido, MetodoPago, Usuario, sequelize } = require('../models');
const { formatearRespuesta, formatearError } = require('../utils/helpers');

class PagosController {

  /**
   * Registrar pago manual (efectivo, transferencia)
   */
  async registrarPago(req, res) {
    const transaction = await sequelize.transaction();
    
    try {
      const {
        pedido_id,
        metodo_pago,
        monto,
        referencia_externa,
        observaciones
      } = req.body;
      
      const usuario_id = req.user?.id;

      // Validar que el pedido existe
      const pedido = await Pedido.findByPk(pedido_id, { transaction });
      if (!pedido) {
        await transaction.rollback();
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Verificar que no existe ya un pago para este pedido
      const pagoExistente = await Pago.findOne({
        where: { pedido_id },
        transaction
      });

      if (pagoExistente) {
        await transaction.rollback();
        return res.status(400).json(formatearError('Ya existe un pago para este pedido'));
      }

      // Obtener método de pago
      const metodoPago = await MetodoPago.findOne({
        where: { nombre: metodo_pago },
        transaction
      });

      if (!metodoPago) {
        await transaction.rollback();
        return res.status(400).json(formatearError('Método de pago no válido'));
      }

      // Crear el pago
      const estadoPago = metodo_pago === 'efectivo' ? 'pendiente' : 'aprobado';
      const pago = await Pago.create({
        pedido_id,
        metodo_pago_id: metodoPago.id,
        monto,
        estado: estadoPago,
        referencia_externa: referencia_externa || null,
        fecha_pago: estadoPago === 'aprobado' ? new Date() : null
      }, { transaction });

      // Solo marcar el pedido como pagado si el pago es aprobado
      if (estadoPago === 'aprobado') {
        await pedido.update({
          estado: 'pagado'
        }, { transaction });
      }

      await transaction.commit();

      // Obtener el pago completo con relaciones
      const pagoCompleto = await Pago.findByPk(pago.id, {
        include: [
          {
            model: Pedido,
            as: 'pedido',
            attributes: ['numero_pedido', 'total']
          },
          {
            model: MetodoPago,
            as: 'metodo_pago',
            attributes: ['nombre']
          }
        ]
      });

      res.status(201).json(formatearRespuesta(
        'Pago registrado exitosamente',
        pagoCompleto
      ));

    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar pago:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Listar todos los pagos
   */
  async listarPagos(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        estado, 
        metodo_pago,
        fecha_inicio,
        fecha_fin 
      } = req.query;

      const offset = (page - 1) * limit;
      let whereClause = {};

      if (estado) {
        whereClause.estado = estado;
      }
      if (fecha_inicio && fecha_fin) {
        whereClause.fecha_pago = {
          [sequelize.Op.between]: [fecha_inicio, fecha_fin]
        };
      }

      const { count, rows: pagos } = await Pago.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Pedido,
            as: 'pedido',
            attributes: ['numero_pedido', 'total', 'cliente_id'],
            include: [
              {
                model: Usuario,
                as: 'cliente',
                attributes: ['nombre', 'email']
              }
            ]
          },
          {
            model: MetodoPago,
            as: 'metodo_pago',
            attributes: ['nombre']
          }
        ],
        order: [['fecha_pago', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Filtrar por método de pago si se especifica
      let pagosFiltrados = pagos;
      if (metodo_pago) {
        pagosFiltrados = pagos.filter(pago => 
          pago.metodo_pago?.nombre === metodo_pago
        );
      }

      res.json(formatearRespuesta(
        'Pagos obtenidos exitosamente',
        pagosFiltrados,
        {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      ));

    } catch (error) {
      console.error('Error al listar pagos:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener pago por ID
   */
  async obtenerPago(req, res) {
    try {
      const { id } = req.params;

      const pago = await Pago.findByPk(id, {
        include: [
          {
            model: Pedido,
            as: 'pedido',
            include: [
              {
                model: Usuario,
                as: 'cliente',
                attributes: ['nombre', 'email', 'telefono']
              }
            ]
          },
          {
            model: MetodoPago,
            as: 'metodo_pago',
            attributes: ['nombre', 'descripcion']
          }
        ]
      });

      if (!pago) {
        return res.status(404).json(formatearError('Pago no encontrado'));
      }

      res.json(formatearRespuesta(
        'Pago obtenido exitosamente',
        pago
      ));

    } catch (error) {
      console.error('Error al obtener pago:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Actualizar estado de pago
   */
  async actualizarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const pago = await Pago.findByPk(id);
      if (!pago) {
        return res.status(404).json(formatearError('Pago no encontrado'));
      }

      await pago.update({ estado, fecha_pago: estado === 'aprobado' ? new Date() : pago.fecha_pago });

      // Si el pago se aprueba, actualizar el estado del pedido
      if (estado === 'aprobado') {
        await Pedido.update(
          { estado: 'pagado' },
          { where: { id: pago.pedido_id } }
        );
      }

      res.json(formatearRespuesta(
        'Estado de pago actualizado exitosamente',
        pago
      ));

    } catch (error) {
      console.error('Error al actualizar estado de pago:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener estadísticas de pagos
   */
  async obtenerEstadisticas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      let whereClause = {};
      if (fecha_inicio && fecha_fin) {
        whereClause.fecha_pago = {
          [sequelize.Op.between]: [fecha_inicio, fecha_fin]
        };
      }

      const estadisticas = await Pago.findAll({
        where: whereClause,
        include: [
          {
            model: MetodoPago,
            as: 'metodo_pago',
            attributes: ['nombre']
          }
        ],
        attributes: [
          'estado',
          [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
          [sequelize.fn('SUM', sequelize.col('monto')), 'monto_total']
        ],
        group: ['estado', 'metodo_pago.nombre']
      });

      const totalPagos = await Pago.count({ where: whereClause });
      const totalMonto = await Pago.sum('monto', { where: whereClause });

      res.json(formatearRespuesta(
        'Estadísticas de pagos obtenidas exitosamente',
        {
          total_pagos: totalPagos,
          total_monto: totalMonto || 0,
          por_estado: estadisticas
        }
      ));

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener métodos de pago disponibles
   */
  async obtenerMetodosPago(req, res) {
    try {
      const metodos = await MetodoPago.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });

      res.json(formatearRespuesta(
        'Métodos de pago obtenidos exitosamente',
        metodos
      ));

    } catch (error) {
      console.error('Error al obtener métodos de pago:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }
}

module.exports = new PagosController(); 