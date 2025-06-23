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

        res.json({ success: true, data: pJson });

    } catch(error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  }

  // Listar categorías
  async listarCategorias(req, res) {
    try {
        const categorias = await Categoria.findAll();
        res.json({ success: true, data: categorias });
    } catch (error) {
        console.error('Error al listar categorías:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }

  // Listar marcas
  async listarMarcas(req, res) {
    try {
        const marcas = await Marca.findAll();
        res.json({ success: true, data: marcas });
    } catch (error) {
        console.error('Error al listar marcas:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }

  // Funciones placeholder para mantener compatibilidad
  async crearProducto(req, res) { 
    res.status(501).json({success: false, message: "Función no implementada"}); 
  }
  
  async actualizarProducto(req, res) { 
    res.status(501).json({success: false, message: "Función no implementada"}); 
  }
  
  async eliminarProducto(req, res) { 
    res.status(501).json({success: false, message: "Función no implementada"}); 
  }
  
  async cargaMasiva(req, res) { 
    res.status(501).json({success: false, message: "Función no implementada"}); 
  }
}

module.exports = new ProductosController(); 