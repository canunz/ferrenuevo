// ==========================================
// BACKEND/SERVER.JS - COMPLETO FUNCIONANDO
// ==========================================
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Iniciando FERREMAS API COMPLETA...');

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configuración BD
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'emma2004',
  database: process.env.DB_NAME || 'ferremasnueva'
};

// ==========================================
// RUTAS
// ==========================================

// HEALTH CHECK
app.get('/health', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('SELECT 1');
    await connection.end();
    
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: { status: 'connected', dialect: 'mysql' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      database: { status: 'disconnected', error: error.message }
    });
  }
});

// PRODUCTOS
app.get('/api/productos', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [productos] = await connection.execute(`
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
        COALESCE(c.nombre, 'Sin categoría') as categoria_nombre,
        COALESCE(m.nombre, 'Sin marca') as marca_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE p.activo = 1
      ORDER BY p.created_at DESC
    `);
    
    res.json({
      success: true,
      data: productos,
      total: productos.length,
      message: `${productos.length} productos encontrados`
    });
    
  } catch (error) {
    console.error('Error productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// MARCAS
app.get('/api/productos/marcas', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [marcas] = await connection.execute(`
      SELECT 
        m.id,
        m.nombre,
        m.descripcion,
        m.activo,
        COUNT(p.id) as total_productos
      FROM marcas m
      LEFT JOIN productos p ON m.id = p.marca_id AND p.activo = 1
      WHERE m.activo = 1
      GROUP BY m.id, m.nombre, m.descripcion, m.activo
      ORDER BY m.nombre
    `);
    
    res.json({
      success: true,
      data: marcas,
      total: marcas.length
    });
    
  } catch (error) {
    console.error('Error marcas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener marcas',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// CATEGORÍAS
app.get('/api/productos/categorias', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [categorias] = await connection.execute(`
      SELECT 
        c.id,
        c.nombre,
        c.descripcion,
        c.activo,
        COUNT(p.id) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = 1
      WHERE c.activo = 1
      GROUP BY c.id, c.nombre, c.descripcion, c.activo
      ORDER BY c.nombre
    `);
    
    res.json({
      success: true,
      data: categorias,
      total: categorias.length
    });
    
  } catch (error) {
    console.error('Error categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// ESTADÍSTICAS DASHBOARD
app.get('/api/dashboard/stats', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [productos] = await connection.execute('SELECT COUNT(*) as total FROM productos WHERE activo = 1');
    const [marcas] = await connection.execute('SELECT COUNT(*) as total FROM marcas WHERE activo = 1');
    const [categorias] = await connection.execute('SELECT COUNT(*) as total FROM categorias WHERE activo = 1');
    const [valorInventario] = await connection.execute('SELECT SUM(precio) as valor_total FROM productos WHERE activo = 1');
    
    res.json({
      success: true,
      data: {
        totalProductos: productos[0].total,
        totalMarcas: marcas[0].total,
        totalCategorias: categorias[0].total,
        valorInventario: valorInventario[0].valor_total || 0
      }
    });
    
  } catch (error) {
    console.error('Error estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// TEST
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// HOME
app.get('/', (req, res) => {
  res.json({
    message: '🔥 FERREMAS API - FUNCIONANDO',
    endpoints: [
      'GET /api/productos',
      'GET /api/productos/marcas',
      'GET /api/productos/categorias',
      'GET /api/dashboard/stats'
    ]
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
});

// INICIAR SERVIDOR
app.listen(PORT, async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('SELECT 1');
    await connection.end();
    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.error('❌ Error BD:', error.message);
  }
  
  console.log(`
🚀 ==========================================
        FERREMAS API FUNCIONANDO
🚀 ==========================================
🌐 Servidor: http://localhost:${PORT}
📦 Productos: http://localhost:${PORT}/api/productos
🏷️ Marcas: http://localhost:${PORT}/api/productos/marcas
📁 Categorías: http://localhost:${PORT}/api/productos/categorias
  `);
});

module.exports = app;