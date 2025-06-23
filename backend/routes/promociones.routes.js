const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const {
    obtenerPromociones,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
    obtenerPromocion
} = require('../controllers/promociones.controller');

// Rutas públicas
router.get('/', obtenerPromociones);
router.get('/:id', obtenerPromocion);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, crearPromocion);
router.put('/:id', verificarToken, actualizarPromocion);
router.delete('/:id', verificarToken, eliminarPromocion);

module.exports = router; 