const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verificarToken } = require('../middleware/auth');
const { Pedido, Producto, Usuario, DetallePedido } = require('../models');
const { Op, fn, col } = require('sequelize');

// ==========================================
// MIDDLEWARE DE LOGGING PARA DEBUG
// ==========================================
router.use((req, res, next) => {
  console.log(`📊 Dashboard route accessed: ${req.method} ${req.originalUrl}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  next();
});

// ==========================================
// MIDDLEWARE DE VALIDACIÓN Y AUTENTICACIÓN
// ==========================================
// Descomenta estas líneas cuando tengas el middleware de auth configurado
// const { verificarToken, verificarRol } = require('../middleware/auth');
// router.use(verificarToken);
// router.use(verificarRol(['administrador', 'vendedor']));

// ==========================================
// RUTAS DE DASHBOARD - PATHS CORREGIDOS
// ==========================================

/**
 * GET /api/v1/dashboard/estadisticas
 * Obtener estadísticas principales del dashboard
 */
router.get('/estadisticas', verificarToken, dashboardController.obtenerEstadisticas);

/**
 * GET /api/v1/dashboard/ventas-recientes
 * Obtener las ventas más recientes
 */
router.get('/ventas-recientes', verificarToken, dashboardController.obtenerVentasRecientes);

/**
 * GET /api/v1/dashboard/productos-populares
 * Obtener los productos más populares
 */
router.get('/productos-populares', verificarToken, dashboardController.obtenerProductosPopulares);

/**
 * GET /api/v1/dashboard/alertas
 * Obtener alertas del sistema
 */
router.get('/alertas', verificarToken, dashboardController.obtenerAlertas);

// ==========================================
// RUTAS DE PRUEBA SIN AUTENTICACIÓN
// ==========================================

/**
 * GET /api/v1/dashboard/test/estadisticas
 * Obtener estadísticas principales del dashboard (sin auth para pruebas)
 */
router.get('/test/estadisticas', dashboardController.obtenerEstadisticas);

/**
 * GET /api/v1/dashboard/test/ventas-recientes
 * Obtener las ventas más recientes (sin auth para pruebas)
 */
router.get('/test/ventas-recientes', dashboardController.obtenerVentasRecientes);

/**
 * GET /api/v1/dashboard/test/productos-populares
 * Obtener los productos más populares (sin auth para pruebas)
 */
router.get('/test/productos-populares', dashboardController.obtenerProductosPopulares);

/**
 * GET /api/v1/dashboard/test/alertas
 * Obtener alertas del sistema (sin auth para pruebas)
 */
router.get('/test/alertas', dashboardController.obtenerAlertas);

// ==========================================
// RUTAS ADICIONALES OPCIONALES
// ==========================================

/**
 * GET /api/v1/dashboard/resumen
 * Obtener resumen completo del dashboard (opcional)
 */
router.get('/resumen', (req, res) => {
  try {
    // Si tienes un método resumen en tu controller, úsalo:
    // dashboardController.obtenerResumen(req, res);
    
    // Mientras tanto, respuesta básica:
    res.json({
      success: true,
      message: 'Resumen del dashboard - implementar en controller',
      data: {
        nota: 'Implementar método obtenerResumen en dashboardController'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en resumen dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener resumen',
      details: error.message
    });
  }
});

/**
 * GET /api/v1/dashboard/metricas
 * Obtener métricas específicas (opcional)
 */
router.get('/metricas', (req, res) => {
  try {
    const { periodo, tipo } = req.query;
    
    // Si tienes un método metricas en tu controller, úsalo:
    // dashboardController.obtenerMetricas(req, res);
    
    // Mientras tanto, respuesta básica:
    res.json({
      success: true,
      message: 'Métricas del dashboard - implementar en controller',
      data: {
        periodo: periodo || 'no_especificado',
        tipo: tipo || 'no_especificado',
        nota: 'Implementar método obtenerMetricas en dashboardController'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en métricas dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener métricas',
      details: error.message
    });
  }
});

// ==========================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ==========================================
router.use((error, req, res, next) => {
  console.error('❌ Error en dashboard routes:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno en dashboard',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// RUTA 404 PARA DASHBOARD
// ==========================================
router.use('*', (req, res) => {
  console.log(`❌ Ruta de dashboard no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: `Ruta de dashboard ${req.originalUrl} no encontrada`,
    rutas_disponibles: [
      'GET /api/v1/dashboard/estadisticas',
      'GET /api/v1/dashboard/ventas-recientes',
      'GET /api/v1/dashboard/productos-populares', 
      'GET /api/v1/dashboard/alertas',
      'GET /api/v1/dashboard/resumen',
      'GET /api/v1/dashboard/metricas'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;