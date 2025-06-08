const { sequelize, Usuario, Producto, Pedido, Pago } = require('../models');
const os = require('os');

const formatearError = (mensaje) => ({
  success: false,
  error: mensaje,
  timestamp: new Date().toISOString()
});

const formatearRespuesta = (mensaje, datos = null) => ({
  success: true,
  message: mensaje,
  ...(datos && { data: datos }),
  timestamp: new Date().toISOString()
});

class SistemaController {
  // Health check del sistema
  async health(req, res) {
    try {
      const startTime = Date.now();
      
      // Verificar conectividad de base de datos
      await sequelize.authenticate();
      const dbResponseTime = Date.now() - startTime;

      // Verificar memoria del sistema
      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

      // Determinar estado del sistema
      const isHealthy = dbResponseTime < 1000 && memoryUsagePercent < 90;

      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        system: {
          node_version: process.version,
          platform: os.platform(),
          arch: os.arch()
        },
        database: {
          status: 'connected',
          response_time_ms: dbResponseTime
        },
        memory: {
          usage_percent: parseFloat(memoryUsagePercent),
          used_mb: Math.round(usedMemory / 1024 / 1024),
          total_mb: Math.round(totalMemory / 1024 / 1024),
          node_usage: {
            rss_mb: Math.round(memoryUsage.rss / 1024 / 1024),
            heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024)
          }
        },
        checks: {
          database: '✅ Connected',
          memory: memoryUsagePercent < 90 ? '✅ Normal' : '⚠️ High',
          response_time: dbResponseTime < 1000 ? '✅ Fast' : '⚠️ Slow'
        }
      });

    } catch (error) {
      console.error('Error en health check:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Sistema no disponible',
        details: error.message
      });
    }
  }

  // Información general del sistema
  async info(req, res) {
    try {
      const packageInfo = require('../../../package.json');
      
      res.json(formatearRespuesta(
        'Información del sistema obtenida exitosamente',
        {
          aplicacion: {
            nombre: 'FERREMAS API',
            version: packageInfo.version || '1.0.0',
            descripcion: 'Sistema de comercio electrónico para ferreterías',
            autor: 'Equipo FERREMAS',
            entorno: process.env.NODE_ENV || 'development'
          },
          servidor: {
            node_version: process.version,
            plataforma: os.platform(),
            arquitectura: os.arch(),
            hostname: os.hostname(),
            uptime_segundos: Math.floor(process.uptime()),
            uptime_formateado: this.formatearUptime(process.uptime())
          },
          sistema: {
            cpu_cores: os.cpus().length,
            memoria_total_gb: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
            memoria_libre_gb: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
            load_average: os.loadavg()
          },
          api: {
            documentacion: '/api-docs',
            base_url: '/api/v1',
            endpoints_totales: 45,
            modulos: [
              '🔐 Autenticación',
              '🛍️ Productos',
              '📦 Pedidos',
              '💳 Pagos',
              '📊 Inventario',
              '💱 Divisas',
              '📈 Reportes',
              '👥 Usuarios',
              '⚙️ Sistema'
            ]
          },
          funcionalidades: {
            autenticacion_jwt: true,
            catalogo_productos: true,
            gestion_pedidos: true,
            procesamiento_pagos: true,
            control_inventario: true,
            conversion_divisas: true,
            reportes_empresariales: true,
            documentacion_swagger: true
          }
        }
      ));

    } catch (error) {
      console.error('Error al obtener información del sistema:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Estado de la base de datos
  async database(req, res) {
    try {
      const startTime = Date.now();
      
      // Test de conectividad
      await sequelize.authenticate();
      const connectionTime = Date.now() - startTime;

      // Obtener información de la base de datos
      const dbInfo = sequelize.config;
      
      // Test de queries básicas
      const queryStartTime = Date.now();
      const testQuery = await sequelize.query('SELECT 1 as test', { 
        type: sequelize.QueryTypes.SELECT 
      });
      const queryTime = Date.now() - queryStartTime;

      // Información de las tablas
      const tablas = await sequelize.getQueryInterface().showAllTables();

      res.json(formatearRespuesta(
        'Estado de la base de datos obtenido exitosamente',
        {
          estado: 'conectada',
          configuracion: {
            host: dbInfo.host,
            puerto: dbInfo.port,
            base_datos: dbInfo.database,
            dialecto: dbInfo.dialect,
            zona_horaria: dbInfo.timezone || 'UTC'
          },
          rendimiento: {
            tiempo_conexion_ms: connectionTime,
            tiempo_query_ms: queryTime,
            estado_conexion: connectionTime < 1000 ? '✅ Rápida' : '⚠️ Lenta',
            estado_query: queryTime < 100 ? '✅ Rápida' : '⚠️ Lenta'
          },
          estructura: {
            total_tablas: tablas.length,
            tablas: tablas.sort(),
            modelos_sequelize: [
              'Usuario', 'Rol', 'Producto', 'Categoria', 'Marca',
              'Pedido', 'DetallePedido', 'Pago', 'MetodoPago',
              'Inventario', 'Divisa', 'HistorialPrecio'
            ]
          },
          pool_conexiones: {
            max: dbInfo.pool?.max || 5,
            min: dbInfo.pool?.min || 0,
            acquire: dbInfo.pool?.acquire || 60000,
            idle: dbInfo.pool?.idle || 10000
          },
          test_query: {
            resultado: testQuery[0]?.test === 1 ? '✅ Exitoso' : '❌ Fallido',
            tiempo_ms: queryTime
          }
        }
      ));

    } catch (error) {
      console.error('Error al verificar estado de la base de datos:', error);
      res.status(500).json(formatearError('Error de conexión a la base de datos: ' + error.message));
    }
  }

  // Estadísticas del sistema
  async stats(req, res) {
    try {
      const estadisticas = {};

      // Estadísticas de usuarios
      try {
        estadisticas.usuarios = {
          total: await Usuario.count(),
          activos: await Usuario.count({ where: { activo: true } }),
          inactivos: await Usuario.count({ where: { activo: false } })
        };
      } catch (error) {
        estadisticas.usuarios = { error: 'No disponible' };
      }

      // Estadísticas de productos
      try {
        estadisticas.productos = {
          total: await Producto.count(),
          activos: await Producto.count({ where: { activo: true } }),
          inactivos: await Producto.count({ where: { activo: false } })
        };
      } catch (error) {
        estadisticas.productos = { error: 'No disponible' };
      }

      // Estadísticas de pedidos
      try {
        const totalPedidos = await Pedido.count();
        const pedidosPendientes = await Pedido.count({ where: { estado: 'pendiente' } });
        const pedidosEntregados = await Pedido.count({ where: { estado: 'entregado' } });

        estadisticas.pedidos = {
          total: totalPedidos,
          pendientes: pedidosPendientes,
          entregados: pedidosEntregados,
          otros_estados: totalPedidos - pedidosPendientes - pedidosEntregados
        };
      } catch (error) {
        estadisticas.pedidos = { error: 'No disponible' };
      }

      // Estadísticas de pagos
      try {
        estadisticas.pagos = {
          total: await Pago.count(),
          aprobados: await Pago.count({ where: { estado: 'aprobado' } }),
          pendientes: await Pago.count({ where: { estado: 'pendiente' } }),
          rechazados: await Pago.count({ where: { estado: 'rechazado' } })
        };
      } catch (error) {
        estadisticas.pagos = { error: 'No disponible' };
      }

      // Estadísticas del sistema
      const memoryUsage = process.memoryUsage();
      estadisticas.sistema = {
        uptime_formateado: this.formatearUptime(process.uptime()),
        memoria_node: {
          heap_usado_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          rss_mb: Math.round(memoryUsage.rss / 1024 / 1024)
        },
        cpu: {
          cores: os.cpus().length,
          modelo: os.cpus()[0]?.model || 'No disponible',
          load_average: os.loadavg()
        }
      };

      // Resumen ejecutivo
      const resumen = {
        estado_general: '✅ Sistema operativo',
        modulos_activos: 9,
        usuarios_registrados: estadisticas.usuarios.total || 0,
        productos_catalogados: estadisticas.productos.total || 0,
        pedidos_procesados: estadisticas.pedidos.total || 0,
        transacciones_realizadas: estadisticas.pagos.total || 0
      };

      res.json(formatearRespuesta(
        'Estadísticas del sistema obtenidas exitosamente',
        {
          resumen_ejecutivo: resumen,
          estadisticas_detalladas: estadisticas,
          fecha_consulta: new Date().toISOString(),
          periodo: 'Histórico completo'
        }
      ));

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Función auxiliar para formatear uptime
  formatearUptime(uptime) {
    const segundos = Math.floor(uptime % 60);
    const minutos = Math.floor((uptime / 60) % 60);
    const horas = Math.floor((uptime / 3600) % 24);
    const dias = Math.floor(uptime / 86400);

    if (dias > 0) {
      return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m ${segundos}s`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos}s`;
    } else {
      return `${segundos}s`;
    }
  }
}

module.exports = new SistemaController();