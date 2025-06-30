const express = require('express');
const router = express.Router();
const facturasController = require('../controllers/facturas.controller');
const { verificarToken, verificarRol } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Emitir una nueva factura
router.post('/emitir', facturasController.emitirFactura);

// Listar facturas
router.get('/', facturasController.listarFacturas);

// Obtener una factura específica
router.get('/:id', facturasController.obtenerFactura);

// Actualizar estado de una factura
router.put('/:id/estado', verificarRol(['administrador', 'contador']), facturasController.actualizarEstado);

// Obtener estadísticas de facturación
router.get('/estadisticas/general', verificarRol(['administrador', 'contador']), facturasController.obtenerEstadisticas);

module.exports = router; 