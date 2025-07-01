// src/routes/promociones-nuevas.routes.js (ARCHIVO NUEVO)
const express = require('express');
const router = express.Router();
const promocionesController = require('../controllers/promociones.controller');

// RUTAS DE PROMOCIONES
router.get('/', promocionesController.listarPromociones);
router.post('/', promocionesController.crearPromocion);

// RUTAS ESPECIALES
router.post('/validar-cupon', promocionesController.validarCupon);
router.post('/aplicar', promocionesController.aplicarPromocion);
router.post('/asociar-producto', promocionesController.asociarPromocionAProducto);

router.get('/por-producto', promocionesController.listarPromocionesPorProducto);

module.exports = router;