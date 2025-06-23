const express = require('express');
const router = express.Router();
const { verificarToken, esAdmin } = require('../middleware/auth');
const { 
    obtenerEstadisticasPrincipales,
    obtenerVentasRecientes,
    obtenerProductosPopulares,
    obtenerAlertas
} = require('../controladores/dashboard.controlador');

// Rutas protegidas que requieren autenticación y rol de administrador
router.get('/estadisticas', [verificarToken, esAdmin], obtenerEstadisticasPrincipales);
router.get('/ventas-recientes', [verificarToken, esAdmin], obtenerVentasRecientes);
router.get('/productos-populares', [verificarToken, esAdmin], obtenerProductosPopulares);
router.get('/alertas', [verificarToken, esAdmin], obtenerAlertas);

module.exports = router; 