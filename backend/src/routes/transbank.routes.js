const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbank.controller');
const { check } = require('express-validator');

// Validaciones
const validarTransaccion = [
    check('usuario_id', 'El ID de usuario es obligatorio').not().isEmpty(),
    check('productos', 'Los productos son obligatorios').isArray(),
    check('direccion_entrega', 'La dirección de entrega es obligatoria').isObject(),
    check('total', 'El total es obligatorio').isNumeric()
];

// Rutas
router.post('/crear', validarTransaccion, transbankController.crearTransaccion);
router.post('/confirmar', transbankController.confirmarTransaccion);
router.get('/estado/:token', transbankController.obtenerEstadoTransaccion);
router.post('/reembolsar', transbankController.reembolsarTransaccion);

module.exports = router; 