const express = require('express');
const router = express.Router();
const transbankController = require('../../controllers/transbank.controller');
const { check } = require('express-validator');
const { verificarToken } = require('../middleware/auth');

// Middleware de autenticación
router.use(verificarToken);

/**
 * @swagger
 * /api/v1/pagos/crear:
 *   post:
 *     summary: Crear una transacción Webpay
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *               - orden_compra
 *               - session_id
 *               - return_url
 *             properties:
 *               monto:
 *                 type: number
 *                 example: 19990
 *               orden_compra:
 *                 type: string
 *                 example: "ORD-12345"
 *               session_id:
 *                 type: string
 *                 example: "session-abc123"
 *               return_url:
 *                 type: string
 *                 example: "https://tusitio.cl/retorno"
 *     responses:
 *       200:
 *         description: Transacción creada exitosamente
 */
router.post('/crear', [
  check('monto', 'El monto es obligatorio').isNumeric(),
  check('orden_compra', 'La orden de compra es obligatoria').not().isEmpty(),
  check('session_id', 'El ID de sesión es obligatorio').not().isEmpty(),
  check('return_url', 'La URL de retorno es obligatoria').isURL()
], transbankController.crearTransaccion);

/**
 * @swagger
 * /api/v1/pagos/confirmar:
 *   post:
 *     summary: Confirmar una transacción Webpay
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token_ws
 *             properties:
 *               token_ws:
 *                 type: string
 *                 example: "token123abc"
 *     responses:
 *       200:
 *         description: Transacción confirmada exitosamente
 */
router.post('/confirmar', transbankController.confirmarTransaccion);

/**
 * @swagger
 * /api/v1/pagos/estado/{token}:
 *   get:
 *     summary: Obtener estado de una transacción Webpay
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de la transacción
 *     responses:
 *       200:
 *         description: Estado de la transacción obtenido exitosamente
 */
router.get('/estado/:token', transbankController.obtenerEstadoTransaccion);

/**
 * @swagger
 * /api/v1/pagos/reembolsar:
 *   post:
 *     summary: Reembolsar una transacción Webpay
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - monto
 *             properties:
 *               token:
 *                 type: string
 *                 example: "token123abc"
 *               monto:
 *                 type: number
 *                 example: 19990
 *     responses:
 *       200:
 *         description: Reembolso realizado exitosamente
 */
router.post('/reembolsar', transbankController.reembolsarTransaccion);

module.exports = router;