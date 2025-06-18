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

// Validaciones comunes
const validarClienteId = param('clienteId').isInt().withMessage('ID de cliente inválido');
const validarDireccionId = param('direccionId').isInt().withMessage('ID de dirección inválido');

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
 * /api/v1/clientes/busqueda-avanzada:
 *   get:
 *     summary: Búsqueda avanzada de clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/busqueda-avanzada',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  clientesController.busquedaAvanzada
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
    body('password').isLength({ min: 6 }),
    body('telefono').optional().isMobilePhone('es-CL'),
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
    body('telefono').optional().isMobilePhone('es-CL'),
    body('tipo_cliente').optional().isIn(['persona', 'empresa']),
    body('segmento').optional().isIn(['retail', 'profesional', 'empresa', 'vip']),
    body('credito_disponible').optional().isFloat({ min: 0 }),
    body('descuento_personalizado').optional().isFloat({ min: 0, max: 100 })
  ],
  validarResultados,
  clientesController.actualizarCliente
);

// =====================
// RUTAS DE DIRECCIONES
// =====================

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/direcciones:
 *   get:
 *     summary: Listar direcciones de un cliente
 *     tags: [Clientes - Direcciones]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:clienteId/direcciones',
  verificarToken,
  validarClienteId,
  validarResultados,
  clientesController.listarDirecciones
);

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/direcciones:
 *   post:
 *     summary: Crear nueva dirección
 *     tags: [Clientes - Direcciones]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:clienteId/direcciones',
  verificarToken,
  validarClienteId,
  [
    body('alias').optional().trim(),
    body('nombre_receptor').notEmpty().trim(),
    body('telefono_receptor').optional().isMobilePhone('es-CL'),
    body('direccion').notEmpty().trim(),
    body('numero').optional().trim(),
    body('comuna').notEmpty().trim(),
    body('ciudad').notEmpty().trim(),
    body('region').notEmpty().trim(),
    body('es_principal').optional().isBoolean()
  ],
  validarResultados,
  clientesController.crearDireccion
);

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/direcciones/{direccionId}:
 *   put:
 *     summary: Actualizar dirección
 *     tags: [Clientes - Direcciones]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:clienteId/direcciones/:direccionId',
  verificarToken,
  [validarClienteId, validarDireccionId],
  validarResultados,
  clientesController.actualizarDireccion
);

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/direcciones/{direccionId}:
 *   delete:
 *     summary: Eliminar dirección (soft delete)
 *     tags: [Clientes - Direcciones]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:clienteId/direcciones/:direccionId',
  verificarToken,
  [validarClienteId, validarDireccionId],
  validarResultados,
  clientesController.eliminarDireccion
);

// =====================
// RUTAS DE HISTORIAL
// =====================

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/historial-compras:
 *   get:
 *     summary: Obtener historial de compras
 *     tags: [Clientes - Historial]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: monto_minimo
 *         schema:
 *           type: number
 *       - in: query
 *         name: monto_maximo
 *         schema:
 *           type: number
 */
router.get('/:clienteId/historial-compras',
  verificarToken,
  validarClienteId,
  [
    query('fecha_inicio').optional().isISO8601(),
    query('fecha_fin').optional().isISO8601(),
    query('monto_minimo').optional().isFloat({ min: 0 }),
    query('monto_maximo').optional().isFloat({ min: 0 })
  ],
  validarResultados,
  clientesController.obtenerHistorialCompras
);

// =====================
// RUTAS DE PREFERENCIAS
// =====================

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/preferencias:
 *   get:
 *     summary: Obtener preferencias del cliente
 *     tags: [Clientes - Preferencias]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:clienteId/preferencias',
  verificarToken,
  validarClienteId,
  validarResultados,
  clientesController.obtenerPreferencias
);

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/preferencias:
 *   put:
 *     summary: Actualizar preferencias
 *     tags: [Clientes - Preferencias]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:clienteId/preferencias',
  verificarToken,
  validarClienteId,
  [
    body('categoria_preferida_id').optional().isInt(),
    body('marca_preferida_id').optional().isInt(),
    body('metodo_pago_preferido').optional().trim(),
    body('dia_preferido_entrega').optional().isIn(['lunes','martes','miercoles','jueves','viernes','sabado','domingo']),
    body('horario_preferido_entrega').optional().trim(),
    body('acepta_promociones').optional().isBoolean(),
    body('acepta_email_marketing').optional().isBoolean(),
    body('acepta_sms_marketing').optional().isBoolean()
  ],
  validarResultados,
  clientesController.actualizarPreferencias
);

// =====================
// RUTAS DE SEGMENTACIÓN
// =====================

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/aplicar-segmentacion:
 *   post:
 *     summary: Aplicar segmentación automática
 *     tags: [Clientes - Segmentación]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:clienteId/aplicar-segmentacion',
  verificarToken,
  verificarRol(['administrador']),
  validarClienteId,
  validarResultados,
  clientesController.aplicarSegmentacion
);

// =====================
// RUTAS DE COMUNICACIONES
// =====================

/**
 * @swagger
 * /api/v1/clientes/{clienteId}/comunicaciones:
 *   post:
 *     summary: Enviar comunicación al cliente
 *     tags: [Clientes - Comunicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - mensaje
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [email, sms, llamada, whatsapp, notificacion_app]
 *               asunto:
 *                 type: string
 *               mensaje:
 *                 type: string
 *               campaign_id:
 *                 type: string
 */
router.post('/:clienteId/comunicaciones',
  verificarToken,
  verificarRol(['administrador', 'vendedor']),
  validarClienteId,
  [
    body('tipo').isIn(['email', 'sms', 'llamada', 'whatsapp', 'notificacion_app']),
    body('asunto').optional().trim(),
    body('mensaje').notEmpty().trim(),
    body('campaign_id').optional().trim()
  ],
  validarResultados,
  clientesController.enviarComunicacion
);

module.exports = router;