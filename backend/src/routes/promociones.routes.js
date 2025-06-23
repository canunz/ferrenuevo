const express = require('express');
const router = express.Router();

// Se importa la instancia completa del controlador, no funciones individuales
const promocionesController = require('../controllers/promociones.controller');

// Se usan los métodos de la instancia del controlador
router.get('/', promocionesController.getAll);
router.post('/', promocionesController.crearPromocion);
router.put('/:id', promocionesController.actualizarPromocion);
router.delete('/:id', promocionesController.eliminarPromocion);
router.post('/aplicar-codigo', promocionesController.aplicarCodigo);

module.exports = router; 