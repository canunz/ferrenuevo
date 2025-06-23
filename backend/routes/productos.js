// ==========================================
// ARCHIVO: backend/routes/productos.js (PARA TU BD EXACTA)
// ==========================================
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'emma2004',
  database: process.env.DB_NAME || 'ferremasnueva'
};

// Función helper para crear conexión
const getConnection = async () => {
  return await mysql.createConnection(dbConfig);
};

// GET /api/productos - Obtener todos los productos con marcas y categorías
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const { categoria, marca, precio_min, precio_max, q } = req.query;
    
    let sql = `
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.codigo_sku,
        p.categoria_id,
        p.marca_id,
        p.activo,
        p.imagen,
        p.created_at,
        p.updated_at,
        c.nombre as categoria_nombre,
        m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.activo = 1
    `;
    
    const params = [];
    
    // Filtros
    if (categoria) {
      sql += ' AND p.categoria_id = ?';
      params.push(categoria);
    }
    
    if (marca) {
      sql += ' AND p.marca_id = ?';
      params.push(marca);
    }
    
    if (precio_min) {
      sql += ' AND p.precio >= ?';
      params.push(precio_min);
    }
    
    if (precio_max) {
      sql += ' AND p.precio <= ?';
      params.push(precio_max);
    }
    
    if (q) {
      sql += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ? OR p.codigo_sku LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    
    sql += ' ORDER BY p.created_at DESC';
    
    const [productos] = await connection.execute(sql, params);
    
    res.json({
      success: true,
      data: productos,
      total: productos.length
    });
    
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/productos/:id - Obtener producto específico
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const [productos] = await connection.execute(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.id = ? AND p.activo = 1
    `, [req.params.id]);
    
    if (productos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: productos[0]
    });
    
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/productos/categorias - Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const [categorias] = await connection.execute(`
      SELECT 
        c.*,
        COUNT(p.id) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = 1
      WHERE c.activo = 1
      GROUP BY c.id
      ORDER BY c.nombre
    `);
    
    res.json({
      success: true,
      data: categorias
    });
    
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// GET /api/productos/marcas - Obtener todas las marcas
router.get('/marcas', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const [marcas] = await connection.execute(`
      SELECT 
        m.*,
        COUNT(p.id) as total_productos
      FROM marcas m
      LEFT JOIN productos p ON m.id = p.marca_id AND p.activo = 1
      WHERE m.activo = 1
      GROUP BY m.id
      ORDER BY m.nombre
    `);
    
    res.json({
      success: true,
      data: marcas
    });
    
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener marcas',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// POST /api/productos - Crear nuevo producto
router.post('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const { 
      nombre, 
      descripcion, 
      precio, 
      codigo_sku, 
      categoria_id, 
      marca_id, 
      imagen 
    } = req.body;
    
    // Validaciones básicas
    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }
    
    const [result] = await connection.execute(`
      INSERT INTO productos 
      (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, imagen, activo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `, [nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, imagen]);
    
    // Obtener el producto creado con JOIN
    const [producto] = await connection.execute(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.id = ?
    `, [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: producto[0]
    });
    
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const { 
      nombre, 
      descripcion, 
      precio, 
      codigo_sku, 
      categoria_id, 
      marca_id, 
      imagen 
    } = req.body;
    
    // Verificar que el producto existe
    const [existeProducto] = await connection.execute(
      'SELECT id FROM productos WHERE id = ? AND activo = 1',
      [req.params.id]
    );
    
    if (existeProducto.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    await connection.execute(`
      UPDATE productos 
      SET nombre = ?, descripcion = ?, precio = ?, codigo_sku = ?, 
          categoria_id = ?, marca_id = ?, imagen = ?, updated_at = NOW()
      WHERE id = ?
    `, [nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, imagen, req.params.id]);
    
    // Obtener el producto actualizado
    const [producto] = await connection.execute(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: producto[0]
    });
    
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// DELETE /api/productos/:id - Eliminar producto (soft delete)
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    // Verificar que el producto existe
    const [existeProducto] = await connection.execute(
      'SELECT id FROM productos WHERE id = ? AND activo = 1',
      [req.params.id]
    );
    
    if (existeProducto.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    // Soft delete
    await connection.execute(
      'UPDATE productos SET activo = 0, updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    
    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

module.exports = router;

// ==========================================
// ARCHIVO: backend/app.js (ACTUALIZADO)
// ==========================================
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test de conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'emma2004',
      database: process.env.DB_NAME || 'ferremasnueva'
    });
    
    await connection.execute('SELECT 1');
    await connection.end();
    console.log('✅ Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error.message);
  }
};

// Rutas
const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener estadísticas del dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'emma2004',
      database: process.env.DB_NAME || 'ferremasnueva'
    });

    // Obtener estadísticas básicas
    const [productos] = await connection.execute('SELECT COUNT(*) as total FROM productos WHERE activo = 1');
    const [categorias] = await connection.execute('SELECT COUNT(*) as total FROM categorias WHERE activo = 1');
    const [marcas] = await connection.execute('SELECT COUNT(*) as total FROM marcas WHERE activo = 1');
    
    // Valor total del inventario
    const [valorInventario] = await connection.execute(`
      SELECT SUM(precio) as valor_total FROM productos WHERE activo = 1
    `);

    await connection.end();

    res.json({
      success: true,
      data: {
        totalProductos: productos[0].total,
        totalCategorias: categorias[0].total,
        totalMarcas: marcas[0].total,
        valorInventario: valorInventario[0].valor_total || 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  await testConnection();
});

module.exports = app;