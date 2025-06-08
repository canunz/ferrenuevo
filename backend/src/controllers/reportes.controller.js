class ReportesController {

  // Dashboard principal
  async dashboard(req, res) {
    try {
      const { Usuario, Producto, Categoria, Rol } = require('../models');
      
      // Obtener estadísticas reales de la base de datos
      const estadisticas = {
        usuarios: await Usuario.count() || 0,
        productos: await Producto.count() || 0,
        categorias: await Categoria.count() || 0,
        roles: await Rol.count() || 0,
        
        // Estadísticas simuladas para demo
        pedidos: {
          total: 45,
          pendientes: 8,
          aprobados: 32,
          entregados: 28
        },
        ventas: {
          hoy: 1250000,
          mes: 15750000,
          año: 125000000
        },
        inventario: {
          productos_activos: await Producto.count() || 0,
          stock_bajo: 3,
          valor_total: 45000000
        }
      };

      res.json(formatearRespuesta(
        'Dashboard obtenido exitosamente',
        estadisticas
      ));
    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Reporte de ventas
  async reporteVentas(req, res) {
    try {
      const { fecha_inicio, fecha_fin, sucursal_id, vendedor_id } = req.query;

      // Simular reporte de ventas
      const reporteVentas = {
        periodo: {
          inicio: fecha_inicio || '2025-06-01',
          fin: fecha_fin || '2025-06-06'
        },
        resumen: {
          total_ventas: 15750000,
          total_pedidos: 125,
          ticket_promedio: 126000,
          productos_vendidos: 245
        },
        ventas_por_dia: [
          { fecha: '2025-06-01', ventas: 2500000, pedidos: 20 },
          { fecha: '2025-06-02', ventas: 3200000, pedidos: 25 },
          { fecha: '2025-06-03', ventas: 2800000, pedidos: 22 },
          { fecha: '2025-06-04', ventas: 3500000, pedidos: 28 },
          { fecha: '2025-06-05', ventas: 2100000, pedidos: 17 },
          { fecha: '2025-06-06', ventas: 1650000, pedidos: 13 }
        ],
        productos_mas_vendidos: [
          { nombre: 'Taladro Eléctrico DeWalt 20V', cantidad: 45, total: 2699550 },
          { nombre: 'Sierra Circular Bosch 7.25"', cantidad: 32, total: 2879680 },
          { nombre: 'Martillo Stanley 16oz', cantidad: 78, total: 1247220 }
        ],
        ventas_por_categoria: [
          { categoria: 'Herramientas Eléctricas', total: 9500000, porcentaje: 60.3 },
          { categoria: 'Herramientas Manuales', total: 4200000, porcentaje: 26.7 },
          { categoria: 'Construcción', total: 2050000, porcentaje: 13.0 }
        ]
      };

      res.json(formatearRespuesta(
        'Reporte de ventas obtenido exitosamente',
        reporteVentas
      ));
    } catch (error) {
      console.error('Error al generar reporte de ventas:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Reporte de desempeño
  async reporteDesempeno(req, res) {
    try {
      const { fecha_inicio, fecha_fin, sucursal_id } = req.query;

      // Simular reporte de desempeño
      const reporteDesempeno = {
        periodo: {
          inicio: fecha_inicio || '2025-06-01',
          fin: fecha_fin || '2025-06-06'
        },
        pedidos_por_estado: {
          pendiente: 8,
          aprobado: 32,
          preparando: 15,
          listo: 12,
          enviado: 25,
          entregado: 28,
          cancelado: 5
        },
        desempeno_por_vendedor: [
          { vendedor: 'Ana García', pedidos: 45, ventas: 5650000, conversion: 85.2 },
          { vendedor: 'Carlos López', pedidos: 38, ventas: 4820000, conversion: 78.9 },
          { vendedor: 'María Silva', pedidos: 42, ventas: 5280000, conversion: 82.1 }
        ],
        desempeno_por_sucursal: [
          { sucursal: 'FERREMAS Centro', pedidos: 75, ventas: 9500000, conversion: 83.5 },
          { sucursal: 'FERREMAS Norte', pedidos: 50, ventas: 6250000, conversion: 80.2 }
        ],
        tiempos_promedio: {
          procesamiento_pedido: '2.5 horas',
          preparacion_envio: '4.2 horas',
          entrega: '1.8 días'
        },
        tasa_conversion: 81.5,
        satisfaccion_cliente: 4.6
      };

      res.json(formatearRespuesta(
        'Reporte de desempeño obtenido exitosamente',
        reporteDesempeno
      ));
    } catch (error) {
      console.error('Error al generar reporte de desempeño:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Reporte de inventario
  async reporteInventario(req, res) {
    try {
      const { sucursal_id, stock_bajo, categoria_id } = req.query;

      // Simular reporte de inventario
      const reporteInventario = {
        resumen: {
          productos_total: 150,
          valor_total_inventario: 45000000,
          productos_stock_bajo: 12,
          productos_sin_stock: 3
        },
        inventario_por_sucursal: [
          {
            sucursal: 'FERREMAS Centro',
            productos: 95,
            valor: 28500000,
            stock_bajo: 8,
            sin_stock: 2
          },
          {
            sucursal: 'FERREMAS Norte',
            productos: 75,
            valor: 16500000,
            stock_bajo: 4,
            sin_stock: 1
          }
        ],
        productos_stock_bajo: [
          {
            id: 2,
            nombre: 'Sierra Circular Bosch 7.25"',
            stock_actual: 3,
            stock_minimo: 5,
            valor_unitario: 89990,
            sucursal: 'FERREMAS Centro'
          },
          {
            id: 5,
            nombre: 'Lijadora Orbital Makita',
            stock_actual: 1,
            stock_minimo: 3,
            valor_unitario: 45990,
            sucursal: 'FERREMAS Norte'
          }
        ],
        inventario_por_categoria: [
          {
            categoria: 'Herramientas Eléctricas',
            productos: 45,
            valor: 25200000,
            stock_promedio: 15.2
          },
          {
            categoria: 'Herramientas Manuales',
            productos: 65,
            valor: 12800000,
            stock_promedio: 28.5
          },
          {
            categoria: 'Construcción',
            productos: 40,
            valor: 7000000,
            stock_promedio: 22.8
          }
        ],
        rotacion_inventario: {
          alta: 25,
          media: 85,
          baja: 40
        }
      };

      res.json(formatearRespuesta(
        'Reporte de inventario obtenido exitosamente',
        reporteInventario
      ));
    } catch (error) {
      console.error('Error al generar reporte de inventario:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Reporte financiero
  async reporteFinanciero(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      // Simular reporte financiero
      const reporteFinanciero = {
        periodo: {
          inicio: fecha_inicio || '2025-06-01',
          fin: fecha_fin || '2025-06-06'
        },
        ingresos: {
          total: 15750000,
          por_metodo_pago: {
            mercadopago: 9450000,
            transferencia: 4725000,
            efectivo: 1575000
          }
        },
        transacciones: {
          total: 125,
          aprobadas: 118,
          rechazadas: 4,
          pendientes: 3
        },
        ingresos_por_sucursal: [
          {
            sucursal: 'FERREMAS Centro',
            ingresos: 9450000,
            transacciones: 75
          },
          {
            sucursal: 'FERREMAS Norte',
            ingresos: 6300000,
            transacciones: 50
          }
        ],
        ingresos_por_dia: [
          { fecha: '2025-06-01', ingresos: 2500000 },
          { fecha: '2025-06-02', ingresos: 3200000 },
          { fecha: '2025-06-03', ingresos: 2800000 },
          { fecha: '2025-06-04', ingresos: 3500000 },
          { fecha: '2025-06-05', ingresos: 2100000 },
          { fecha: '2025-06-06', ingresos: 1650000 }
        ],
        comisiones: {
          mercadopago: 283500,  // 3% de 9,450,000
          transferencia: 23625,  // 0.5% de 4,725,000
          total: 307125
        },
        ingresos_netos: 15442875
      };

      res.json(formatearRespuesta(
        'Reporte financiero obtenido exitosamente',
        reporteFinanciero
      ));
    } catch (error) {
      console.error('Error al generar reporte financiero:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }
}

module.exports = new ReportesController();