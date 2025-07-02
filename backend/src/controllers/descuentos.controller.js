const db = require('../models');
const { Descuento, Producto } = db;

// Obtener todos los descuentos
exports.getAll = async (req, res) => {
  try {
    const descuentos = await Descuento.findAll({ include: [{ model: Producto, as: 'producto' }] });
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un descuento
exports.create = async (req, res) => {
  try {
    const descuento = await Descuento.create(req.body);
    res.status(201).json(descuento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un descuento
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Descuento.update(req.body, { where: { id } });
    if (updated) {
      const descuento = await Descuento.findByPk(id);
      res.json(descuento);
    } else {
      res.status(404).json({ error: 'Descuento no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un descuento
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Descuento.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Descuento eliminado' });
    } else {
      res.status(404).json({ error: 'Descuento no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener descuentos activos para un producto
exports.getByProducto = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const hoy = new Date();
    const descuentos = await Descuento.findAll({
      where: {
        producto_id,
        estado: 'activa',
        fecha_inicio: { [db.Sequelize.Op.lte]: hoy },
        fecha_fin: { [db.Sequelize.Op.gte]: hoy }
      }
    });
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 