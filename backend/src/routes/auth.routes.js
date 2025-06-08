const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors.array(),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             usuario:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Debe proporcionar un email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ],
  authController.login
);

/**
 * @swagger
 * /api/v1/auth/registro:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
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
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Email ya existe o datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/registro',
  [
    body('nombre')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Debe proporcionar un email válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ],
  authController.registro
);

/**
 * @swagger
 * /api/v1/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/perfil', auth, authController.obtenerPerfil);

/**
 * @swagger
 * /api/v1/auth/perfil:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     tags: [Autenticación]
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
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Email ya existe
 *       401:
 *         description: No autorizado
 */
router.put('/perfil',
  auth,
  [
    body('nombre').optional().isLength({ min: 2 }),
    body('email').optional().isEmail().normalizeEmail(),
    handleValidationErrors
  ],
  authController.actualizarPerfil
);

/**
 * @swagger
 * /api/v1/auth/cambiar-password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password_actual
 *               - password_nueva
 *             properties:
 *               password_actual:
 *                 type: string
 *               password_nueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Contraseña actual incorrecta
 *       401:
 *         description: No autorizado
 */
router.put('/cambiar-password',
  auth,
  [
    body('password_actual')
      .isLength({ min: 6 })
      .withMessage('Debe proporcionar la contraseña actual'),
    body('password_nueva')
      .isLength({ min: 6 })
      .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    handleValidationErrors
  ],
  authController.cambiarPassword
);

module.exports = router;