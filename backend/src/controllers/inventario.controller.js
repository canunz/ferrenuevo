const { Inventario, MovimientoInventario } = require('../models');
const { Producto } = require('../models');

class InventarioController {

  // Listar inventario
  async listarInventario(req, res) {
    try {
      const { page = 1, limit = 10, sucursal_id, stock_bajo, categoria_id } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (sucursal_id) where.sucursal_id = sucursal_id;
      if (categoria_id) where['$producto.categoria_id$'] = categoria_id;

      // Consulta real a la base de datos
      const { count, rows } = await Inventario.findAndCountAll({
        where,
        include: [{
          model: Producto,
          as: 'producto',
          attributes: ['id', 'nombre', 'codigo_sku', 'categoria_id', 'marca_id']
        }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['id', 'ASC']]
      });

      let inventarioFiltrado = rows.map(item => ({
        id: item.id,
        stock_actual: item.stock_actual,
        stock_minimo: item.stock_minimo,
        stock_maximo: item.stock_maximo,
        ubicacion: item.ubicacion,
        producto: item.producto ? {
          id: item.producto.id,
          nombre: item.producto.nombre,
          codigo_sku: item.producto.codigo_sku,
          categoria_id: item.producto.categoria_id,
          marca_id: item.producto.marca_id
        } : null,
        sucursal_id: item.sucursal_id
      }));

      // Filtrar por stock bajo si corresponde
      if (stock_bajo === 'true') {
        inventarioFiltrado = inventarioFiltrado.filter(item => item.stock_actual <= item.stock_minimo);
      }

      res.json({
        message: 'Inventario obtenido exitosamente',
        data: inventarioFiltrado,
        meta: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al listar inventario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Actualizar stock
  async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { stock_actual, ubicacion, observaciones } = req.body;

      if (stock_actual === undefined || stock_actual < 0) {
        return res.status(400).json(formatearError('Stock actual debe ser un número no negativo'));
      }

      // Simular actualización
      const inventarioActualizado = {
        id: parseInt(id),
        stock_actual: parseInt(stock_actual),
        ubicacion: ubicacion || 'Sin ubicación',
        observaciones: observaciones || null,
        updated_at: new Date().toISOString(),
        producto: {
          id: 1,
          nombre: 'Taladro Eléctrico DeWalt 20V'
        },
        sucursal: {
          id: 1,
          nombre: 'FERREMAS Centro'
        }
      };

      res.json(formatearRespuesta(
        'Stock actualizado exitosamente',
        inventarioActualizado
      ));
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Alerta de stock bajo
  async alertaStockBajo(req, res) {
    try {
      // Simular productos con stock bajo
      const stockBajo = [
        {
          id: 2,
          stock_actual: 3,
          stock_minimo: 5,
          ubicacion: 'Estante A2-Centro',
          producto: {
            id: 2,
            nombre: 'Sierra Circular Bosch 7.25"',
            codigo_sku: 'BSH-SIE-725-001'
          },
          sucursal: {
            id: 1,
            nombre: 'FERREMAS Centro'
          },
          diferencia: -2 // Stock actual - Stock mínimo
        }
      ];

      res.json(formatearRespuesta(
        'Productos con stock bajo obtenidos exitosamente',
        stockBajo
      ));
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Obtener stock por producto
  async obtenerStockProducto(req, res) {
    try {
      const { producto_id } = req.params;
      const { sucursal_id } = req.query;

      // Simular stock del producto
      const stockProducto = [
        {
          id: 1,
          producto_id: parseInt(producto_id),
          sucursal_id: 1,
          stock_actual: 25,
          stock_minimo: 5,
          stock_maximo: 50,
          ubicacion: 'Estante A1-Superior',
          producto: {
            id: parseInt(producto_id),
            nombre: 'Taladro Eléctrico DeWalt 20V',
            codigo_sku: 'DW-TAL-20V-001'
          },
          sucursal: {
            id: 1,
            nombre: 'FERREMAS Centro'
          }
        }
      ];

      let stockFiltrado = stockProducto;
      if (sucursal_id) {
        stockFiltrado = stockProducto.filter(s => s.sucursal_id == sucursal_id);
      }

      res.json(formatearRespuesta(
        'Stock del producto obtenido exitosamente',
        stockFiltrado
      ));
    } catch (error) {
      console.error('Error al obtener stock:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Ingreso de stock
  async ingresoStock(req, res) {
    try {
      let { productoId, cantidad, motivo, usuarioId } = req.body;
      if (!motivo || motivo.trim() === "") {
        motivo = "Sin motivo";
      }
      const inventario = await Inventario.findOne({ where: { producto_id: productoId } });
      if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });

      inventario.stock_actual += cantidad;
      await inventario.save();

      await MovimientoInventario.create({
        inventarioId: inventario.id,
        tipo: 'ingreso',
        cantidad,
        motivo,
        usuarioId
      });

      res.json({ message: 'Ingreso registrado', inventario });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Egreso de stock
  async egresoStock(req, res) {
    try {
      let { productoId, cantidad, motivo, usuarioId } = req.body;
      if (!motivo || motivo.trim() === "") {
        motivo = "Sin motivo";
      }
      const inventario = await Inventario.findOne({ where: { producto_id: productoId } });
      if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });

      if (inventario.stock_actual < cantidad) {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }

      inventario.stock_actual -= cantidad;
      await inventario.save();

      await MovimientoInventario.create({
        inventarioId: inventario.id,
        tipo: 'egreso',
        cantidad,
        motivo,
        usuarioId
      });

      res.json({ message: 'Egreso registrado', inventario });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Ajuste de stock
  async ajusteStock(req, res) {
    try {
      let { productoId, cantidad, motivo, usuarioId } = req.body;
      if (!motivo || motivo.trim() === "") {
        motivo = "Sin motivo";
      }
      const inventario = await Inventario.findOne({ where: { producto_id: productoId } });
      if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });

      inventario.stock_actual = cantidad;
      await inventario.save();

      await MovimientoInventario.create({
        inventarioId: inventario.id,
        tipo: 'ajuste',
        cantidad,
        motivo,
        usuarioId
      });

      res.json({ message: 'Ajuste registrado', inventario });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Historial de movimientos
  async historialMovimientos(req, res) {
    try {
      const { productoId } = req.params;
      const inventario = await Inventario.findOne({ where: { producto_id: productoId } });
      if (!inventario) return res.status(404).json({ error: 'Inventario no encontrado' });

      const movimientos = await MovimientoInventario.findAll({
        where: { inventarioId: inventario.id },
        order: [['createdAt', 'DESC']]
      });

      res.json(movimientos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new InventarioController();