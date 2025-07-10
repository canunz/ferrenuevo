const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const pedidosController = require('../controllers/pedidos.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      message: 'Los datos proporcionados no son válidos',
      detalles: errors.array().map(error => ({
        campo: error.path || error.param,
        valor: error.value,
        mensaje: error.msg
      })),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         usuario:
 *           type: string
 *         total:
 *           type: number
 *         estado:
 *           type: string
 *           enum: [pendiente, confirmado, en_preparacion, enviado, entregado, cancelado]
 *         metodo_entrega:
 *           type: string
 *           enum: [retiro_tienda, domicilio, express]
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio_unitario:
 *                 type: number
 */

/**
 * @swagger
 * /api/v1/pedidos:
 *   post:
 *     summary: Crear nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productos
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto_id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio_unitario:
 *                       type: number
 *               metodo_entrega:
 *                 type: string
 *                 enum: [retiro_tienda, domicilio, express]
 *               direccion_entrega:
 *                 type: string
 *               notas:
 *                 type: string
 *               metodo_pago:
 *                 type: string
 *               cupon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post('/',
  verificarToken,
  [
    body('productos')
      .isArray({ min: 1 })
      .withMessage('Debe incluir al menos un producto'),
    body('productos.*.producto_id')
      .isInt({ min: 1 })
      .withMessage('ID de producto inválido'),
    body('productos.*.cantidad')
      .isInt({ min: 1 })
      .withMessage('Cantidad debe ser mayor a 0'),
    body('productos.*.precio_unitario')
      .isFloat({ min: 0 })
      .withMessage('Precio unitario inválido'),
    body('metodo_entrega')
      .optional()
      .isIn(['retiro_tienda', 'domicilio', 'express'])
      .withMessage('Método de entrega inválido'),
    body('direccion_entrega')
      .optional()
      .isString(),
    body('notas')
      .optional()
      .isString(),
    body('metodo_pago')
      .optional()
      .isString()
      .withMessage('Método de pago inválido'),
    body('cupon')
      .optional()
      .isString()
      .withMessage('Cupón inválido'),
    handleValidationErrors
  ],
  pedidosController.crearPedido
);

/**
 * @swagger
 * /api/v1/pedidos:
 *   get:
 *     summary: Listar pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Pedidos por página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente
 */
router.get('/',
  verificarToken,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('estado').optional().isIn(['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado']),
    handleValidationErrors
  ],
  pedidosController.listarPedidos
);

/**
 * @swagger
 * /api/v1/pedidos/{id}:
 *   get:
 *     summary: Obtener pedido específico
 *     tags: [Pedidos]
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
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', verificarToken, pedidosController.obtenerPedido);

/**
 * @swagger
 * /api/v1/pedidos/{id}/estado:
 *   put:
 *     summary: Cambiar estado del pedido (Solo admin/vendedor)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, confirmado, en_preparacion, enviado, entregado, cancelado]
 *               notas:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       403:
 *         description: Sin permisos
 */
router.put('/:id/estado',
  verificarToken,
  [
    body('estado')
      .isIn(['pendiente', 'aprobado', 'rechazado', 'preparando', 'listo', 'enviado', 'entregado', 'cancelado'])
      .withMessage('Estado inválido'),
    body('notas')
      .optional()
      .isString(),
    handleValidationErrors
  ],
  pedidosController.cambiarEstado
);

/**
 * @swagger
 * /api/v1/pedidos/{id}/historial:
 *   get:
 *     summary: Obtener historial de estados de un pedido
 *     tags: [Pedidos]
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
 *         description: Historial de estados obtenido exitosamente
 *       404:
 *         description: Pedido no encontrado
 *       403:
 *         description: Sin permisos
 */
router.get('/:id/historial', verificarToken, pedidosController.obtenerHistorialEstados);

/**
 * @swagger
 * /api/v1/pedidos/ventas-hoy:
 *   get:
 *     summary: Obtener ventas del día
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida exitosamente
 */
router.get(
  '/ventas-hoy',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  pedidosController.ventasHoy
);

/**
 * @swagger
 * /api/v1/pedidos/{id}:
 *   put:
 *     summary: Actualizar pedido (Solo admin/vendedor)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_entrega:
 *                 type: string
 *                 enum: [retiro_tienda, despacho_domicilio]
 *               direccion_entrega:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  [
    body('metodo_entrega')
      .optional()
      .isIn(['retiro_tienda', 'despacho_domicilio'])
      .withMessage('Método de entrega inválido'),
    body('direccion_entrega')
      .optional()
      .isString(),
    body('observaciones')
      .optional()
      .isString(),
    handleValidationErrors
  ],
  pedidosController.actualizarPedido
);

/**
 * @swagger
 * /api/v1/pedidos/{id}:
 *   delete:
 *     summary: Eliminar pedido (Solo admin)
 *     tags: [Pedidos]
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
 *         description: Pedido eliminado exitosamente
 *       403:
 *         description: Sin permisos
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/:id',
  verificarToken,
  verificarRol(['administrador']),
  pedidosController.eliminarPedido
);

module.exports = router;