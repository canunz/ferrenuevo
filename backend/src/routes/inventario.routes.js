const express = require('express');
const routerInventario = express.Router();
const inventarioController = require('../controllers/inventario.controller');
const auth = require('../middleware/auth');

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
 *         name: sucursal_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: stock_bajo
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario obtenido exitosamente
 */
routerInventario.get('/', auth.verificarToken, auth.verificarRol(['administrador', 'bodeguero', 'vendedor']), inventarioController.listarInventario);

/**
 * @swagger
 * /api/v1/inventario/{id}:
 *   put:
 *     summary: Actualizar stock
 *     tags: [Inventario]
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
 *               stock_actual:
 *                 type: integer
 *                 example: 25
 *               ubicacion:
 *                 type: string
 *                 example: "Estante A1-Superior"
 *               observaciones:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 */
routerInventario.put('/:id', auth.verificarToken, auth.verificarRol(['administrador', 'bodeguero']), inventarioController.actualizarStock);

/**
 * @swagger
 * /api/v1/inventario/producto/{producto_id}:
 *   get:
 *     summary: Obtener stock por producto
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock del producto obtenido exitosamente
 */
routerInventario.get('/producto/:producto_id', auth.verificarToken, inventarioController.obtenerStockProducto);

/**
 * @swagger
 * /api/v1/inventario/alertas/stock-bajo:
 *   get:
 *     summary: Obtener productos con stock bajo
 *     tags: [Inventario]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos con stock bajo obtenidos exitosamente
 */
routerInventario.get('/alertas/stock-bajo', auth.verificarToken, auth.verificarRol(['administrador', 'bodeguero']), inventarioController.alertaStockBajo);

module.exports = routerInventario;