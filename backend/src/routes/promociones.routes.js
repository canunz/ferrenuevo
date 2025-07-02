// src/routes/promociones-nuevas.routes.js (ARCHIVO NUEVO)
const express = require('express');
const router = express.Router();
const promocionesController = require('../controllers/promociones.controller');
const { Cupon } = require('../models');

// RUTAS DE PROMOCIONES
router.get('/', promocionesController.listarPromociones);
router.post('/', promocionesController.crearPromocion);

// RUTAS ESPECIALES
router.post('/validar-cupon', promocionesController.validarCupon);
router.post('/aplicar', promocionesController.aplicarPromocion);
router.post('/asociar-producto', promocionesController.asociarPromocionAProducto);

router.get('/por-producto', promocionesController.listarPromocionesPorProducto);

// Validar cupón por código
router.get('/cupones/validar', async (req, res) => {
  const { codigo } = req.query;
  if (!codigo) return res.status(400).json({ success: false, message: 'Código requerido' });
  try {
    const cupon = await Cupon.findOne({ where: { codigo, estado: 'activo' } });
    if (!cupon) return res.json({ success: false, message: 'Cupón no válido o inactivo' });
    // Verifica fechas
    const ahora = new Date();
    if (cupon.fecha_inicio > ahora || cupon.fecha_fin < ahora) {
      return res.json({ success: false, message: 'Cupón vencido o no disponible' });
    }
    // Verifica usos
    if (cupon.usos_totales >= cupon.usos_limite) {
      return res.json({ success: false, message: 'Cupón sin usos disponibles' });
    }
    // Calcula descuento
    let descuento = 0;
    if (cupon.tipo === 'porcentaje') {
      descuento = cupon.valor;
    } else if (cupon.tipo === 'monto_fijo') {
      descuento = cupon.valor;
    }
    res.json({ success: true, cupon, descuento });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al validar cupón' });
  }
});

// Crear cupón
router.post('/cupones', async (req, res) => {
  try {
    const { codigo, descripcion, tipo, valor, monto_minimo, fecha_inicio, fecha_fin, usos_limite } = req.body;
    if (!codigo || !tipo || !valor || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }
    const existe = await Cupon.findOne({ where: { codigo } });
    if (existe) return res.status(400).json({ success: false, message: 'El cupón ya existe' });
    const cupon = await Cupon.create({
      codigo,
      descripcion,
      tipo,
      valor,
      monto_minimo: monto_minimo || 0,
      fecha_inicio,
      fecha_fin,
      usos_limite: usos_limite || 1,
      estado: 'activo'
    });
    res.json({ success: true, cupon });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al crear cupón' });
  }
});

// Listar cupones
router.get('/cupones', async (req, res) => {
  try {
    const cupones = await Cupon.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, cupones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al listar cupones' });
  }
});

module.exports = router;