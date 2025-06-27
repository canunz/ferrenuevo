// ==========================================
// src/routes/integraciones.routes.js - COMPLETO
// ==========================================

const express = require('express');
const router = express.Router();
const integracionesController = require('../controllers/integraciones.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Integraciones
 *   description: Gestión completa de integraciones externas, API Keys y Webhooks
 */

// MIDDLEWARE: Todas las rutas requieren autenticación de admin
router.use(verificarToken);
router.use(verificarRol(['admin']));

// ==========================================
// RUTAS DE API KEYS
// ==========================================

/**
 * @swagger
 * /api/v1/integraciones/api-keys:
 *   get:
 *     summary: Listar todas las API Keys
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de API Keys con estadísticas
 */
router.get('/api-keys', integracionesController.listarApiKeys);

/**
 * @swagger
 * /api/v1/integraciones/api-keys:
 *   post:
 *     summary: Crear nueva API Key
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: API Key creada exitosamente
 */
router.post('/api-keys', integracionesController.crearApiKey);

/**
 * @swagger
 * /api/v1/integraciones/api-keys/{id}:
 *   put:
 *     summary: Actualizar API Key
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API Key actualizada
 */
router.put('/api-keys/:id', integracionesController.actualizarApiKey);

/**
 * @swagger
 * /api/v1/integraciones/api-keys/{id}:
 *   delete:
 *     summary: Eliminar API Key
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API Key eliminada
 */
router.delete('/api-keys/:id', integracionesController.eliminarApiKey);

/**
 * @swagger
 * /api/v1/integraciones/api-keys/{id}/regenerar:
 *   post:
 *     summary: Regenerar claves de API Key
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Claves regeneradas exitosamente
 */
router.post('/api-keys/:id/regenerar', integracionesController.regenerarClaves);

// ==========================================
// RUTAS DE WEBHOOKS
// ==========================================

/**
 * @swagger
 * /api/v1/integraciones/webhooks:
 *   get:
 *     summary: Listar todos los webhooks
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de webhooks con estadísticas
 */
router.get('/webhooks', integracionesController.listarWebhooks);

/**
 * @swagger
 * /api/v1/integraciones/webhooks:
 *   post:
 *     summary: Crear nuevo webhook
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               url:
 *                 type: string
 *               eventos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Webhook creado exitosamente
 */
router.post('/webhooks', integracionesController.crearWebhook);

/**
 * @swagger
 * /api/v1/integraciones/webhooks/{id}:
 *   put:
 *     summary: Actualizar webhook
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Webhook actualizado
 */
router.put('/webhooks/:id', integracionesController.actualizarWebhook);

/**
 * @swagger
 * /api/v1/integraciones/webhooks/{id}:
 *   delete:
 *     summary: Eliminar webhook
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Webhook eliminado
 */
router.delete('/webhooks/:id', integracionesController.eliminarWebhook);

/**
 * @swagger
 * /api/v1/integraciones/webhooks/{id}/test:
 *   post:
 *     summary: Probar webhook
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Test enviado exitosamente
 */
router.post('/webhooks/:id/test', integracionesController.probarWebhook);

/**
 * @swagger
 * /api/v1/integraciones/webhooks/{id}/logs:
 *   get:
 *     summary: Ver logs de webhook
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Logs del webhook
 */
router.get('/webhooks/:id/logs', integracionesController.verLogsWebhook);

// ==========================================
// RUTAS DE ESTADÍSTICAS Y MONITOREO
// ==========================================

/**
 * @swagger
 * /api/v1/integraciones/estadisticas:
 *   get:
 *     summary: Estadísticas generales de integraciones
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas completas del sistema
 */
router.get('/estadisticas', integracionesController.obtenerEstadisticas);

/**
 * @swagger
 * /api/v1/integraciones/logs-actividad:
 *   get:
 *     summary: Ver logs de actividad del sistema
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: accion
 *         schema:
 *           type: string
 *       - in: query
 *         name: tabla
 *         schema:
 *           type: string
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Logs de actividad
 */
router.get('/logs-actividad', integracionesController.verLogsActividad);

/**
 * @swagger
 * /api/v1/integraciones/configuraciones:
 *   get:
 *     summary: Ver configuraciones del sistema
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuraciones del sistema
 */
router.get('/configuraciones', integracionesController.verConfiguraciones);

/**
 * @swagger
 * /api/v1/integraciones/configuraciones:
 *   put:
 *     summary: Actualizar configuraciones
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Configuraciones actualizadas
 */
router.put('/configuraciones', integracionesController.actualizarConfiguraciones);

// ==========================================
// RUTAS DE HERRAMIENTAS DE DESARROLLO
// ==========================================

/**
 * @swagger
 * /api/v1/integraciones/test-api:
 *   post:
 *     summary: Herramienta de testing de API
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               metodo:
 *                 type: string
 *                 enum: [GET, POST, PUT, DELETE]
 *               headers:
 *                 type: object
 *               body:
 *                 type: object
 *               timeout:
 *                 type: integer
 *                 default: 30
 *     responses:
 *       200:
 *         description: Respuesta del test
 */
router.post('/test-api', integracionesController.testearApi);

/**
 * @swagger
 * /api/v1/integraciones/documentacion:
 *   get:
 *     summary: Generar documentación de API
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documentación de API generada
 */
router.get('/documentacion', integracionesController.generarDocumentacion);

/**
 * @swagger
 * /api/v1/integraciones/salud-sistema:
 *   get:
 *     summary: Health check del sistema de integraciones
 *     tags: [Integraciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de salud del sistema
 */
router.get('/salud-sistema', integracionesController.healthCheck);

// ==========================================
// RUTAS PÚBLICAS PARA API EXTERNA
// ==========================================

/**
 * @swagger
 * /api/v1/integraciones/webhook-receiver:
 *   post:
 *     summary: Receptor genérico de webhooks
 *     tags: [Integraciones]
 *     description: Endpoint público para recibir webhooks de sistemas externos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Webhook recibido exitosamente
 */
router.post('/webhook-receiver', integracionesController.recibirWebhook);

module.exports = router;