const { Promocion, Cupon, Producto, Categoria, sequelize, Marca } = require('../models');
const { Op } = require('sequelize');
const { formatearRespuesta, formatearError } = require('../utils/helpers');

class PromocionesController {

  // ========== PROMOCIONES ==========

  async getAll(req, res) {
    try {
      const promociones = await Promocion.findAll({
        include: [
          { model: Producto, as: 'producto', attributes: ['nombre'] },
          { model: Categoria, as: 'categoria', attributes: ['nombre'] },
          { model: Marca, as: 'marca', attributes: ['nombre'] },
        ],
        order: [['id', 'DESC']],
      });
      res.status(200).json({ success: true, data: promociones });
    } catch (error) {
      console.error('Error al obtener promociones:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }
  }

  async crearPromocion(req, res) {
    const t = await sequelize.transaction();
    try {
      const { productos, categorias, ...promoData } = req.body;
      
      const promocion = await Promocion.create(promoData, { transaction: t });

      if (productos && productos.length > 0) {
        await promocion.setProductos(productos, { transaction: t });
      }
      if (categorias && categorias.length > 0) {
        await promocion.setCategorias(categorias, { transaction: t });
      }
      
      await t.commit();
      const resultado = await Promocion.findByPk(promocion.id, { include: ['productos', 'categorias'] });
      res.status(201).json(formatearRespuesta('Promoción creada', resultado));
    } catch (error) {
      await t.rollback();
      res.status(400).json(formatearError('Error al crear promoción', error));
    }
  }

  async actualizarPromocion(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { productos, categorias, ...promoData } = req.body;

      const promocion = await Promocion.findByPk(id);
      if (!promocion) return res.status(404).json(formatearError('Promoción no encontrada'));

      await promocion.update(promoData, { transaction: t });
      
      if (productos) await promocion.setProductos(productos, { transaction: t });
      if (categorias) await promocion.setCategorias(categorias, { transaction: t });

      await t.commit();
      const resultado = await Promocion.findByPk(id, { include: ['productos', 'categorias'] });
      res.json(formatearRespuesta('Promoción actualizada', resultado));
    } catch (error) {
      await t.rollback();
      res.status(400).json(formatearError('Error al actualizar promoción', error));
    }
  }

  async eliminarPromocion(req, res) {
    try {
      const { id } = req.params;
      const promocion = await Promocion.findByPk(id);
      if (!promocion) return res.status(404).json(formatearError('Promoción no encontrada'));

      await promocion.destroy();
      res.json(formatearRespuesta('Promoción eliminada'));
    } catch (error) {
      res.status(500).json(formatearError('Error al eliminar promoción', error));
    }
  }

  // ========== CUPONES ==========

  async listarCupones(req, res) {
    try {
      const { page = 1, limit = 10, estado, q } = req.query;
      const offset = (page - 1) * limit;
      let whereClause = {};

      if (estado) whereClause.estado = estado;
      if (q) whereClause.codigo = { [Op.like]: `%${q}%` };

      const { count, rows: cupones } = await Cupon.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fecha_fin', 'DESC']],
        include: ['usuario']
      });

      res.json(formatearRespuesta('Cupones obtenidos', cupones, {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count
      }));
    } catch (error) {
      res.status(500).json(formatearError('Error al listar cupones', error));
    }
  }

  async crearCupon(req, res) {
    try {
      const cupon = await Cupon.create(req.body);
      res.status(201).json(formatearRespuesta('Cupón creado', cupon));
    } catch (error) {
      res.status(400).json(formatearError('Error al crear cupón', error));
    }
  }

  // (Aquí irían actualizar y eliminar para cupones, si se necesitan)

  // ========== LÓGICA DE APLICACIÓN ==========

  async aplicarCodigo(req, res) {
    try {
      const { codigo, monto_total, items } = req.body;

      // Buscar si es un cupón o una promoción
      const cupon = await Cupon.findOne({ where: { codigo, estado: 'activo' }});
      const promocion = await Promocion.findOne({ where: { codigo, estado: 'activa' }});

      if (!cupon && !promocion) {
        return res.status(404).json(formatearError('El código no es válido o ha expirado.'));
      }
      
      const descuento = cupon || promocion;
      const esCupon = !!cupon;

      // Validaciones comunes
      if (new Date(descuento.fecha_fin) < new Date()) {
        return res.status(400).json(formatearError('El código ha expirado.'));
      }
      if (monto_total < descuento.monto_minimo) {
        return res.status(400).json(formatearError(`Se requiere una compra mínima de ${descuento.monto_minimo}.`));
      }
      if (descuento.usos_limite !== null && descuento.usos_totales >= descuento.usos_limite) {
        return res.status(400).json(formatearError('Este código ha alcanzado su límite de usos.'));
      }

      // Lógica de cálculo de descuento
      let montoDescuento = 0;
      if (descuento.tipo === 'porcentaje') {
        montoDescuento = (monto_total * descuento.valor) / 100;
      } else if (descuento.tipo === 'monto_fijo') {
        montoDescuento = descuento.valor;
      } else if (descuento.tipo === 'envio_gratis') {
        // Lógica de envío gratis (a implementar en el pedido)
      }

      res.json(formatearRespuesta('Código aplicado exitosamente', {
        codigo: descuento.codigo,
        descripcion: descuento.descripcion,
        monto_descuento: montoDescuento,
        total_con_descuento: monto_total - montoDescuento
      }));

    } catch (error) {
      res.status(500).json(formatearError('Error al aplicar el código', error));
    }
  }

}

module.exports = new PromocionesController(); 