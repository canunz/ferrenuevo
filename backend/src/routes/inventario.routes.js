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
 *     parameters:
 *       - in: query
 *         name: sucursal_id
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Alertas de stock bajo obtenidas exitosamente
 */
router.get(
  '/alertas',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.alertaStockBajo
);

/**
 * @swagger
 * /api/v1/inventario/ingreso:
 *   post:
 *     summary: Registrar ingreso de stock
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
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
 */
router.post(
  '/egreso',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.egresoStock
);

/**
 * @swagger
 * /api/v1/inventario/ajuste:
 *   post:
 *     summary: Registrar ajuste de stock
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/ajuste',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.ajusteStock
);

/**
 * @swagger
 * /api/v1/inventario/movimientos/{productoId}:
 *   get:
 *     summary: Obtener historial de movimientos por producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/movimientos/:productoId',
  verificarToken,
  verificarRol(['administrador', 'bodeguero']),
  inventarioController.historialMovimientos
);

module.exports = router;
