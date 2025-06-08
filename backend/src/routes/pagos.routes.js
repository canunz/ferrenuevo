const express = require('express');
const routerPagos = express.Router();
const pagosController = require('../controllers/pagos.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/pagos/preferencia:
 *   post:
 *     summary: Crear preferencia de pago MercadoPago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedido_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Preferencia creada exitosamente
 */
routerPagos.post('/preferencia', auth.verificarToken, pagosController.crearPreferencia);

/**
 * @swagger
 * /api/v1/pagos/webhook:
 *   post:
 *     summary: Webhook de MercadoPago
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Webhook procesado exitosamente
 */
routerPagos.post('/webhook', pagosController.webhook);

/**
 * @swagger
 * /api/v1/pagos:
 *   get:
 *     summary: Listar pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente
 */
routerPagos.get('/', auth.verificarToken, auth.verificarRol(['administrador', 'contador']), pagosController.listarPagos);

/**
 * @swagger
 * /api/v1/pagos/{id}:
 *   get:
 *     summary: Consultar estado de un pago específico
 *     tags: [Pagos]
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
 *         description: Estado del pago obtenido exitosamente
 */
routerPagos.get('/:id', auth.verificarToken, pagosController.consultarEstadoPago);

module.exports = routerPagos;