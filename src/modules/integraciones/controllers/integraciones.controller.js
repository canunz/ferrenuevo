// src/controllers/integraciones.controller.js (ARCHIVO NUEVO)
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'emma2004',
  database: process.env.DB_NAME || 'ferremasnueva'
};

class IntegracionesController {
  // 🔑 GENERAR API KEY
  async generarApiKey(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const { nombre, descripcion, permisos } = req.body;
      
      if (!nombre) {
        return res.status(400).json({
          success: false,
          message: 'Nombre requerido para la API Key'
        });
      }

      const apiKey = 'fmas_' + crypto.randomBytes(32).toString('hex');
      const secretKey = crypto.randomBytes(64).toString('hex');

      const [result] = await connection.execute(`
        INSERT INTO api_keys (
          nombre, descripcion, api_key, secret_key, permisos, activo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())
      `, [nombre, descripcion, apiKey, secretKey, JSON.stringify(permisos || [])]);

      res.status(201).json({
        success: true,
        message: 'API Key generada exitosamente',
        data: {
          id: result.insertId,
          nombre,
          api_key: apiKey,
          secret_key: secretKey,
          permisos
        }
      });

    } catch (error) {
      console.error('Error al generar API Key:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar API Key',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 📋 LISTAR API KEYS
  async listarApiKeys(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const [apiKeys] = await connection.execute(`
        SELECT 
          id, nombre, descripcion, api_key, permisos, activo,
          created_at, updated_at, ultimo_uso
        FROM api_keys
        ORDER BY created_at DESC
      `);

      res.json({
        success: true,
        data: apiKeys.map(key => ({
          ...key,
          permisos: key.permisos ? JSON.parse(key.permisos) : [],
          secret_key: '***' // Ocultar secret key por seguridad
        }))
      });

    } catch (error) {
      console.error('Error al listar API Keys:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener API Keys',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 🔧 CONFIGURAR WEBHOOK
  async configurarWebhook(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const { nombre, url, eventos, secret, activo = true } = req.body;

      if (!nombre || !url || !eventos || !Array.isArray(eventos)) {
        return res.status(400).json({
          success: false,
          message: 'Campos requeridos: nombre, url, eventos (array)'
        });
      }

      const webhookSecret = secret || crypto.randomBytes(32).toString('hex');

      const [result] = await connection.execute(`
        INSERT INTO webhooks (
          nombre, url, eventos, secret, activo, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `, [nombre, url, JSON.stringify(eventos), webhookSecret, activo]);

      res.status(201).json({
        success: true,
        message: 'Webhook configurado exitosamente',
        data: {
          id: result.insertId,
          nombre, url, eventos,
          secret: webhookSecret,
          activo
        }
      });

    } catch (error) {
      console.error('Error al configurar webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Error al configurar webhook',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 📊 ESTADÍSTICAS DE INTEGRACIONES
  async estadisticasIntegraciones(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const [apiKeyStats] = await connection.execute(`
        SELECT COUNT(*) as total_api_keys,
               SUM(activo) as api_keys_activas
        FROM api_keys
      `);

      const [webhookStats] = await connection.execute(`
        SELECT COUNT(*) as total_webhooks,
               SUM(activo) as webhooks_activos
        FROM webhooks
      `);

      const [recentLogs] = await connection.execute(`
        SELECT COUNT(*) as webhooks_ultimo_dia
        FROM webhook_logs 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
      `);

      res.json({
        success: true,
        data: {
          api_keys: {
            total: apiKeyStats[0].total_api_keys,
            activas: apiKeyStats[0].api_keys_activas
          },
          webhooks: {
            total: webhookStats[0].total_webhooks,
            activos: webhookStats[0].webhooks_activos,
            envios_ultimo_dia: recentLogs[0].webhooks_ultimo_dia
          }
        }
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 📜 LOGS DE WEBHOOKS
  async logsWebhooks(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const { page = 1, limit = 50, webhook_id } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = '';
      let params = [];

      if (webhook_id) {
        whereClause = 'WHERE wl.webhook_id = ?';
        params.push(webhook_id);
      }

      const [logs] = await connection.execute(`
        SELECT 
          wl.id, wl.evento, wl.response_status, wl.created_at,
          w.nombre as webhook_nombre, w.url as webhook_url
        FROM webhook_logs wl
        JOIN webhooks w ON wl.webhook_id = w.id
        ${whereClause}
        ORDER BY wl.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: logs
      });

    } catch (error) {
      console.error('Error al obtener logs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener logs',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }
}

module.exports = new IntegracionesController();