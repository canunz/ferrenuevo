const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Gestión de inventario, movimientos y alertas de stock
 */

/**
 * @swagger
 * /api/v1/inventario/test:
 *   get:
 *     summary: Listar inventario (sin autenticación para pruebas)
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Inventario obtenido exitosamente
 */
router.get(
  '/test',
  inventarioController.listarInventario
);

/**
 * @swagger
 * /api/v1/inventario:
 *   get:
 *     summary: Listar inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sucursal_id
 *         schema: { type: integer }
 *       - in: query
 *         name: categoria_id
 *         schema: { type: integer }
 *       - in: query
 *         name: stock_bajo
 *         schema: { type: boolean }
 *       - in: query
 *         name: q
 *         description: "Buscar por nombre o SKU del producto"
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Inventario obtenido exitosamente
 */
router.get(
  '/',
  verificarToken,
  verificarRol(['administrador', 'bodeguero', 'vendedor']),
  inventarioController.listarInventario
);

/**
 * @swagger
 * /api/v1/inventario/movimientos:
 *   post:
 *     summary: Registrar un nuevo movimiento de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inventario_id, tipo, cantidad, motivo]
 *             properties:
 *               inventario_id:
 *                 type: integer
 *               tipo:
 *                 type: string
 *                 enum: [entrada, salida, ajuste]
 *               cantidad:
 *                 type: integer
 *               motivo:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movimiento registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/movimientos',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.registrarMovimiento
);

/**
 * @swagger
 * /api/v1/inventario/historial/{inventario_id}:
 *   get:
 *     summary: Obtener el historial de movimientos de un item de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventario_id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 15 }
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 */
router.get(
  '/historial/:inventario_id',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.obtenerHistorialProducto
);

/**
 * @swagger
 * /api/v1/inventario/alertas:
 *   get:
 *     summary: Obtener productos con stock bajo
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alertas de stock bajo obtenidas exitosamente
 */
router.get(
  '/alertas',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.obtenerAlertasStock
);

/**
 * @swagger
 * /api/v1/inventario/estadisticas:
 *   get:
 *     summary: Obtener estadísticas del inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 */
router.get(
  '/estadisticas',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.obtenerEstadisticas
);

/**
 * @swagger
 * /api/v1/inventario/{id}:
 *   put:
 *     summary: Actualizar stock de un item de inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_actual:
 *                 type: integer
 *               stock_minimo:
 *                 type: integer
 *               stock_maximo:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 */
router.put(
  '/:id',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.actualizarStock
);

/**
 * @swagger
 * /api/v1/inventario/ingreso-test:
 *   post:
 *     summary: Ingresar stock a un producto del inventario (sin autenticación para pruebas)
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto_id, cantidad]
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad a ingresar
 *               observaciones:
 *                 type: string
 *                 description: Observaciones del ingreso
 *     responses:
 *       200:
 *         description: Stock ingresado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado en inventario
 */
router.post(
  '/ingreso-test',
  inventarioController.ingresoStock
);

/**
 * @swagger
 * /api/v1/inventario/ingreso:
 *   post:
 *     summary: Ingresar stock a un producto del inventario
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto_id, cantidad]
 *             properties:
 *               producto_id:
 *                 type: integer
 *                 description: ID del producto
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad a ingresar
 *               observaciones:
 *                 type: string
 *                 description: Observaciones del ingreso
 *     responses:
 *       200:
 *         description: Stock ingresado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado en inventario
 */
router.post(
  '/ingreso',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.ingresoStock
);

/**
 * @swagger
 * /api/v1/inventario/egreso:
 *   post:
 *     summary: Registrar egreso de stock
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto_id, cantidad, motivo]
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               motivo:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Egreso registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/egreso',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.registrarEgreso
);

/**
 * @swagger
 * /api/v1/inventario/ingreso:
 *   post:
 *     summary: Registrar ingreso de stock
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [producto_id, cantidad, motivo]
 *             properties:
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               motivo:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingreso registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/ingreso',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.registrarIngreso
);

module.exports = router;
