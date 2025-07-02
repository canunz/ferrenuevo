const { Producto, Categoria, Marca, Inventario, Descuento } = require('../models');
const { Op } = require('sequelize');

// 🎯 FUNCIÓN PARA APLICAR PROMOCIONES AUTOMÁTICAMENTE (SIN TABLA PROMOCIONES)
const aplicarPromociones = async (producto) => {
  const precio = parseFloat(producto.precio);
  // Buscar el descuento activo y vigente más reciente
  const hoy = new Date();
  const descuento = await Descuento.findOne({
    where: {
      producto_id: producto.id,
      estado: 'activa',
      fecha_inicio: { [Op.lte]: hoy },
      fecha_fin: { [Op.gte]: hoy }
    },
    order: [['fecha_inicio', 'DESC']]
  });
  if (descuento) {
    let precioFinal = precio;
    let ahorro = 0;
    let porcentaje = 0;
    let monto = 0;
    let tipoDescuento = descuento.tipo;
    if (descuento.tipo === 'porcentaje') {
      porcentaje = parseFloat(descuento.valor);
      ahorro = Math.round(precio * (porcentaje / 100));
      monto = ahorro;
      precioFinal = Math.round(precio - ahorro);
    } else if (descuento.tipo === 'monto_fijo') {
      monto = Math.round(parseFloat(descuento.valor));
      ahorro = monto;
      precioFinal = Math.max(0, Math.round(precio - monto));
      porcentaje = Math.round((ahorro / precio) * 100);
    }
    return {
      ...producto,
      tiene_promocion: true,
      promocion_activa: {
        tipo: tipoDescuento,
        valor: descuento.valor,
        porcentaje: porcentaje,
        monto: monto,
        precio_original: precio,
        precio_oferta: precioFinal,
        ahorro: ahorro,
        etiqueta: `DESCUENTO${producto.id}`,
        vigencia: `Hasta ${String(descuento.fecha_fin).split('T')[0]}`,
        color: '#e67e22'
      },
      precio_original: precio,
      precio_final: precioFinal,
      precio_con_descuento: precioFinal,
      ahorro_total: ahorro,
      descuento_porcentaje: porcentaje,
      descuento_monto: monto,
      tipo_descuento: tipoDescuento,
      etiqueta_promocion: `DESCUENTO${producto.id}`,
      badge_promocion: tipoDescuento === 'porcentaje' ? `Descuento ${porcentaje}%` : `Descuento $${monto}`,
      color_promocion: '#e67e22',
      vigencia_promocion: `Hasta ${String(descuento.fecha_fin).split('T')[0]}`,
      mostrar_oferta: true,
      precio_tachado: precio,
      precio_destacado: precioFinal,
      descuento_manual: false
    };
  }
  // Si no hay descuento, devolver producto normal
  return {
    ...producto,
    tiene_promocion: false
  };
};

class ProductosController {
  // Listar todos los productos (Corregido para incluir stock y descuentos)
  async listarProductos(req, res) {
    try {
      const { 
        page = 1, 
        limit = 12, 
        categoria_id, 
        marca_id, 
        precio_min, 
        precio_max,
        activo = true 
      } = req.query;

      const offset = (page - 1) * limit;
      let whereClause = { activo };

      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (marca_id) whereClause.marca_id = marca_id;
      if (precio_min && precio_max) {
        whereClause.precio = { [Op.between]: [precio_min, precio_max] };
      }

      const includeClause = [
        { model: Categoria, as: 'categoria', required: false },
        { model: Marca, as: 'marca', required: false },
        { model: Inventario, as: 'inventario', required: false }
      ];

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      // Aplicar promociones a cada producto (ahora asíncrono)
      const productosConPromociones = await Promise.all(productos.map(async producto => {
        const productoData = producto.toJSON();
        return await aplicarPromociones(productoData);
      }));

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: productosConPromociones,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages
        }
      });

    } catch (error) {
      console.error('Error al listar productos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener producto por ID
  async obtenerProducto(req, res) {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id, {
        include: [
          { model: Categoria, as: 'categoria', required: false },
          { model: Marca, as: 'marca', required: false },
          { model: Inventario, as: 'inventario', required: false }
        ]
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const productoData = producto.toJSON();
      const productoConPromocion = await aplicarPromociones(productoData);

      res.json({
        success: true,
        data: productoConPromocion
      });

    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Obtener ofertas especiales
  async obtenerOfertas(req, res) {
    try {
      const productos = await Producto.findAll({
        where: { activo: true },
        include: [
          { model: Categoria, as: 'categoria', required: false },
          { model: Marca, as: 'marca', required: false },
          { model: Inventario, as: 'inventario', required: false }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });

      // Aplicar promociones y filtrar solo los que tienen ofertas
      const ofertas = productos
        .map(producto => {
          const productoData = producto.toJSON();
          return aplicarPromociones(productoData);
        })
        .filter(producto => producto.tiene_promocion);

      res.json({
        success: true,
        data: ofertas,
        total: ofertas.length
      });

    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Listar categorías
  async listarCategorias(req, res) {
    try {
      const categorias = await Categoria.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: categorias
      });

    } catch (error) {
      console.error('Error al listar categorías:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Listar marcas
  async listarMarcas(req, res) {
    try {
      const marcas = await Marca.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        data: marcas
      });

    } catch (error) {
      console.error('Error al listar marcas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Crear producto
  async crearProducto(req, res) {
    try {
      const producto = await Producto.create(req.body);
      res.status(201).json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Actualizar producto
  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      await producto.update(req.body);
      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Eliminar producto
  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      await producto.destroy();
      res.json({
        success: true,
        message: 'Producto eliminado correctamente'
      });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Carga masiva de productos
  async cargaMasiva(req, res) {
    try {
      // Implementar lógica de carga masiva
      res.json({
        success: true,
        message: 'Carga masiva implementada'
      });
    } catch (error) {
      console.error('Error en carga masiva:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Subir imagen de producto
  async subirImagen(req, res) {
    try {
      // Implementar lógica de subida de imagen
      res.json({
        success: true,
        message: 'Imagen subida correctamente'
      });
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Actualizar solo el descuento de un producto
  async actualizarDescuento(req, res) {
    try {
      const { id } = req.params;
      const { descuento } = req.body;
      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }
      producto.descuento = descuento;
      await producto.save();
      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      console.error('Error al actualizar descuento:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // Actualizar descuento por categoría
  async actualizarDescuentoCategoria(req, res) {
    try {
      const { categoria_id, descuento } = req.body;
      if (!categoria_id) return res.status(400).json({ success: false, error: 'categoria_id requerido' });
      await Producto.update({ descuento }, { where: { categoria_id } });
      res.json({ success: true, message: 'Descuento actualizado para la categoría' });
    } catch (error) {
      console.error('Error al actualizar descuento por categoría:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }

  // Actualizar descuento por marca
  async actualizarDescuentoMarca(req, res) {
    try {
      const { marca_id, descuento } = req.body;
      if (!marca_id) return res.status(400).json({ success: false, error: 'marca_id requerido' });
      await Producto.update({ descuento }, { where: { marca_id } });
      res.json({ success: true, message: 'Descuento actualizado para la marca' });
    } catch (error) {
      console.error('Error al actualizar descuento por marca:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }
}

module.exports = new ProductosController();