// ============================================
// RUTAS USUARIOS - src/routes/usuarios.routes.js
// ============================================
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');
const { validarCreacionUsuario, validarActualizacionUsuario } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         telefono:
 *           type: string
 *           description: Teléfono del usuario
 *         direccion:
 *           type: string
 *           description: Dirección del usuario
 *         rol_id:
 *           type: integer
 *           description: ID del rol asignado
 *         activo:
 *           type: boolean
 *           description: Estado activo del usuario
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         rol:
 *           $ref: '#/components/schemas/Rol'
 */

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Listar usuarios del sistema
 *     description: Obtiene una lista paginada de usuarios con sus roles
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Usuarios por página
 *       - in: query
 *         name: rol_id
 *         schema:
 *           type: integer
 *         description: Filtrar por rol específico
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/', verificarToken, verificarRol(['administrador']), usuariosController.listarUsuarios);

/**
 * @swagger
 * /api/v1/usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     description: Crea un nuevo usuario en el sistema (Solo administradores)
 *     tags: [Usuarios]
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
 *                 description: Nombre completo del usuario
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email único del usuario
 *                 example: "juan.perez@email.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Contraseña del usuario
 *                 example: "password123"
 *               telefono:
 *                 type: string
 *                 description: Teléfono del usuario
 *                 example: "+56 9 1234 5678"
 *               direccion:
 *                 type: string
 *                 description: Dirección del usuario
 *                 example: "Av. Libertador 1234, Santiago"
 *               rol_id:
 *                 type: integer
 *                 description: ID del rol (1=cliente, 2=admin, 3=vendedor, etc.)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos o email ya registrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.post('/', verificarToken, verificarRol(['administrador']), validarCreacionUsuario, usuariosController.crearUsuario);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Obtiene los detalles de un usuario específico
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/:id', verificarToken, usuariosController.obtenerUsuario);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
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
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id', verificarToken, verificarRol(['administrador']), validarActualizacionUsuario, usuariosController.actualizarUsuario);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Desactiva un usuario del sistema (eliminación lógica)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.delete('/:id', verificarToken, verificarRol(['administrador']), usuariosController.eliminarUsuario);

/**
 * @swagger
 * /api/v1/usuarios/{id}/cambiar-password:
 *   put:
 *     summary: Cambiar contraseña del usuario
 *     description: Permite cambiar la contraseña de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password_actual
 *               - password_nuevo
 *             properties:
 *               password_actual:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *               password_nuevo:
 *                 type: string
 *                 minLength: 6
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.put('/:id/cambiar-password', verificarToken, usuariosController.cambiarPassword);

module.exports = router;