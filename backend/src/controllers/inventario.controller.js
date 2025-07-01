const { Inventario, MovimientoInventario, Producto, Categoria, Marca, Sucursal, Usuario, sequelize } = require('../models');
const { Op, Sequelize } = require('sequelize');
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
        producto_id,
        tipo,
        cantidad,
        motivo,
        observaciones
      } = req.body;
      
      const usuario_id = req.user?.id;

      if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
        return res.status(400).json(formatearError('Tipo de movimiento no válido.'));
      }

      let inventarioRealId = inventario_id;
      // Si no se pasa inventario_id pero sí producto_id, buscar o crear inventario
      if (!inventario_id && producto_id) {
        let inventario = await Inventario.findOne({ where: { producto_id } });
        if (!inventario) {
          // Crear inventario si no existe
          inventario = await Inventario.create({
            producto_id,
            sucursal_id: 1, // Sucursal por defecto
            stock_actual: tipo === 'salida' ? 0 : cantidad,
            stock_minimo: 5,
            stock_maximo: 100,
            ubicacion: 'Bodega Principal'
          });
        } else if (tipo === 'entrada' || tipo === 'ajuste') {
          // Si existe y es entrada/ajuste, sumar stock
          inventario.stock_actual += Number(cantidad);
          await inventario.save();
        }
        inventarioRealId = inventario.id;
      }

      const movimiento = await MovimientoInventario.crearMovimiento({
        inventario_id: inventarioRealId,
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

  /**
   * Listar TODOS los productos con su inventario y ofertas
   */
  async listarTodosProductosConInventario(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        categoria_id, 
        marca_id,
        stock_bajo,
        en_oferta,
        q 
      } = req.query;

      const offset = (page - 1) * limit;
      let whereClause = { activo: true };

      // Filtros
      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (marca_id) whereClause.marca_id = marca_id;
      if (q) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${q}%` } },
          { codigo_sku: { [Op.like]: `%${q}%` } }
        ];
      }

      // Obtener todos los productos con sus relaciones
      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: [
          { model: Categoria, as: 'categoria', required: false },
          { model: Marca, as: 'marca', required: false },
          { model: Inventario, as: 'inventario', required: false }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      // LOG para depuración
      console.log('=== PRODUCTOS ENCONTRADOS EN BD (con inventario) ===');
      console.log(productos.map(p => p.toJSON()));

      // Función para aplicar promociones (copiada del controlador de productos)
      const aplicarPromociones = (producto) => {
        const precio = parseFloat(producto.precio);
        const descuentoManual = parseFloat(producto.descuento) || 0;
        
        // 🚨 PRIORIDAD 1: Si hay descuento manual, aplicarlo primero
        if (descuentoManual > 0) {
          const precioConDescuentoManual = Math.round(precio * (1 - descuentoManual / 100));
          const ahorroManual = Math.round(precio * (descuentoManual / 100));
          
          return {
            ...producto,
            tiene_promocion: true,
            promocion_activa: {
              tipo: 'manual',
              nombre: `Descuento Manual ${descuentoManual}%`,
              descuento_porcentaje: descuentoManual,
              precio_original: precio,
              precio_oferta: precioConDescuentoManual,
              ahorro: ahorroManual,
              etiqueta: `MANUAL${descuentoManual}`
            },
            precio_original: precio,
            precio_final: precioConDescuentoManual,
            descuento_porcentaje: descuentoManual,
            etiqueta_promocion: `MANUAL${descuentoManual}`,
            descuento_manual: true
          };
        }
        
        // 🚨 PRIORIDAD 2: Si no hay descuento manual, aplicar promociones automáticas
        let promociones = [];
        
        // Promociones por marca
        if (producto.marca?.nombre === 'Stanley') {
          promociones.push({
            tipo: 'marca',
            nombre: 'Mega Sale Stanley 25%',
            descuento_porcentaje: 25,
            precio_original: precio,
            precio_oferta: Math.round(precio * 0.75),
            ahorro: Math.round(precio * 0.25),
            etiqueta: 'STANLEY25'
          });
        }
        
        if (producto.marca?.nombre === 'Bosch') {
          promociones.push({
            tipo: 'marca',
            nombre: 'Oferta Bosch 20%',
            descuento_porcentaje: 20,
            precio_original: precio,
            precio_oferta: Math.round(precio * 0.8),
            ahorro: Math.round(precio * 0.2),
            etiqueta: 'BOSCH20'
          });
        }
        
        if (producto.marca?.nombre === 'DeWalt') {
          promociones.push({
            tipo: 'marca',
            nombre: 'DeWalt Power Tools 18%',
            descuento_porcentaje: 18,
            precio_original: precio,
            precio_oferta: Math.round(precio * 0.82),
            ahorro: Math.round(precio * 0.18),
            etiqueta: 'DEWALT18'
          });
        }
        
        if (producto.marca?.nombre === 'Makita') {
          promociones.push({
            tipo: 'marca',
            nombre: 'Makita Professional 15%',
            descuento_porcentaje: 15,
            precio_original: precio,
            precio_oferta: Math.round(precio * 0.85),
            ahorro: Math.round(precio * 0.15),
            etiqueta: 'MAKITA15'
          });
        }

        // Seleccionar la mejor promoción
        if (promociones.length > 0) {
          const mejorPromocion = promociones.reduce((mejor, actual) => 
            actual.descuento_porcentaje > mejor.descuento_porcentaje ? actual : mejor
          );
          
          return {
            ...producto,
            tiene_promocion: true,
            promocion_activa: mejorPromocion,
            precio_original: precio,
            precio_final: mejorPromocion.precio_oferta,
            descuento_porcentaje: mejorPromocion.descuento_porcentaje,
            etiqueta_promocion: mejorPromocion.etiqueta,
            descuento_manual: false
          };
        }
        
        return {
          ...producto,
          tiene_promocion: false,
          precio_original: precio,
          precio_final: precio,
          descuento_porcentaje: 0,
          descuento_manual: false
        };
      };

      // Procesar cada producto
      const productosProcesados = productos.map(producto => {
        const productoData = producto.toJSON();
        
        // Calcular stock total
        const stockTotal = Array.isArray(productoData.inventario)
          ? productoData.inventario.reduce((sum, inv) => sum + (inv.stock_actual ? Number(inv.stock_actual) : 0), 0)
          : 0;
        
        // Aplicar promociones
        const productoConPromocion = aplicarPromociones(productoData);
        
        return {
          ...productoConPromocion,
          stock_total: stockTotal,
          stock_disponible: stockTotal > 0 ? 'Disponible' : 'Sin stock',
          estado_stock: stockTotal === 0 ? 'agotado' : 
                       stockTotal <= 5 ? 'bajo' : 'normal'
        };
      });

      // Aplicar filtros adicionales SOLO si el usuario lo pide
      let productosFiltrados = productosProcesados;
      
      if (stock_bajo === 'true') {
        productosFiltrados = productosFiltrados.filter(p => p.stock_total <= 5);
      }
      
      if (en_oferta === 'true') {
        productosFiltrados = productosFiltrados.filter(p => p.tiene_promocion);
      }

      res.json(formatearRespuesta(
        'Productos con inventario obtenidos exitosamente',
        productosFiltrados,
        {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit),
          estadisticas: {
            total_productos: count,
            productos_con_stock: productosProcesados.filter(p => p.stock_total > 0).length,
            productos_en_oferta: productosProcesados.filter(p => p.tiene_promocion).length,
            productos_sin_stock: productosProcesados.filter(p => p.stock_total === 0).length
          }
        }
      ));

    } catch (error) {
      console.error('Error al listar productos con inventario:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }

  // Endpoint para cantidad de productos con stock bajo
  async cantidadStockBajo(req, res) {
    try {
      const cantidad = await Inventario.count({
        where: {
          stock_actual: { [Op.lte]: Sequelize.col('stock_minimo') }
        }
      });
      res.json({ success: true, cantidad });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Actualizar stock de un producto específico.
   */
  async actualizarStockProducto(req, res) {
    try {
      const { producto_id, nuevo_stock, observaciones, tipo_movimiento } = req.body;
      const usuario_id = req.user?.id;

      if (!producto_id || nuevo_stock === undefined) {
        return res.status(400).json(formatearError('Faltan datos requeridos: producto_id y nuevo_stock'));
      }

      if (nuevo_stock < 0) {
        return res.status(400).json(formatearError('El stock no puede ser negativo'));
      }

      // Buscar el producto
      const producto = await Producto.findByPk(producto_id);
      if (!producto) {
        return res.status(404).json(formatearError('Producto no encontrado'));
      }

      // Buscar o crear el registro de inventario
      let inventario = await Inventario.findOne({ where: { producto_id } });
      
      if (!inventario) {
        // Crear nuevo registro de inventario si no existe
        inventario = await Inventario.create({
          producto_id,
          sucursal_id: 1, // Sucursal por defecto
          stock_actual: nuevo_stock,
          stock_minimo: 5,
          stock_maximo: 100,
          ubicacion: 'Bodega Principal'
        });
      } else {
        // Guardar el stock anterior para el historial
        const stockAnterior = inventario.stock_actual;
        
        // Actualizar el stock
        await inventario.update({ stock_actual: nuevo_stock });

        // Registrar el movimiento en el historial
        try {
          if (usuario_id) {
            await MovimientoInventario.create({
              inventario_id: inventario.id,
              tipo: tipo_movimiento || 'ajuste',
              cantidad: Math.abs(nuevo_stock - stockAnterior),
              motivo: `Ajuste de stock: ${stockAnterior} → ${nuevo_stock}`,
              observaciones: observaciones || 'Ajuste manual de stock',
              usuario_id,
              fecha: new Date(),
              stock_anterior: stockAnterior,
              stock_nuevo: nuevo_stock
            });
          }
        } catch (movimientoError) {
          console.warn('No se pudo registrar el movimiento:', movimientoError);
        }
      }

      res.json(formatearRespuesta(
        'Stock actualizado exitosamente',
        {
          producto_id,
          stock_anterior: inventario.stock_actual,
          stock_nuevo: nuevo_stock,
          inventario
        }
      ));
    } catch (error) {
      console.error('Error al actualizar stock del producto:', error);
      res.status(500).json(formatearError('Error interno del servidor', error));
    }
  }
}

module.exports = new InventarioController();