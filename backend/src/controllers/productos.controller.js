const { Producto, Categoria, Marca, Inventario } = require('../models');
const { Op } = require('sequelize');

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

      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Marca, as: 'marca' },
            { model: Inventario, as: 'inventarios', attributes: ['stock_actual'] }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      const productosConDetalles = productos.map(producto => {
        const pJson = producto.toJSON();
        const stock_actual = pJson.inventarios?.reduce((sum, inv) => sum + inv.stock_actual, 0) || 0;
        pJson.stock_actual = stock_actual;

        // Aplicamos descuento de ejemplo para que sea visible
        if (pJson.nombre.toLowerCase().includes('sierra circular bosch')) {
          pJson.precio_oferta = parseFloat(pJson.precio) * 0.85; // 15% de descuento
        }
        
        delete pJson.inventarios;
        return pJson;
      });

      res.json({
        success: true,
        data: {
          productos: productosConDetalles,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(count / limit),
            total_items: count
          }
        }
      });

    } catch (error) {
      console.error('Error al listar productos:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }

  // Obtener un producto por ID (Corregido para incluir stock)
  async obtenerProducto(req, res) {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria' },
                { model: Marca, as: 'marca' },
                { model: Inventario, as: 'inventarios' }
            ]
        });

        if (!producto) {
            return res.status(404).json({ success: false, error: 'Producto no encontrado' });
        }
        
        const pJson = producto.toJSON();
        pJson.stock_actual = pJson.inventarios?.reduce((sum, inv) => sum + inv.stock_actual, 0) || 0;
        delete pJson.inventarios;

        res.json({ 
          success: true, 
          message: 'Producto obtenido exitosamente',
          data: pJson,
          timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Error interno del servidor',
          message: error.message,
          timestamp: new Date().toISOString()
        });
    }
  }

  // Crear producto (solo admin)
  async crearProducto(req, res) {
    try {
      const { 
        nombre, 
        descripcion, 
        precio, 
        precio_oferta,
        categoria_id, 
        marca_id,
        stock_inicial = 0
      } = req.body;

      // Verificar que la categoría existe
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria) {
        return res.status(400).json({
          success: false,
          error: 'Categoría no encontrada',
          timestamp: new Date().toISOString()
        });
      }

      // Verificar que la marca existe
      const marca = await Marca.findByPk(marca_id);
      if (!marca) {
        return res.status(400).json({
          success: false,
          error: 'Marca no encontrada',
          timestamp: new Date().toISOString()
        });
      }

      // Procesar la imagen si existe
      let imagen = null;
      if (req.file) {
        imagen = req.file.filename;
      }

      // Crear producto
      const producto = await Producto.create({
        nombre,
        descripcion,
        precio,
        precio_oferta,
        categoria_id,
        marca_id,
        imagen,
        activo: true
      });

      // Crear inventario inicial automáticamente
      await Inventario.create({
        producto_id: producto.id,
        sucursal_id: 1, // Puedes ajustar según tu lógica de sucursales
        stock_actual: stock_inicial || 0,
        stock_minimo: 5,
        stock_maximo: 100,
        ubicacion: 'Bodega A'
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          categoria: categoria.nombre,
          marca: marca.nombre,
          imagen: producto.imagen,
          stock_inicial
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Actualizar producto (solo admin)
  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const { 
        nombre, 
        descripcion, 
        precio, 
        precio_oferta,
        categoria_id, 
        marca_id,
        activo 
      } = req.body;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado',
          timestamp: new Date().toISOString()
        });
      }

      // Procesar la imagen si existe
      let imagen = producto.imagen;
      if (req.file) {
        imagen = req.file.filename;
      }

      await producto.update({
        nombre,
        descripcion,
        precio,
        precio_oferta,
        categoria_id,
        marca_id,
        imagen,
        activo
      });

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Buscar productos
  async buscarProductos(req, res) {
    try {
      const { q, categoria_id, marca_id, precio_min, precio_max } = req.query;
      
      let whereClause = { activo: true };

      if (q) {
        whereClause[Op.or] = [
          { nombre: { [Op.like]: `%${q}%` } },
          { descripcion: { [Op.like]: `%${q}%` } },
          { codigo_sku: { [Op.like]: `%${q}%` } }
        ];
      }

      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (marca_id) whereClause.marca_id = marca_id;
      if (precio_min && precio_max) {
        whereClause.precio = { [Op.between]: [precio_min, precio_max] };
      }

      const productos = await Producto.findAll({
        where: whereClause,
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Marca, as: 'marca' },
          { model: Inventario, as: 'inventarios', attributes: ['stock_actual'] }
        ],
        order: [['nombre', 'ASC']]
      });

      const productosConStock = productos.map(producto => {
        const pJson = producto.toJSON();
        pJson.stock_actual = pJson.inventarios?.reduce((sum, inv) => sum + inv.stock_actual, 0) || 0;
        delete pJson.inventarios;
        return pJson;
      });

      res.json({
        success: true,
        data: productosConStock,
        total: productosConStock.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al buscar productos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Listar categorías
  async listarCategorias(req, res) {
    try {
      const categorias = await Categoria.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });
      res.json({ success: true, data: categorias });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Listar marcas
  async listarMarcas(req, res) {
    try {
      const marcas = await Marca.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });
      res.json({ success: true, data: marcas });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Eliminar producto (solo admin)
  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          error: 'Producto no encontrado',
          timestamp: new Date().toISOString()
        });
      }

      await producto.update({ activo: false });

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Carga masiva de productos
  async cargaMasiva(req, res) {
    try {
      const { productos } = req.body;
      
      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere un array de productos',
          timestamp: new Date().toISOString()
        });
      }

      const productosCreados = [];
      
      for (const productoData of productos) {
        const producto = await Producto.create(productoData);
        productosCreados.push(producto);
      }

      res.status(201).json({
        success: true,
        message: `${productosCreados.length} productos creados exitosamente`,
        data: productosCreados,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error en carga masiva:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new ProductosController(); 