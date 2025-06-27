const express = require('express');
const router = express.Router();

// Controlador de promociones mejorado
const promocionesController = {
  // Obtener todas las promociones activas
  obtenerPromociones: async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Promociones obtenidas exitosamente',
        data: [
          {
            id: 1,
            nombre: 'Descuento Herramientas Eléctricas',
            descripcion: '20% de descuento en herramientas eléctricas',
            descuento: 20,
            tipo: 'porcentaje',
            fechaInicio: '2024-01-01',
            fechaFin: '2024-12-31',
            activa: true,
            categoria: 'herramientas-electricas'
          },
          {
            id: 2,
            nombre: 'Oferta Especial Ferretería',
            descripcion: '15% de descuento en productos de ferretería',
            descuento: 15,
            tipo: 'porcentaje',
            fechaInicio: '2024-01-01',
            fechaFin: '2024-12-31',
            activa: true,
            categoria: 'ferreteria'
          }
        ]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener promociones',
        error: error.message
      });
    }
  },

  // Crear nueva promoción
  crearPromocion: async (req, res) => {
    try {
      const { nombre, descripcion, descuento, tipo, fechaInicio, fechaFin, categoria } = req.body;
      
      res.json({
        success: true,
        message: 'Promoción creada exitosamente',
        data: {
          id: Date.now(),
          nombre,
          descripcion,
          descuento,
          tipo,
          fechaInicio,
          fechaFin,
          categoria,
          activa: true
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear promoción',
        error: error.message
      });
    }
  },

  // Aplicar promoción a producto
  aplicarPromocion: async (req, res) => {
    try {
      const { productoId, promocionId } = req.body;
      
      res.json({
        success: true,
        message: 'Promoción aplicada exitosamente',
        data: {
          productoId,
          promocionId,
          precioOriginal: 50000,
          precioConDescuento: 40000,
          descuentoAplicado: 20
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al aplicar promoción',
        error: error.message
      });
    }
  }
};

// Rutas
router.get('/', promocionesController.obtenerPromociones);
router.post('/', promocionesController.crearPromocion);
router.post('/aplicar', promocionesController.aplicarPromocion);

module.exports = router; 