const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');

// Obtener lista de imágenes disponibles
router.get('/productos', imagenController.obtenerImagenes);

// Servir una imagen específica
router.get('/productos/:nombre', imagenController.servirImagen);

module.exports = router; 