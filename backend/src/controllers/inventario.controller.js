const { Inventario, MovimientoInventario, Producto, Categoria, Marca, Sucursal, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');
const { formatearRespuesta, formatearError } = require('../utils/helpers');

class InventarioController {

  /**
   * Listar inventario con paginación y filtros avanzados.
   */
  async listarInventario(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sucursal_id, 
        stock_bajo, 
        categoria_id,
        q 
      } = req.query;

      const offset = (page - 1) * limit;
      let whereClause = {};
      let includeClause = [
        { model: Producto, as: 'producto', include: [
            { model: Categoria, as: 'categoria' },
            { model: Marca, as: 'marca' }
        ]},
        { model: Sucursal, as: 'sucursal' }
      ];

      if (sucursal_id) {
        whereClause.sucursal_id = sucursal_id;
      }
      if (stock_bajo === 'true') {
        whereClause.stock_actual = { [Op.lte]: sequelize.col('stock_minimo') };
      }
      if (categoria_id) {
        includeClause[0].where = { categoria_id: categoria_id };
      }
      if (q) {
        includeClause[0].where = {
          ...includeClause[0].where,
          [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { codigo_sku: { [Op.like]: `%${q}%` } }
          ]
        };
      }

      const { count, rows: inventario } = await Inventario.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updated_at', 'DESC']]
      });

      res.json(formatearRespuesta(
        'Inventario obtenido exitosamente',
        inventario,
        {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      ));
    } catch (error) {
      console.error('Error al listar inventario:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Registrar un nuevo movimiento de inventario (entrada, salida, ajuste).
   */
  async registrarMovimiento(req, res) {
    try {
      const {
        inventario_id,
        tipo,
        cantidad,
        motivo,
        observaciones
      } = req.body;
      
      const usuario_id = req.usuario.id;

      if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
        return res.status(400).json(formatearError('Tipo de movimiento no válido.'));
      }

      const movimiento = await MovimientoInventario.crearMovimiento({
        inventario_id,
        tipo,
        cantidad,
        motivo,
        observaciones,
        usuario_id
      });

      res.status(201).json(formatearRespuesta(
        'Movimiento de inventario registrado exitosamente',
        movimiento
      ));
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      res.status(400).json(formatearError(error.message));
    }
  }

  /**
   * Obtener el historial de movimientos de un item de inventario.
   */
  async obtenerHistorialProducto(req, res) {
    try {
      const { inventario_id } = req.params;
      const { page = 1, limit = 15 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows: historial } = await MovimientoInventario.findAndCountAll({
        where: { inventario_id },
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'email'] }],
        order: [['fecha', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json(formatearRespuesta(
        'Historial de movimientos obtenido exitosamente',
        historial,
        {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      ));
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener alertas de stock bajo.
   */
  async obtenerAlertasStock(req, res) {
    try {
      const alertas = await Inventario.findAll({
        where: {
          stock_actual: { [Op.lte]: sequelize.col('stock_minimo') }
        },
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre', 'codigo_sku'] },
          { model: Sucursal, as: 'sucursal', attributes: ['nombre'] }
        ],
        order: [['stock_actual', 'ASC']]
      });

      res.json(formatearRespuesta(
        'Alertas de stock obtenidas exitosamente',
        alertas
      ));
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Actualizar stock de un item de inventario.
   */
  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { stock_actual, stock_minimo, stock_maximo, ubicacion } = req.body;

      const inventario = await Inventario.findByPk(id);
      if (!inventario) {
        return res.status(404).json(formatearError('Item de inventario no encontrado'));
      }

      await inventario.update({
        stock_actual,
        stock_minimo,
        stock_maximo,
        ubicacion
      });

      res.json(formatearRespuesta(
        'Stock actualizado exitosamente',
        inventario
      ));
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Obtener estadísticas del inventario.
   */
  async obtenerEstadisticas(req, res) {
    try {
      const totalItems = await Inventario.count();
      const stockBajo = await Inventario.count({
        where: {
          stock_actual: { [Op.lte]: sequelize.col('stock_minimo') }
        }
      });
      const stockAgotado = await Inventario.count({
        where: { stock_actual: 0 }
      });

      const valorTotal = await Inventario.sum('stock_actual', {
        include: [{ model: Producto, as: 'producto', attributes: ['precio'] }]
      });

      res.json(formatearRespuesta(
        'Estadísticas obtenidas exitosamente',
        {
          total_items: totalItems,
          stock_bajo: stockBajo,
          stock_agotado: stockAgotado,
          valor_total: valorTotal || 0
        }
      ));
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }
}

module.exports = new InventarioController();