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
    precio_tachado: precio,
    precio_destacado: precio
  };
};

// 📋 LISTAR PRODUCTOS CON PROMOCIONES APLICADAS
const listarProductos = async (req, res) => {
  try {
    console.log('🛍️ Iniciando listado de productos...');
    console.log('Query params:', req.query);
    
    const { 
      page = 1, 
      limit = 12, 
      categoria_id, 
      marca_id, 
      precio_min, 
      precio_max,
      activo = true,
      solo_ofertas = false
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = { activo };

    if (categoria_id) whereClause.categoria_id = categoria_id;
    if (marca_id) whereClause.marca_id = marca_id;
    if (precio_min && precio_max) {
      whereClause.precio = { [Op.between]: [precio_min, precio_max] };
    }

    console.log('🔍 Where clause:', whereClause);

    const { count, rows: productos } = await Producto.findAndCountAll({
      where: whereClause,
      include: [
          { 
            model: Categoria, 
            as: 'categoria',
            required: false 
          },
          { 
            model: Marca, 
            as: 'marca',
            required: false 
          },
          { 
            model: Inventario, 
            as: 'inventarios', 
            attributes: ['stock_actual'],
            required: false 
          }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    console.log(`📦 Productos encontrados en BD: ${productos.length}`);

    let productosConDetalles = productos.map(producto => {
      const pJson = producto.toJSON();
      
      // Calcular stock - manejando diferentes estructuras
      let stock_actual = 0;
      if (pJson.inventarios && Array.isArray(pJson.inventarios)) {
        stock_actual = pJson.inventarios.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
      } else if (pJson.inventarios && pJson.inventarios.stock_actual) {
        stock_actual = pJson.inventarios.stock_actual;
      }
      
      // Datos básicos del producto
      const productoBase = {
        ...pJson,
        stock_actual,
        tiene_stock: stock_actual > 0,
        categoria_nombre: pJson.categoria?.nombre || 'Sin categoría',
        marca_nombre: pJson.marca?.nombre || 'Sin marca'
      };
      
      // Limpiar objetos relacionados
      delete productoBase.inventarios;
      delete productoBase.categoria;
      delete productoBase.marca;
      
      // 🎯 APLICAR PROMOCIONES AUTOMÁTICAMENTE
      return aplicarPromociones(productoBase);
    });

    console.log(`🎁 Productos procesados con promociones: ${productosConDetalles.length}`);

    // Filtrar solo ofertas si se solicita
    if (solo_ofertas === 'true') {
      productosConDetalles = productosConDetalles.filter(p => p.tiene_promocion);
      console.log(`🔥 Productos filtrados solo ofertas: ${productosConDetalles.length}`);
    }

    // Estadísticas de promociones
    const totalProductos = productosConDetalles.length;
    const productosConOferta = productosConDetalles.filter(p => p.tiene_promocion).length;
    const ahorroTotal = productosConDetalles.reduce((sum, p) => sum + p.ahorro_total, 0);

    console.log(`📊 Estadísticas: ${totalProductos} total, ${productosConOferta} con ofertas`);

    res.json({
      success: true,
      data: {
        productos: productosConDetalles,
        estadisticas_promociones: {
          total_productos: totalProductos,
          productos_con_oferta: productosConOferta,
          porcentaje_en_oferta: totalProductos > 0 ? Math.round((productosConOferta / totalProductos) * 100) : 0,
          ahorro_total_disponible: Math.round(ahorroTotal),
          mejor_descuento: productosConOferta > 0 ? Math.max(...productosConDetalles.filter(p => p.tiene_promocion).map(p => p.descuento_porcentaje)) : 0
        },
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      },
      message: `${totalProductos} productos encontrados, ${productosConOferta} con ofertas activas`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error al listar productos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 🔍 OBTENER PRODUCTO POR ID CON PROMOCIONES
const obtenerProducto = async (req, res) => {
  try {
      const { id } = req.params;
      console.log(`🔍 Buscando producto ID: ${id}`);
      
      const producto = await Producto.findByPk(id, {
          include: [
              { 
                model: Categoria, 
                as: 'categoria',
                required: false 
              },
              { 
                model: Marca, 
                as: 'marca',
                required: false 
              },
              { 
                model: Inventario, 
                as: 'inventarios',
                required: false 
              }
          ]
      });

      if (!producto) {
          console.log(`❌ Producto ID ${id} no encontrado`);
          return res.status(404).json({ 
            success: false, 
            error: 'Producto no encontrado',
            timestamp: new Date().toISOString()
          });
      }
      
      const pJson = producto.toJSON();
      
      // Calcular stock
      let stock_actual = 0;
      if (pJson.inventarios && Array.isArray(pJson.inventarios)) {
        stock_actual = pJson.inventarios.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
      } else if (pJson.inventarios && pJson.inventarios.stock_actual) {
        stock_actual = pJson.inventarios.stock_actual;
      }
      
      const productoBase = {
        ...pJson,
        stock_actual,
        tiene_stock: stock_actual > 0,
        categoria_nombre: pJson.categoria?.nombre || 'Sin categoría',
        marca_nombre: pJson.marca?.nombre || 'Sin marca'
      };
      
      delete productoBase.inventarios;
      delete productoBase.categoria;
      delete productoBase.marca;
      
      // 🎯 APLICAR PROMOCIONES
      const productoConPromociones = aplicarPromociones(productoBase);
      
      console.log(`✅ Producto encontrado: ${productoConPromociones.nombre} - Promoción: ${productoConPromociones.tiene_promocion}`);

      res.json({ 
        success: true, 
        data: productoConPromociones,
        message: productoConPromociones.tiene_promocion ? 
          `¡Producto con ${productoConPromociones.descuento_porcentaje}% de descuento! Ahorra $${productoConPromociones.ahorro_total.toLocaleString()}` :
          'Producto al precio regular',
        timestamp: new Date().toISOString()
      });

  } catch(error) {
      console.error('❌ Error al obtener producto:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      });
  }
};

// 🎁 OBTENER SOLO PRODUCTOS EN OFERTA
const obtenerOfertas = async (req, res) => {
  try {
    console.log('🎁 Obteniendo ofertas específicamente...');
    
    const { page = 1, limit = 12 } = req.query;
    
    // Obtener todos los productos activos
    const { rows: productos } = await Producto.findAndCountAll({
      where: { activo: true },
      include: [
          { 
            model: Categoria, 
            as: 'categoria',
            required: false 
          },
          { 
            model: Marca, 
            as: 'marca',
            required: false 
          },
          { 
            model: Inventario, 
            as: 'inventarios', 
            attributes: ['stock_actual'],
            required: false 
          }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log(`📦 Productos obtenidos para ofertas: ${productos.length}`);

    // Procesar y filtrar solo productos con promociones
    const productosConPromociones = productos
      .map(producto => {
        const pJson = producto.toJSON();
        
        // Calcular stock
        let stock_actual = 0;
        if (pJson.inventarios && Array.isArray(pJson.inventarios)) {
          stock_actual = pJson.inventarios.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
        } else if (pJson.inventarios && pJson.inventarios.stock_actual) {
          stock_actual = pJson.inventarios.stock_actual;
        }
        
        const productoBase = {
          ...pJson,
          stock_actual,
          tiene_stock: stock_actual > 0,
          categoria_nombre: pJson.categoria?.nombre || 'Sin categoría',
          marca_nombre: pJson.marca?.nombre || 'Sin marca'
        };
        
        delete productoBase.inventarios;
        delete productoBase.categoria;
        delete productoBase.marca;
        
        return aplicarPromociones(productoBase);
      })
      .filter(producto => producto.tiene_promocion); // Solo productos con promociones

    console.log(`🔥 Ofertas encontradas: ${productosConPromociones.length}`);

    // Paginación manual
    const offset = (page - 1) * limit;
    const productosRecortados = productosConPromociones.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        ofertas: productosRecortados,
        estadisticas: {
          total_ofertas: productosConPromociones.length,
          ahorro_total: productosConPromociones.reduce((sum, p) => sum + p.ahorro_total, 0),
          mejor_descuento: productosConPromociones.length > 0 ? Math.max(...productosConPromociones.map(p => p.descuento_porcentaje)) : 0,
          promedio_descuento: productosConPromociones.length > 0 ? Math.round(productosConPromociones.reduce((sum, p) => sum + p.descuento_porcentaje, 0) / productosConPromociones.length) : 0
        },
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(productosConPromociones.length / limit),
          total_items: productosConPromociones.length
        }
      },
      message: `🔥 ${productosRecortados.length} ofertas increíbles encontradas`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error al obtener ofertas:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al obtener ofertas', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// 📂 LISTAR CATEGORÍAS CON ESTADÍSTICAS
const listarCategorias = async (req, res) => {
  try {
      console.log('📂 Listando categorías...');
      
      const categorias = await Categoria.findAll({
        include: [{
          model: Producto,
          as: 'productos',
          where: { activo: true },
          required: false
        }]
      });
      
      console.log(`📂 Categorías encontradas: ${categorias.length}`);
      
      const categoriasConEstadisticas = categorias.map(categoria => {
        const catJson = categoria.toJSON();
        const totalProductos = catJson.productos?.length || 0;
        
        // Simular productos con promociones por categoría
        let productosConPromocion = 0;
        let descuentoPromedio = 0;
        
        if (catJson.nombre === 'Herramientas Eléctricas') {
          productosConPromocion = Math.floor(totalProductos * 0.9); // 90% con promoción
          descuentoPromedio = 25;
        } else if (catJson.nombre === 'Herramientas Manuales') {
          productosConPromocion = Math.floor(totalProductos * 0.7); // 70% con promoción
          descuentoPromedio = 20;
        } else {
          productosConPromocion = Math.floor(totalProductos * 0.5); // 50% con promoción
          descuentoPromedio = 15;
        }
        
        delete catJson.productos;
        
        return {
          ...catJson,
          total_productos: totalProductos,
          productos_con_promocion: productosConPromocion,
          porcentaje_promocion: totalProductos > 0 ? Math.round((productosConPromocion / totalProductos) * 100) : 0,
          descuento_promedio: descuentoPromedio
        };
      });
      
      res.json({ 
        success: true, 
        data: categoriasConEstadisticas,
        message: `${categoriasConEstadisticas.length} categorías con estadísticas de promociones`,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
      console.error('❌ Error al listar categorías:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
  }
};

// 🏷️ LISTAR MARCAS CON PROMOCIONES
const listarMarcas = async (req, res) => {
  try {
      console.log('🏷️ Listando marcas...');
      
      const marcas = await Marca.findAll({
        include: [{
          model: Producto,
          as: 'productos',
          where: { activo: true },
          required: false
        }]
      });
      
      console.log(`🏷️ Marcas encontradas: ${marcas.length}`);
      
      const marcasConEstadisticas = marcas.map(marca => {
        const marcaJson = marca.toJSON();
        const totalProductos = marcaJson.productos?.length || 0;
        
        // Promociones específicas por marca
        let descuentoMarca = 0;
        let tienePromocion = false;
        let colorPromocion = '#3498db';
        
        if (marcaJson.nombre === 'Stanley') {
          descuentoMarca = 25;
          tienePromocion = true;
          colorPromocion = '#e74c3c';
        } else if (marcaJson.nombre === 'Bosch') {
          descuentoMarca = 20;
          tienePromocion = true;
          colorPromocion = '#27ae60';
        } else if (marcaJson.nombre === 'DeWalt') {
          descuentoMarca = 18;
          tienePromocion = true;
          colorPromocion = '#f39c12';
        } else if (marcaJson.nombre === 'Makita') {
          descuentoMarca = 15;
          tienePromocion = true;
          colorPromocion = '#2ecc71';
        } else if (marcaJson.nombre === 'Black & Decker' || marcaJson.nombre === 'Generica') {
          descuentoMarca = 22;
          tienePromocion = true;
          colorPromocion = '#9b59b6';
        }
        
        delete marcaJson.productos;
        
        return {
          ...marcaJson,
          total_productos: totalProductos,
          tiene_promocion_marca: tienePromocion,
          descuento_marca: descuentoMarca,
          etiqueta_promocion: tienePromocion ? `${marcaJson.nombre.toUpperCase()}${descuentoMarca}` : null,
          color_promocion: colorPromocion,
          mensaje_promocion: tienePromocion ? `¡Hasta ${descuentoMarca}% OFF en ${marcaJson.nombre}!` : null
        };
      });
      
      res.json({ 
        success: true, 
        data: marcasConEstadisticas,
        message: `${marcasConEstadisticas.length} marcas con información de promociones`,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
      console.error('❌ Error al listar marcas:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      });
  }
};

// Funciones placeholder para mantener compatibilidad
const crearProducto = async (req, res) => { 
  res.status(501).json({
    success: false, 
    message: "Función no implementada",
    timestamp: new Date().toISOString()
  }); 
};

const actualizarProducto = async (req, res) => { 
  res.status(501).json({
    success: false, 
    message: "Función no implementada",
    timestamp: new Date().toISOString()
  }); 
};

const eliminarProducto = async (req, res) => { 
  res.status(501).json({
    success: false, 
    message: "Función no implementada",
    timestamp: new Date().toISOString()
  }); 
};

const cargaMasiva = async (req, res) => { 
  res.status(501).json({
    success: false, 
    message: "Función no implementada",
    timestamp: new Date().toISOString()
  }); 
};

const subirImagen = async (req, res) => { 
  res.status(501).json({
    success: false, 
    message: "Función no implementada",
    timestamp: new Date().toISOString()
  }); 
};

module.exports = {
  listarProductos,
  obtenerProducto,
  obtenerOfertas,
  listarCategorias,
  listarMarcas,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  cargaMasiva,
  subirImagen
};