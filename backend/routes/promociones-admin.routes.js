// ==========================================
// src/routes/promociones-admin.routes.js - COMPLETO
// ==========================================

const express = require('express');
const router = express.Router();
const promocionesAdminController = require('../src/controllers/promociones-admin.controller');
const { verificarToken, verificarRol } = require('../src/middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Promociones Admin
 *   description: Gestión administrativa completa de promociones y descuentos
 */

// MIDDLEWARE: Todas las rutas requieren autenticación
router.use(verificarToken);

// ==========================================
// RUTAS DE GESTIÓN DE PROMOCIONES (ADMIN)
// ==========================================

/**
 * @swagger
 * /api/v1/promociones-admin:
 *   get:
 *     summary: Listar todas las promociones (Admin)
 *     tags: [Promociones Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: tipo_descuento
 *         schema:
 *           type: string
 *           enum: [porcentaje, fijo]
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: vigente
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de promociones con estadísticas
 */
router.get('/', verificarRol(['admin']), promocionesAdminController.listarPromociones);

/**
 * @swagger
 * /api/v1/promociones-admin:
 *   post:
 *     summary: Crear nueva promoción
 *     tags: [Promociones Admin]
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
 *               - tipo_descuento
 *               - valor_descuento
 *               - fecha_inicio
 *               - fecha_fin
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Descuento Navidad 2025"
 *               descripcion:
 *                 type: string
 *                 example: "Promoción especial de navidad"
 *               tipo_descuento:
 *                 type: string
 *                 enum: [porcentaje, fijo]
 *                 example: "porcentaje"
 *               valor_descuento:
 *                 type: number
 *                 example: 25.00
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-01 00:00:00"
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31 23:59:59"
 *               codigo_cupon:
 *                 type: string
 *                 example: "NAVIDAD2025"
 *               minimo_compra:
 *                 type: number
 *                 example: 50000
 *               maximo_descuento:
 *                 type: number
 *                 example: 100000
 *               limite_usos:
 *                 type: integer
 *                 example: 1000
 *               categoria_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               marca_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *               producto_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Promoción creada exitosamente
 */
router.post('/', verificarRol(['admin']), promocionesAdminController.crearPromocion);

/**
 * @swagger
 * /api/v1/promociones-admin/{id}:
 *   put:
 *     summary: Actualizar promoción existente
 *     tags: [Promociones Admin]
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
 *         description: Promoción actualizada exitosamente
 */
router.put('/:id', verificarRol(['admin']), promocionesAdminController.actualizarPromocion);

/**
 * @swagger
 * /api/v1/promociones-admin/{id}:
 *   delete:
 *     summary: Eliminar promoción
 *     tags: [Promociones Admin]
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
 *         description: Promoción eliminada exitosamente
 */
router.delete('/:id', verificarRol(['admin']), promocionesAdminController.eliminarPromocion);

// ==========================================
// RUTAS DE VALIDACIÓN Y APLICACIÓN
// ==========================================

/**
 * @swagger
 * /api/v1/promociones-admin/validar-cupon:
 *   post:
 *     summary: Validar código de cupón
 *     tags: [Promociones Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo_cupon
 *               - total_compra
 *             properties:
 *               codigo_cupon:
 *                 type: string
 *                 example: "NUEVO2025"
 *               total_compra:
 *                 type: number
 *                 example: 75000
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *                     precio:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cupón validado exitosamente
 *       400:
 *         description: Cupón inválido o no cumple requisitos
 */
router.post('/validar-cupon', promocionesAdminController.validarCupon);

/**
 * @swagger
 * /api/v1/promociones-admin/aplicar:
 *   post:
 *     summary: Aplicar promoción a una compra
 *     tags: [Promociones Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promocion_id
 *               - pedido_id
 *               - total_compra
 *               - descuento_aplicado
 *             properties:
 *               promocion_id:
 *                 type: integer
 *               pedido_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               total_compra:
 *                 type: number
 *               descuento_aplicado:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promoción aplicada exitosamente
 */
router.post('/aplicar', verificarRol(['admin', 'vendedor']), promocionesAdminController.aplicarPromocion);

// ==========================================
// RUTAS DE ESTADÍSTICAS
// ==========================================

/**
 * @swagger
 * /api/v1/promociones-admin/estadisticas:
 *   get:
 *     summary: Obtener estadísticas detalladas de promociones
 *     tags: [Promociones Admin]
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
 *     responses:
 *       200:
 *         description: Estadísticas completas de promociones
 */
router.get('/estadisticas', verificarRol(['admin']), promocionesAdminController.obtenerEstadisticas);

module.exports = router;