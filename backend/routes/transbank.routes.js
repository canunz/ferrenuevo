const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbank.controller');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');

// Middleware de autenticación
router.use(validarJWT);

// Validaciones
const validarTransaccion = [
    check('monto', 'El monto es obligatorio').isNumeric(),
    check('orden_compra', 'La orden de compra es obligatoria').not().isEmpty(),
    check('session_id', 'El ID de sesión es obligatorio').not().isEmpty(),
    check('return_url', 'La URL de retorno es obligatoria').isURL()
];

// Rutas
router.post('/crear', validarTransaccion, transbankController.crearTransaccion);
router.post('/confirmar', transbankController.confirmarTransaccion);
router.get('/estado/:token', transbankController.obtenerEstadoTransaccion);
router.post('/reembolsar', transbankController.reembolsarTransaccion);

module.exports = router; 