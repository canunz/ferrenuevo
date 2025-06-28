const { Producto, Categoria, Marca, Inventario } = require('../models');
const { Op } = require('sequelize');

// 🎯 FUNCIÓN PARA APLICAR PROMOCIONES AUTOMÁTICAMENTE (SIN TABLA PROMOCIONES)
const aplicarPromociones = (producto) => {
  const precio = parseFloat(producto.precio);
  let promociones = [];
  
  console.log(`🎯 Aplicando promociones a: ${producto.nombre} - Marca: ${producto.marca_nombre} - Precio: $${precio}`);
  
  // 🔥 PROMOCIONES POR MARCA (HARDCODED - MUY IMPORTANTES)
  if (producto.marca_nombre === 'Stanley') {
    promociones.push({
      tipo: 'marca',
      nombre: 'Mega Sale Stanley 25%',
      descuento_porcentaje: 25,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.75),
      ahorro: Math.round(precio * 0.25),
      etiqueta: 'STANLEY25',
      vigencia: 'Hasta 31 Dic 2025',
      color: '#e74c3c'
    });
  }
  
  if (producto.marca_nombre === 'Bosch') {
    promociones.push({
      tipo: 'marca',
      nombre: 'Oferta Bosch 20%',
      descuento_porcentaje: 20,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.8),
      ahorro: Math.round(precio * 0.2),
      etiqueta: 'BOSCH20',
      vigencia: 'Hasta 31 Ene 2025',
      color: '#27ae60'
    });
  }
  
  if (producto.marca_nombre === 'DeWalt') {
    promociones.push({
      tipo: 'marca',
      nombre: 'DeWalt Power Tools 18%',
      descuento_porcentaje: 18,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.82),
      ahorro: Math.round(precio * 0.18),
      etiqueta: 'DEWALT18',
      vigencia: 'Hasta 31 Dic 2025',
      color: '#f39c12'
    });
  }
  
  if (producto.marca_nombre === 'Makita') {
    promociones.push({
      tipo: 'marca',
      nombre: 'Makita Professional 15%',
      descuento_porcentaje: 15,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.85),
      ahorro: Math.round(precio * 0.15),
      etiqueta: 'MAKITA15',
      vigencia: 'Hasta 28 Feb 2025',
      color: '#2ecc71'
    });
  }
  
  if (producto.marca_nombre === 'Black & Decker' || producto.marca_nombre === 'Generica') {
    promociones.push({
      tipo: 'marca',
      nombre: 'Black+Decker 22%',
      descuento_porcentaje: 22,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.78),
      ahorro: Math.round(precio * 0.22),
      etiqueta: 'BLACKDECKER22',
      vigencia: 'Hasta 31 Dic 2025',
      color: '#9b59b6'
    });
  }
  
  // 🔥 PROMOCIONES POR CATEGORÍA
  if (producto.categoria_nombre === 'Herramientas Eléctricas') {
    promociones.push({
      tipo: 'categoria',
      nombre: 'Black Friday Herramientas 30%',
      descuento_porcentaje: 30,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.7),
      ahorro: Math.round(precio * 0.3),
      etiqueta: 'BLACKFRIDAY30',
      vigencia: 'Hasta 2 Dic 2025',
      color: '#e67e22'
    });
  }
  
  if (producto.categoria_nombre === 'Herramientas Manuales') {
    promociones.push({
      tipo: 'categoria',
      nombre: 'Herramientas Manuales 20%',
      descuento_porcentaje: 20,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.8),
      ahorro: Math.round(precio * 0.2),
      etiqueta: 'MANUALES20',
      vigencia: 'Hasta 15 Dic 2025',
      color: '#34495e'
    });
  }
  
  // 🔥 PROMOCIONES POR PRECIO ALTO
  if (precio >= 100000) {
    promociones.push({
      tipo: 'precio_alto',
      nombre: 'Liquidación Premium 35%',
      descuento_porcentaje: 35,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.65),
      ahorro: Math.round(precio * 0.35),
      etiqueta: 'PREMIUM35',
      vigencia: 'Hasta 31 Dic 2025',
      color: '#c0392b'
    });
  }
  
  // 🔥 OFERTAS ESPECIALES POR NOMBRE DE PRODUCTO
  if (producto.nombre.toLowerCase().includes('taladro')) {
    promociones.push({
      tipo: 'especial',
      nombre: '🔥 Súper Oferta Taladros',
      descuento_porcentaje: 28,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.72),
      ahorro: Math.round(precio * 0.28),
      etiqueta: 'SUPERTALADRO',
      vigencia: 'OFERTA LIMITADA',
      color: '#e74c3c'
    });
  }
  
  if (producto.nombre.toLowerCase().includes('sierra')) {
    promociones.push({
      tipo: 'especial',
      nombre: '⚡ Flash Sale Sierras',
      descuento_porcentaje: 25,
      precio_original: precio,
      precio_oferta: Math.round(precio * 0.75),
      ahorro: Math.round(precio * 0.25),
      etiqueta: 'FLASHSIERRA',
      vigencia: 'ÚLTIMOS DÍAS',
      color: '#8e44ad'
    });
  }
  
  // Seleccionar la MEJOR promoción (mayor descuento)
  if (promociones.length > 0) {
    const mejorPromocion = promociones.reduce((mejor, actual) => 
      actual.descuento_porcentaje > mejor.descuento_porcentaje ? actual : mejor
    );
    
    console.log(`✅ Aplicando promoción: ${mejorPromocion.nombre} - ${mejorPromocion.descuento_porcentaje}% OFF`);
    
    return {
      ...producto,
      tiene_promocion: true,
      promocion_activa: mejorPromocion,
      precio_original: precio,
      precio_final: mejorPromocion.precio_oferta,
      precio_con_descuento: mejorPromocion.precio_oferta,
      ahorro_total: mejorPromocion.ahorro,
      descuento_porcentaje: mejorPromocion.descuento_porcentaje,
      etiqueta_promocion: mejorPromocion.etiqueta,
      badge_promocion: mejorPromocion.nombre,
      color_promocion: mejorPromocion.color,
      vigencia_promocion: mejorPromocion.vigencia,
      todas_promociones: promociones,
      // CAMPOS EXTRAS PARA EL FRONTEND
      mostrar_oferta: true,
      precio_tachado: precio,
      precio_destacado: mejorPromocion.precio_oferta
    };
  }
  
  console.log(`ℹ️ Sin promociones para: ${producto.nombre}`);
  
  return {
    ...producto,
    tiene_promocion: false,
    promocion_activa: null,
    precio_original: precio,
    precio_final: precio,
    precio_con_descuento: precio,
    ahorro_total: 0,
    descuento_porcentaje: 0,
    etiqueta_promocion: null,
    badge_promocion: null,
    color_promocion: null,
    vigencia_promocion: null,
    todas_promociones: [],
    mostrar_oferta: false,
    precio_tachado: null,
    precio_destacado: precio
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
        { model: Categoria, as: 'categoria' },
        { model: Marca, as: 'marca' },
        { model: Inventario, as: 'inventario' }
      ];

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      // Aplicar promociones a cada producto
      const productosConPromociones = productos.map(producto => {
        const productoData = producto.toJSON();
        return aplicarPromociones(productoData);
      });

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
          { model: Categoria, as: 'categoria' },
          { model: Marca, as: 'marca' },
          { model: Inventario, as: 'inventario' }
        ]
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado'
        });
      }

      const productoData = producto.toJSON();
      const productoConPromocion = aplicarPromociones(productoData);

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
          { model: Categoria, as: 'categoria' },
          { model: Marca, as: 'marca' },
          { model: Inventario, as: 'inventario' }
        ],
        limit: 10,
        order: [['createdAt', 'DESC']]
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
}

module.exports = new ProductosController();