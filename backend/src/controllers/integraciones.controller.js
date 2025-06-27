// ==========================================
// src/controllers/integraciones.controller.js - SIN AXIOS (TEMPORAL)
// ==========================================

const mysql = require('mysql2/promise');
const pool = require('../config/database');
const crypto = require('crypto');
// const axios = require('axios'); // COMENTADO TEMPORALMENTE

class IntegracionesController {

  // ==========================================
  // GESTIÓN DE API KEYS
  // ==========================================

  // Listar todas las API Keys
  async listarApiKeys(req, res) {
    try {
      const { page = 1, limit = 10, activo } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereClause = '';
      let params = [];

      if (activo !== undefined) {
        whereClause = 'WHERE activo = ?';
        params.push(parseInt(activo));
      }

      const query = `
        SELECT 
          id, nombre, descripcion,
          CONCAT(SUBSTRING(api_key, 1, 8), '...') as api_key_masked,
          permisos, activo, ultimo_uso, created_at, updated_at
        FROM api_keys 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      params.push(parseInt(limit), offset);
      const [apiKeys] = await pool.execute(query, params);

      // Contar total
      const countQuery = `SELECT COUNT(*) as total FROM api_keys ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, params.slice(0, -2));

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limit));

      // Obtener estadísticas de uso
      const [estadisticas] = await pool.execute(`
        SELECT 
          COUNT(*) as total_keys,
          SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as activas,
          SUM(CASE WHEN ultimo_uso IS NOT NULL THEN 1 ELSE 0 END) as con_uso,
          MAX(ultimo_uso) as ultimo_uso_global
        FROM api_keys
      `);

      // Procesar permisos JSON
      apiKeys.forEach(key => {
        try {
          key.permisos = JSON.parse(key.permisos || '[]');
        } catch {
          key.permisos = [];
        }
      });

      res.json({
        success: true,
        data: {
          api_keys: apiKeys,
          paginacion: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          },
          estadisticas: estadisticas[0]
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar API Keys:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las API Keys',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Crear nueva API Key
  async crearApiKey(req, res) {
    try {
      const { nombre, descripcion, permisos = [] } = req.body;

      if (!nombre) {
        return res.status(400).json({
          success: false,
          error: 'Datos faltantes',
          message: 'El nombre es obligatorio',
          timestamp: new Date().toISOString()
        });
      }

      // Generar claves únicas
      const apiKey = 'ak_' + crypto.randomBytes(16).toString('hex');
      const secretKey = 'sk_' + crypto.randomBytes(20).toString('hex');

      // Insertar API Key
      const [result] = await pool.execute(`
        INSERT INTO api_keys (nombre, descripcion, api_key, secret_key, permisos, activo)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [nombre, descripcion, apiKey, secretKey, JSON.stringify(permisos)]);

      res.status(201).json({
        success: true,
        message: 'API Key creada exitosamente',
        data: {
          id: result.insertId,
          nombre,
          descripcion,
          api_key: apiKey,
          secret_key: secretKey,
          permisos,
          activo: true
        },
        warning: 'Guarda estas claves en un lugar seguro. No se mostrarán nuevamente.',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al crear API Key:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo crear la API Key',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Actualizar API Key
  async actualizarApiKey(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, permisos, activo } = req.body;

      const [existeKey] = await pool.execute(
        'SELECT id FROM api_keys WHERE id = ?',
        [id]
      );

      if (existeKey.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'API Key no encontrada',
          message: 'La API Key especificada no existe',
          timestamp: new Date().toISOString()
        });
      }

      await pool.execute(`
        UPDATE api_keys 
        SET nombre = ?, descripcion = ?, permisos = ?, activo = ?, updated_at = NOW()
        WHERE id = ?
      `, [nombre, descripcion, JSON.stringify(permisos), activo, id]);

      res.json({
        success: true,
        message: 'API Key actualizada exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al actualizar API Key:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la API Key',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Eliminar API Key
  async eliminarApiKey(req, res) {
    try {
      const { id } = req.params;

      const [existeKey] = await pool.execute(
        'SELECT nombre FROM api_keys WHERE id = ?',
        [id]
      );

      if (existeKey.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'API Key no encontrada',
          message: 'La API Key especificada no existe',
          timestamp: new Date().toISOString()
        });
      }

      await pool.execute('DELETE FROM api_keys WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'API Key eliminada exitosamente',
        data: { eliminada: existeKey[0].nombre },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al eliminar API Key:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la API Key',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Regenerar claves de API Key
  async regenerarClaves(req, res) {
    try {
      const { id } = req.params;

      const [existeKey] = await pool.execute(
        'SELECT nombre FROM api_keys WHERE id = ?',
        [id]
      );

      if (existeKey.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'API Key no encontrada',
          message: 'La API Key especificada no existe',
          timestamp: new Date().toISOString()
        });
      }

      // Generar nuevas claves
      const nuevoApiKey = 'ak_' + crypto.randomBytes(16).toString('hex');
      const nuevoSecretKey = 'sk_' + crypto.randomBytes(20).toString('hex');

      await pool.execute(`
        UPDATE api_keys 
        SET api_key = ?, secret_key = ?, updated_at = NOW()
        WHERE id = ?
      `, [nuevoApiKey, nuevoSecretKey, id]);

      res.json({
        success: true,
        message: 'Claves regeneradas exitosamente',
        data: {
          api_key: nuevoApiKey,
          secret_key: nuevoSecretKey
        },
        warning: 'Las claves anteriores ya no son válidas. Actualiza tus integraciones.',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al regenerar claves:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron regenerar las claves',
        timestamp: new Date().toISOString()
      });
    }
  }

  // ==========================================
  // GESTIÓN DE WEBHOOKS
  // ==========================================

  // Listar webhooks
  async listarWebhooks(req, res) {
    try {
      const { page = 1, limit = 10, activo } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereClause = '';
      let params = [];

      if (activo !== undefined) {
        whereClause = 'WHERE activo = ?';
        params.push(parseInt(activo));
      }

      const query = `
        SELECT 
          w.*,
          COUNT(wl.id) as total_logs,
          MAX(wl.created_at) as ultimo_llamado
        FROM webhooks w
        LEFT JOIN webhook_logs wl ON w.id = wl.webhook_id
        ${whereClause}
        GROUP BY w.id
        ORDER BY w.created_at DESC
        LIMIT ? OFFSET ?
      `;

      params.push(parseInt(limit), offset);
      const [webhooks] = await pool.execute(query, params);

      // Contar total
      const countQuery = `SELECT COUNT(*) as total FROM webhooks ${whereClause}`;
      const [countResult] = await pool.execute(countQuery, params.slice(0, -2));

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limit));

      // Procesar eventos JSON y ocultar secret
      webhooks.forEach(webhook => {
        try {
          webhook.eventos = JSON.parse(webhook.eventos || '[]');
        } catch {
          webhook.eventos = [];
        }
        webhook.secret = '***';
      });

      res.json({
        success: true,
        data: {
          webhooks,
          paginacion: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar webhooks:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los webhooks',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Crear webhook
  async crearWebhook(req, res) {
    try {
      const { nombre, url, eventos = [] } = req.body;

      if (!nombre || !url) {
        return res.status(400).json({
          success: false,
          error: 'Datos faltantes',
          message: 'Nombre y URL son obligatorios',
          timestamp: new Date().toISOString()
        });
      }

      // Validar URL básica
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({
          success: false,
          error: 'URL inválida',
          message: 'La URL debe comenzar con http:// o https://',
          timestamp: new Date().toISOString()
        });
      }

      // Generar secret para webhook
      const secret = crypto.randomBytes(32).toString('hex');

      const [result] = await pool.execute(`
        INSERT INTO webhooks (nombre, url, eventos, secret, activo)
        VALUES (?, ?, ?, ?, 1)
      `, [nombre, url, JSON.stringify(eventos), secret]);

      res.status(201).json({
        success: true,
        message: 'Webhook creado exitosamente',
        data: {
          id: result.insertId,
          nombre,
          url,
          eventos,
          secret,
          activo: true
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al crear webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo crear el webhook',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Actualizar webhook
  async actualizarWebhook(req, res) {
    try {
      const { id } = req.params;
      const { nombre, url, eventos, activo } = req.body;

      const [existeWebhook] = await pool.execute(
        'SELECT id FROM webhooks WHERE id = ?',
        [id]
      );

      if (existeWebhook.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Webhook no encontrado',
          message: 'El webhook especificado no existe',
          timestamp: new Date().toISOString()
        });
      }

      await pool.execute(`
        UPDATE webhooks 
        SET nombre = ?, url = ?, eventos = ?, activo = ?, updated_at = NOW()
        WHERE id = ?
      `, [nombre, url, JSON.stringify(eventos), activo, id]);

      res.json({
        success: true,
        message: 'Webhook actualizado exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al actualizar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar el webhook',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Eliminar webhook
  async eliminarWebhook(req, res) {
    try {
      const { id } = req.params;

      const [existeWebhook] = await pool.execute(
        'SELECT nombre FROM webhooks WHERE id = ?',
        [id]
      );

      if (existeWebhook.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Webhook no encontrado',
          message: 'El webhook especificado no existe',
          timestamp: new Date().toISOString()
        });
      }

      await pool.execute('DELETE FROM webhooks WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Webhook eliminado exitosamente',
        data: { eliminado: existeWebhook[0].nombre },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al eliminar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar el webhook',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Probar webhook (sin axios por ahora)
  async probarWebhook(req, res) {
    try {
      const { id } = req.params;

      const [webhooks] = await pool.execute(
        'SELECT * FROM webhooks WHERE id = ? AND activo = 1',
        [id]
      );

      if (webhooks.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Webhook no encontrado',
          message: 'El webhook no existe o está inactivo',
          timestamp: new Date().toISOString()
        });
      }

      const webhook = webhooks[0];

      // Payload de prueba
      const testPayload = {
        evento: 'test',
        timestamp: new Date().toISOString(),
        data: {
          mensaje: 'Este es un test del webhook',
          origen: 'Ferremas API'
        }
      };

      // Por ahora, simular respuesta exitosa hasta que axios esté instalado
      await pool.execute(`
        INSERT INTO webhook_logs (webhook_id, evento, payload, response_status)
        VALUES (?, ?, ?, ?)
      `, [id, 'test_simulated', JSON.stringify(testPayload), 200]);

      res.json({
        success: true,
        message: 'Test de webhook simulado (instala axios para pruebas reales)',
        data: {
          status_response: 200,
          webhook_url: webhook.url,
          payload_enviado: testPayload,
          nota: 'Ejecuta "npm install axios" para pruebas reales de webhooks'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al probar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo probar el webhook',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Ver logs de webhook
  async verLogsWebhook(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const [logs] = await pool.execute(`
        SELECT * FROM webhook_logs 
        WHERE webhook_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [id, parseInt(limit), offset]);

      const [countResult] = await pool.execute(
        'SELECT COUNT(*) as total FROM webhook_logs WHERE webhook_id = ?',
        [id]
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limit));

      // Procesar payload JSON
      logs.forEach(log => {
        try {
          log.payload = JSON.parse(log.payload || '{}');
        } catch {
          log.payload = {};
        }
      });

      res.json({
        success: true,
        data: {
          logs,
          paginacion: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al obtener logs de webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los logs del webhook',
        timestamp: new Date().toISOString()
      });
    }
  }

  // ==========================================
  // ESTADÍSTICAS BÁSICAS
  // ==========================================

  // Obtener estadísticas generales
  async obtenerEstadisticas(req, res) {
    try {
      // Estadísticas de API Keys
      const [apiKeysStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_keys,
          SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as activas,
          SUM(CASE WHEN ultimo_uso >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as usadas_ultima_semana
        FROM api_keys
      `);

      // Estadísticas de Webhooks
      const [webhooksStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_webhooks,
          SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) as activos
        FROM webhooks
      `);

      // Estadísticas de logs de webhooks (últimos 30 días)
      const [logsStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_llamadas,
          SUM(CASE WHEN response_status BETWEEN 200 AND 299 THEN 1 ELSE 0 END) as exitosas,
          SUM(CASE WHEN response_status >= 400 THEN 1 ELSE 0 END) as errores
        FROM webhook_logs 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);

      res.json({
        success: true,
        data: {
          resumen: {
            api_keys: apiKeysStats[0],
            webhooks: webhooksStats[0],
            logs_webhooks: logsStats[0]
          }
        },
        nota: 'Instala axios para estadísticas más detalladas',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Placeholder para otras funciones hasta que axios esté instalado
  async verLogsActividad(req, res) {
    res.status(501).json({
      success: false,
      message: 'Función no implementada',
      info: 'Instala axios para funcionalidad completa',
      timestamp: new Date().toISOString()
    });
  }

  async verConfiguraciones(req, res) {
    res.status(501).json({
      success: false,
      message: 'Función no implementada',
      info: 'Instala axios para funcionalidad completa',
      timestamp: new Date().toISOString()
    });
  }

  async actualizarConfiguraciones(req, res) {
    res.status(501).json({
      success: false,
      message: 'Función no implementada',
      info: 'Instala axios para funcionalidad completa',
      timestamp: new Date().toISOString()
    });
  }

  async testearApi(req, res) {
    res.status(501).json({
      success: false,
      message: 'Función no implementada',
      info: 'Instala axios para pruebas de API externas',
      timestamp: new Date().toISOString()
    });
  }

  async generarDocumentacion(req, res) {
    res.json({
      success: true,
      message: 'Documentación básica de API',
      data: {
        informacion_general: {
          nombre: 'Ferremas API',
          version: '2.0.0',
          descripcion: 'API REST para gestión de productos, promociones e integraciones'
        },
        endpoints_principales: [
          'GET /api/v1/productos - Listar productos',
          'GET /api/v1/integraciones/api-keys - Gestionar API Keys',
          'POST /api/v1/promociones-admin/validar-cupon - Validar cupones'
        ],
        nota: 'Instala axios para documentación completa'
      },
      timestamp: new Date().toISOString()
    });
  }

  async healthCheck(req, res) {
    try {
      await pool.execute('SELECT 1');
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: { status: 'healthy', message: 'Conexión exitosa' },
          integraciones: { status: 'basic', message: 'Funcionalidad básica activa' }
        },
        nota: 'Instala axios para health check completo'
      });

    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async recibirWebhook(req, res) {
    try {
      const payload = req.body;
      
      console.log('Webhook recibido:', {
        timestamp: new Date().toISOString(),
        payload: payload
      });

      res.json({
        success: true,
        message: 'Webhook recibido exitosamente',
        data: {
          timestamp: new Date().toISOString(),
          payload_size: JSON.stringify(payload).length
        }
      });

    } catch (error) {
      console.error('Error al procesar webhook:', error);
      res.status(500).json({
        success: false,
        error: 'Error procesando webhook',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new IntegracionesController();