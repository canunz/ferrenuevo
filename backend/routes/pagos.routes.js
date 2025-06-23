const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
    crearPago,
    confirmarPago,
    obtenerEstadoPago,
    obtenerHistorialPagos
} = require('../controllers/pagos.controller');

// Rutas públicas
router.post('/webpay/crear', crearPago);
router.post('/webpay/confirmar', confirmarPago);
router.get('/webpay/estado/:id', obtenerEstadoPago);

// Rutas protegidas
router.get('/historial', verificarToken, obtenerHistorialPagos);

module.exports = router; 