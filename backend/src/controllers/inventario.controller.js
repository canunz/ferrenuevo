class InventarioController {

  // Listar inventario
  async listarInventario(req, res) {
    try {
      const { page = 1, limit = 10, sucursal_id, stock_bajo, categoria_id } = req.query;

      // Simular inventario
      const inventarioDemo = [
        {
          id: 1,
          stock_actual: 25,
          stock_minimo: 5,
          stock_maximo: 50,
          ubicacion: 'Estante A1-Superior',
          producto: {
            id: 1,
            nombre: 'Taladro Eléctrico DeWalt 20V',
            codigo_sku: 'DW-TAL-20V-001',
            categoria: { id: 1, nombre: 'Herramientas Eléctricas' },
            marca: { id: 1, nombre: 'DeWalt' }
          },
          sucursal: {
            id: 1,
            nombre: 'FERREMAS Centro'
          }
        },
        {
          id: 2,
          stock_actual: 3, // Stock bajo
          stock_minimo: 5,
          stock_maximo: 30,
          ubicacion: 'Estante A2-Centro',
          producto: {
            id: 2,
            nombre: 'Sierra Circular Bosch 7.25"',
            codigo_sku: 'BSH-SIE-725-001',
            categoria: { id: 1, nombre: 'Herramientas Eléctricas' },
            marca: { id: 3, nombre: 'Bosch' }
          },
          sucursal: {
            id: 1,
            nombre: 'FERREMAS Centro'
          }
        }
      ];

      let inventarioFiltrado = inventarioDemo;

      // Filtrar por stock bajo
      if (stock_bajo === 'true') {
        inventarioFiltrado = inventarioDemo.filter(item => item.stock_actual <= item.stock_minimo);
      }

      // Filtrar por sucursal
      if (sucursal_id) {
        inventarioFiltrado = inventarioFiltrado.filter(item => item.sucursal.id == sucursal_id);
      }

      res.json(formatearRespuesta(
        'Inventario obtenido exitosamente',
        inventarioFiltrado,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          total: inventarioFiltrado.length,
          totalPages: Math.ceil(inventarioFiltrado.length / limit)
        }
      ));
    } catch (error) {
      console.error('Error al listar inventario:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
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
}

module.exports = new InventarioController();