const express = require('express');
const routerDivisas = express.Router();
const divisasController = require('../controllers/divisas.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/divisas/tipos-cambio:
 *   get:
 *     summary: Obtener tipos de cambio del Banco Central
 *     tags: [Divisas]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha para consultar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Tipos de cambio obtenidos exitosamente
 */
routerDivisas.get('/tipos-cambio', divisasController.obtenerTiposCambio);

/**
 * @swagger
 * /api/v1/divisas/convertir:
 *   get:
 *     summary: Convertir entre divisas
 *     tags: [Divisas]
 *     parameters:
 *       - in: query
 *         name: monto
 *         required: true
 *         schema:
 *           type: number
 *         example: 100
 *       - in: query
 *         name: desde
 *         required: true
 *         schema:
 *           type: string
 *         example: CLP
 *       - in: query
 *         name: hacia
 *         required: true
 *         schema:
 *           type: string
 *         example: USD
 *     responses:
 *       200:
 *         description: Conversión realizada exitosamente
 */
routerDivisas.get('/convertir', divisasController.convertirMoneda);

/**
 * @swagger
 * /api/v1/divisas/actualizar:
 *   post:
 *     summary: Actualizar tasas de cambio
 *     tags: [Divisas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasas actualizadas exitosamente
 */
routerDivisas.post('/actualizar', auth.verificarToken, auth.verificarRol(['administrador']), divisasController.actualizarTasas);

module.exports = routerDivisas;