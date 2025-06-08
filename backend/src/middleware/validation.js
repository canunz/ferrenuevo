// ============================================
// src/middleware/validation.js (SIMPLIFICADO)
// ============================================
const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const manejarErrores = (req, res, next) => {
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

// Validaciones básicas
const validarLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  manejarErrores
];

const validarRegistro = [
  body('nombre')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El rol debe ser un número entero válido'),
  manejarErrores
];

const validarCrearPedido = [
  body('productos')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un producto'),
  body('productos.*.producto_id')
    .isInt({ min: 1 })
    .withMessage('ID de producto debe ser un número entero válido'),
  body('productos.*.cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('metodo_entrega')
    .isIn(['retiro_tienda', 'despacho_domicilio'])
    .withMessage('Método de entrega debe ser retiro_tienda o despacho_domicilio'),
  manejarErrores
];

const validarActualizarEstado = [
  body('estado')
    .isIn(['pendiente', 'aprobado', 'rechazado', 'preparando', 'listo', 'enviado', 'entregado', 'cancelado'])
    .withMessage('Estado debe ser un valor válido'),
  body('observaciones')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las observaciones no pueden exceder 500 caracteres')
    .trim(),
  manejarErrores
];

// Validación simple para otros casos
const validarGenerico = (req, res, next) => {
  // Para casos donde no necesitamos validación específica
  next();
};

module.exports = {
  validarLogin,
  validarRegistro,
  validarCrearPedido,
  validarActualizarEstado,
  validarGenerico,
  manejarErrores
};