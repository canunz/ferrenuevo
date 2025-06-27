// src/routes/integraciones.routes.js (ARCHIVO NUEVO)
const express = require('express');
const router = express.Router();
const integracionesController = require('../controllers/integraciones.controller');

// API KEYS
router.get('/api-keys', integracionesController.listarApiKeys);
router.post('/api-keys', integracionesController.generarApiKey);

// WEBHOOKS
router.post('/webhooks', integracionesController.configurarWebhook);
router.get('/webhooks/logs', integracionesController.logsWebhooks);

// ESTADÍSTICAS
router.get('/stats', integracionesController.estadisticasIntegraciones);

module.exports = router;