const express = require('express');
const routerReportes = express.Router();
const reportesController = require('../controllers/reportes.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/v1/reportes/dashboard:
 *   get:
 *     summary: Dashboard principal con estadísticas generales
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard obtenido exitosamente
 */
routerReportes.get('/dashboard', auth.verificarToken, reportesController.dashboard);

/**
 * @swagger
 * /api/v1/reportes/ventas:
 *   get:
 *     summary: Reporte de ventas
 *     tags: [Reportes]
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
 *         name: sucursal_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de ventas obtenido exitosamente
 */
routerReportes.get('/ventas', auth.verificarToken, auth.verificarRol(['administrador', 'contador']), reportesController.reporteVentas);

/**
 * @swagger
 * /api/v1/reportes/desempeno:
 *   get:
 *     summary: Reporte de desempeño
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de desempeño obtenido exitosamente
 */
routerReportes.get('/desempeno', auth.verificarToken, auth.verificarRol(['administrador']), reportesController.reporteDesempeno);

/**
 * @swagger
 * /api/v1/reportes/inventario:
 *   get:
 *     summary: Reporte de inventario
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de inventario obtenido exitosamente
 */
routerReportes.get('/inventario', auth.verificarToken, auth.verificarRol(['administrador', 'bodeguero']), reportesController.reporteInventario);

/**
 * @swagger
 * /api/v1/reportes/financiero:
 *   get:
 *     summary: Reporte financiero
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte financiero obtenido exitosamente
 */
routerReportes.get('/financiero', auth.verificarToken, auth.verificarRol(['administrador', 'contador']), reportesController.reporteFinanciero);

module.exports = routerReportes;