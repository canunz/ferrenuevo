const express = require('express');
const router = express.Router();
const sistemaController = require('../controllers/sistema.controller');

/**
 * @swagger
 * /api/v1/sistema/health:
 *   get:
 *     summary: Verificar estado del sistema
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Sistema saludable
 *       503:
 *         description: Sistema con problemas
 */
router.get('/health', sistemaController.health);

/**
 * @swagger
 * /api/v1/sistema/info:
 *   get:
 *     summary: Información general del sistema
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Información obtenida exitosamente
 */
router.get('/info', sistemaController.info);

/**
 * @swagger
 * /api/v1/sistema/database:
 *   get:
 *     summary: Estado de la base de datos
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Estado de BD obtenido exitosamente
 */
router.get('/database', sistemaController.database);

/**
 * @swagger
 * /api/v1/sistema/stats:
 *   get:
 *     summary: Estadísticas del sistema
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
router.get('/stats', sistemaController.stats);

module.exports = router;