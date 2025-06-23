const { Producto, Categoria, Marca, Inventario } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parse');

class ProductosController {
  // Listar todos los productos (SIN ASOCIACIONES COMPLEJAS)
  async listarProductos(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        categoria_id, 
        marca_id, 
        precio_min, 
        precio_max,
        activo = true 
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = { activo };

      // Filtros opcionales
      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (marca_id) whereClause.marca_id = marca_id;
      if (precio_min && precio_max) {
        whereClause.precio = { [Op.between]: [precio_min, precio_max] };
      } else if (precio_min) {
        whereClause.precio = { [Op.gte]: precio_min };
      } else if (precio_max) {
        whereClause.precio = { [Op.lte]: precio_max };
      }

      // Buscar productos SIN include (evitar errores de asociación)
      const { count, rows: productos } = await Producto.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['nombre', 'ASC']]
      });

      // Agregar categoría y marca manualmente
      const productosConDetalles = await Promise.all(
        productos.map(async (producto) => {
          const categoria = await Categoria.findByPk(producto.categoria_id);
          const marca = await Marca.findByPk(producto.marca_id);
          
          return {
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            precio_anterior: producto.precio_anterior,
            precio_oferta: producto.precio_oferta,
            imagen: producto.imagen,
            activo: producto.activo,
            etiquetas: Array.isArray(producto.etiquetas) 
              ? producto.etiquetas 
              : (producto.etiquetas ? producto.etiquetas.split(',') : []),
            categoria: categoria ? {
              id: categoria.id,
              nombre: categoria.nombre
            } : null,
            marca: marca ? {
              id: marca.id,
              nombre: marca.nombre
            } : null,
            created_at: producto.created_at,
            updated_at: producto.updated_at
          };
        })
      );

      res.json({
        success: true,
        message: 'Productos obtenidos exitosamente',
        data: {
          productos: productosConDetalles,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(count / limit),
            total_items: count,
            items_per_page: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar productos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Obtener producto por ID
  async obtenerProducto(req, res) {
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

      // Buscar categoría y marca por separado
      const categoria = await Categoria.findByPk(producto.categoria_id);
      const marca = await Marca.findByPk(producto.marca_id);
      const inventario = await Inventario.findOne({ 
        where: { producto_id: producto.id } 
      });

      const productoCompleto = {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        precio_anterior: producto.precio_anterior,
        precio_oferta: producto.precio_oferta,
        imagen: producto.imagen,
        activo: producto.activo,
        etiquetas: Array.isArray(producto.etiquetas) 
          ? producto.etiquetas 
          : (producto.etiquetas ? producto.etiquetas.split(',') : []),
        categoria: categoria ? {
          id: categoria.id,
          nombre: categoria.nombre
        } : null,
        marca: marca ? {
          id: marca.id,
          nombre: marca.nombre
        } : null,
        stock: inventario ? inventario.stock_actual : 0,
        created_at: producto.created_at,
        updated_at: producto.updated_at
      };

      res.json({
        success: true,
        message: 'Producto obtenido exitosamente',
        data: productoCompleto,
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

      // Crear inventario inicial
      await Inventario.create({
        producto_id: producto.id,
        sucursal: 'Principal',
        stock_actual: stock_inicial,
        stock_minimo: 5,
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

  // Actualizar producto
  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, precio_oferta, categoria_id, marca_id, activo } = req.body;

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
        data: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen
        },
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
      const { q, categoria_id, marca_id } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'El término de búsqueda debe tener al menos 2 caracteres',
          timestamp: new Date().toISOString()
        });
      }

      const whereClause = {
        activo: true,
        [Op.or]: [
          { nombre: { [Op.like]: `%${q}%` } },
          { descripcion: { [Op.like]: `%${q}%` } }
        ]
      };

      if (categoria_id) whereClause.categoria_id = categoria_id;
      if (marca_id) whereClause.marca_id = marca_id;

      const productos = await Producto.findAll({
        where: whereClause,
        limit: 20,
        order: [['nombre', 'ASC']]
      });

      // Agregar detalles manualmente
      const productosConDetalles = await Promise.all(
        productos.map(async (producto) => {
          const categoria = await Categoria.findByPk(producto.categoria_id);
          const marca = await Marca.findByPk(producto.marca_id);
          
          return {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            precio_oferta: producto.precio_oferta,
            imagen: producto.imagen,
            categoria: categoria ? categoria.nombre : 'Sin categoría',
            marca: marca ? marca.nombre : 'Sin marca'
          };
        })
      );

      res.json({
        success: true,
        message: `Se encontraron ${productosConDetalles.length} productos`,
        data: productosConDetalles,
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
      const categorias = await Categoria.findAll({
        where: { activo: true },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        message: 'Categorías obtenidas exitosamente',
        data: categorias,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar categorías:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
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
        message: 'Marcas obtenidas exitosamente',
        data: marcas,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar marcas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async cargaMasiva(req, res) {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
    }
    const productos = [];
    const errores = [];
    fs.createReadStream(req.file.path)
      .pipe(csv({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        productos.push(row);
      })
      .on('end', async () => {
        for (const prod of productos) {
          try {
            // Buscar o crear categoría y marca si es necesario
            let categoria = await Categoria.findOne({ where: { nombre: prod.categoria } });
            if (!categoria) {
              categoria = await Categoria.create({ nombre: prod.categoria });
            }
            let marca = await Marca.findOne({ where: { nombre: prod.marca } });
            if (!marca) {
              marca = await Marca.create({ nombre: prod.marca });
            }
            // Crear producto
            const producto = await Producto.create({
              nombre: prod.nombre,
              codigo: prod.codigo,
              descripcion: prod.descripcion,
              precio: prod.precio,
              categoria_id: categoria.id,
              marca_id: marca.id,
              activo: true
            });
            // Si hay stock, actualizar inventario
            if (prod.stock) {
              if (typeof Inventario !== 'undefined') {
                await Inventario.create({ producto_id: producto.id, stock_actual: prod.stock });
              }
            }
          } catch (err) {
            errores.push({ producto: prod.nombre, error: err.message });
          }
        }
        fs.unlinkSync(req.file.path); // Borra el archivo temporal
        res.json({ success: true, cargados: productos.length - errores.length, errores });
      });
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

      // Eliminar el producto
      await producto.destroy();

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
}

module.exports = new ProductosController();