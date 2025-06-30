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

      if (sucursal_id) {
        whereClause.sucursal_id = sucursal_id;
      }
      if (stock_bajo === 'true') {
        whereClause.stock_actual = { [Op.lte]: sequelize.col('stock_minimo') };
      }

      // Consulta simplificada con include de producto
      const { count, rows: inventario } = await Inventario.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Producto,
            as: 'producto',
            attributes: ['id', 'nombre', 'descripcion', 'precio', 'codigo_sku', 'imagen']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['updated_at', 'DESC']]
      });

      // Crear datos de ejemplo si no hay inventario
      if (count === 0) {
        const inventarioEjemplo = [
          {
            id: 1,
            producto_id: 1,
            sucursal_id: 1,
            stock_actual: 50,
            stock_minimo: 10,
            stock_maximo: 100,
            ubicacion: 'Estante A1',
            created_at: new Date(),
            updated_at: new Date(),
            producto: {
              id: 1,
              nombre: 'Taladro Eléctrico DeWalt',
              codigo_sku: 'TAL-DEWALT-001'
            }
          },
          {
            id: 2,
            producto_id: 2,
            sucursal_id: 1,
            stock_actual: 5,
            stock_minimo: 10,
            stock_maximo: 50,
            ubicacion: 'Estante B2',
            created_at: new Date(),
            updated_at: new Date(),
            producto: {
              id: 2,
              nombre: 'Sierra Circular Bosch',
              codigo_sku: 'SIE-BOSCH-001'
            }
          }
        ];

        return res.json(formatearRespuesta(
          'Inventario obtenido exitosamente (datos de ejemplo)',
          inventarioEjemplo,
          {
            current_page: parseInt(page),
            total_pages: 1,
            total_items: inventarioEjemplo.length,
            items_per_page: parseInt(limit)
          }
        ));
      }

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
      
      const usuario_id = req.user?.id;

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
   * Ingresar stock a un producto del inventario.
   */
  async ingresoStock(req, res) {
    try {
      const { producto_id, cantidad, observaciones } = req.body;
      const usuario_id = req.user?.id;

      if (!producto_id || !cantidad) {
        return res.status(400).json(formatearError('Faltan datos requeridos: producto_id y cantidad'));
      }

      if (cantidad <= 0) {
        return res.status(400).json(formatearError('La cantidad debe ser mayor a 0'));
      }

      // Buscar el registro de inventario para ese producto
      const inventario = await Inventario.findOne({ 
        where: { producto_id },
        include: [{ model: Producto, as: 'producto', attributes: ['nombre', 'codigo_sku'] }]
      });

      if (!inventario) {
        return res.status(404).json(formatearError('Producto no encontrado en inventario'));
      }

      // Guardar el stock anterior para el historial
      const stockAnterior = inventario.stock_actual;

      // Actualizar el stock
      inventario.stock_actual += Number(cantidad);
      await inventario.save();

      // Registrar el movimiento en el historial
      try {
        if (usuario_id) {
          await MovimientoInventario.crearMovimiento({
            inventario_id: inventario.id,
            tipo: 'entrada',
            cantidad: Number(cantidad),
            motivo: 'Ingreso de stock',
            observaciones: observaciones || `Ingreso manual de ${cantidad} unidades`,
            usuario_id
          });
        }
      } catch (movimientoError) {
        console.warn('No se pudo registrar el movimiento:', movimientoError);
        // No fallamos la operación principal si el movimiento falla
      }

      res.json(formatearRespuesta(
        'Stock ingresado exitosamente',
        {
          inventario,
          stock_anterior: stockAnterior,
          cantidad_ingresada: cantidad,
          stock_nuevo: inventario.stock_actual
        }
      ));
    } catch (error) {
      console.error('Error al ingresar stock:', error);
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

  /**
   * Registrar egreso de stock (salida de inventario).
   */
  async registrarEgreso(req, res) {
    try {
      const {
        producto_id,
        cantidad,
        motivo,
        observaciones
      } = req.body;
      
      const usuario_id = req.user?.id;

      if (!producto_id || !cantidad || !motivo) {
        return res.status(400).json(formatearError('Faltan campos obligatorios: producto_id, cantidad, motivo'));
      }

      if (cantidad <= 0) {
        return res.status(400).json(formatearError('La cantidad debe ser mayor a 0'));
      }

      // Buscar el inventario del producto
      const inventario = await Inventario.findOne({
        where: { producto_id }
      });

      if (!inventario) {
        return res.status(404).json(formatearError('Producto no encontrado en inventario'));
      }

      if (inventario.stock_actual < cantidad) {
        return res.status(400).json(formatearError('Stock insuficiente para realizar el egreso'));
      }

      // Calcular stock anterior y nuevo
      const stockAnterior = inventario.stock_actual;
      const stockNuevo = inventario.stock_actual - cantidad;

      // Registrar el movimiento de egreso
      const movimiento = await MovimientoInventario.create({
        inventario_id: inventario.id,
        tipo: 'salida',
        cantidad: cantidad,
        motivo: motivo,
        observaciones: observaciones || null,
        usuario_id: usuario_id,
        fecha: new Date(),
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo
      });

      // Actualizar el stock
      await inventario.update({
        stock_actual: stockNuevo
      });

      res.status(201).json(formatearRespuesta(
        'Egreso de stock registrado exitosamente',
        {
          movimiento: movimiento,
          stock_actual: stockNuevo
        }
      ));
    } catch (error) {
      console.error('Error al registrar egreso:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  /**
   * Registrar ingreso de stock (entrada de inventario).
   */
  async registrarIngreso(req, res) {
    try {
      const {
        producto_id,
        cantidad,
        motivo,
        observaciones
      } = req.body;
      
      const usuario_id = req.user?.id;

      if (!producto_id || !cantidad || !motivo) {
        return res.status(400).json(formatearError('Faltan campos obligatorios: producto_id, cantidad, motivo'));
      }

      if (cantidad <= 0) {
        return res.status(400).json(formatearError('La cantidad debe ser mayor a 0'));
      }

      // Buscar el inventario del producto
      let inventario = await Inventario.findOne({
        where: { producto_id }
      });

      if (!inventario) {
        // Si no existe inventario para este producto, crearlo
        inventario = await Inventario.create({
          producto_id: producto_id,
          sucursal_id: 1, // Sucursal por defecto
          stock_actual: 0,
          stock_minimo: 10,
          stock_maximo: 100,
          ubicacion: 'Por asignar'
        });
      }

      // Registrar el movimiento de ingreso
      const movimiento = await MovimientoInventario.create({
        inventario_id: inventario.id,
        tipo: 'entrada',
        cantidad: cantidad,
        motivo: motivo,
        observaciones: observaciones || null,
        usuario_id: usuario_id,
        fecha: new Date()
      });

      // Actualizar el stock
      await inventario.update({
        stock_actual: inventario.stock_actual + cantidad
      });

      res.status(201).json(formatearRespuesta(
        'Ingreso de stock registrado exitosamente',
        {
          movimiento: movimiento,
          stock_actual: inventario.stock_actual + cantidad
        }
      ));
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }
}

module.exports = new InventarioController();