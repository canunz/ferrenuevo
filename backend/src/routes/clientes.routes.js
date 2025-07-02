// ============================================
// src/routes/clientes.routes.js
// ============================================
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');

// Middleware de validación
const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

// =====================
// RUTAS DE CLIENTES
// =====================

/**
 * @swagger
 * /api/v1/clientes:
 *   get:
 *     summary: Listar clientes con filtros
 *     tags: [Clientes]
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
 *         description: Elementos por página
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Buscar por nombre, email, teléfono o RUT
 *       - in: query
 *         name: segmento
 *         schema:
 *           type: string
 *           enum: [retail, profesional, empresa, vip]
 *         description: Filtrar por segmento
 *       - in: query
 *         name: tipo_cliente
 *         schema:
 *           type: string
 *           enum: [persona, empresa]
 *         description: Filtrar por tipo de cliente
 */
router.get('/',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('segmento').optional().isIn(['retail', 'profesional', 'empresa', 'vip']),
    query('tipo_cliente').optional().isIn(['persona', 'empresa'])
  ],
  validarResultados,
  clientesController.listarClientes
);

/**
 * @swagger
 * /api/v1/clientes/{id}:
 *   get:
 *     summary: Obtener detalle de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 */
router.get('/:id',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  validarResultados,
  clientesController.obtenerCliente
);

/**
 * @swagger
 * /api/v1/clientes:
 *   post:
 *     summary: Crear nuevo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               telefono:
 *                 type: string
 *               rut:
 *                 type: string
 *               tipo_cliente:
 *                 type: string
 *                 enum: [persona, empresa]
 *               direccion_principal:
 *                 type: object
 *               preferencias:
 *                 type: object
 */
router.post('/',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  [
    body('nombre').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('telefono').optional().isString().notEmpty(),
    body('rut').optional().trim(),
    body('tipo_cliente').optional().isIn(['persona', 'empresa']),
    body('segmento').optional().isIn(['retail', 'profesional', 'empresa', 'vip'])
  ],
  validarResultados,
  clientesController.crearCliente
);

/**
 * @swagger
 * /api/v1/clientes/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  [
    body('nombre').optional().notEmpty().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('telefono').optional().isString().notEmpty(),
    body('tipo_cliente').optional().isIn(['persona', 'empresa']),
    body('segmento').optional().isIn(['retail', 'profesional', 'empresa', 'vip']),
    body('credito_disponible').optional().isFloat({ min: 0 }),
    body('descuento_personalizado').optional().isFloat({ min: 0, max: 100 })
  ],
  validarResultados,
  clientesController.actualizarCliente
);

/**
 * @swagger
 * /api/v1/clientes/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  validarResultados,
  clientesController.eliminarCliente
);

/**
 * @swagger
 * /api/v1/clientes/diagnostico:
 *   get:
 *     summary: Diagnóstico de conexiones y modelos
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/diagnostico/conexiones',
  verificarToken,
  verificarRol(['administrador']),
  clientesController.diagnosticarConexiones
);

/**
 * @swagger
 * /api/v1/clientes/{id}/direccion-envio:
 *   get:
 *     summary: Obtener dirección de envío de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *   put:
 *     summary: Crear o actualizar dirección de envío de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 */
router.get('/:id/direccion-envio',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  validarResultados,
  clientesController.obtenerDireccionEnvio
);

router.put('/:id/direccion-envio',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  validarResultados,
  clientesController.actualizarDireccionEnvio
);

/**
 * @swagger
 * /api/v1/clientes/{id}/historial:
 *   get:
 *     summary: Obtener historial de compras de un cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 */
router.get('/:id/historial',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  param('id').isInt(),
  validarResultados,
  clientesController.obtenerHistorialCompras
);

module.exports = router;