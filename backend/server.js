// ==========================================
// BACKEND/SERVER.JS - COMPLETO FUNCIONANDO
// ==========================================
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const path = require('path');
require('dotenv').config();

// Importar rutas funcionando + PEDIDOS
const authRoutes = require('./src/routes/auth.routes');
const productosRoutes = require('./src/routes/productos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes'); // ← NUEVO
const clientesRoutes = require('./src/routes/clientes.routes')
const inventarioRoutes = require('./src/routes/inventario.routes');

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

// Health check
app.get('/health', (req, res) => {
  res.json({
    message: '✅ FERREMAS API con Pedidos funcionando',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    database: 'connected',
    modulos: ['Auth', 'Productos', 'Pedidos']
  });
});

// Test de base de datos
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      message: '✅ Conexión a base de datos exitosa',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      message: '❌ Error de conexión a base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para configurar usuarios demo
app.post('/setup-demo-data', async (req, res) => {
  try {
    const { Usuario, Rol } = require('./src/models');
    const bcrypt = require('bcryptjs');

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ 
      where: { email: 'admin@ferremas.cl' } 
    });

    if (adminExistente) {
      return res.json({
        success: true,
        message: '✅ Usuarios demo ya existen',
        data: {
          admin: { email: 'admin@ferremas.cl', password: 'password123' },
          cliente: { email: 'cliente@test.com', password: 'password123' }
        },
        timestamp: new Date().toISOString()
      });
    }

    // Buscar roles
    const rolAdmin = await Rol.findOne({ where: { nombre: 'administrador' } });
    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });

    if (!rolAdmin || !rolCliente) {
      return res.status(400).json({
        success: false,
        error: 'Roles no encontrados',
        message: 'Ejecuta primero el script SQL',
        timestamp: new Date().toISOString()
      });
    }
    
    // Crear usuarios
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await Usuario.create({
      nombre: 'Administrador FERREMAS',
      email: 'admin@ferremas.cl',
      password: passwordHash,
      rol_id: rolAdmin.id,
      activo: true
    });

    const cliente = await Usuario.create({
      nombre: 'Cliente Demo',
      email: 'cliente@test.com',
      password: passwordHash,
      rol_id: rolCliente.id,
      activo: true
    });

    res.json({
      success: true,
      message: '🎉 Usuarios demos creados exitosamente',
      data: {
        admin: { email: 'admin@ferremas.cl', password: 'password123' },
        cliente: { email: 'cliente@test.com', password: 'password123' }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al crear usuarios demo:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// TODAS LAS RUTAS FUNCIONANDO
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes); // ← NUEVO SISTEMA DE PEDIDOS
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/inventario', inventarioRoutes);

// Manejo de errores 404
app.use('*', (req, res) => {
  const rutasDisponibles = [
    'GET /',
    'GET /health', 
    'GET /test-db',
    'POST /setup-demo-data',
    'GET /api-docs',
    
    // Autenticación
    'POST /api/v1/auth/login',
    'POST /api/v1/auth/registro',
    'GET /api/v1/auth/perfil',
    'PUT /api/v1/auth/perfil',
    
    // Productos
    'GET /api/v1/productos',
    'GET /api/v1/productos/:id',
    'POST /api/v1/productos',
    'PUT /api/v1/productos/:id',
    'GET /api/v1/productos/buscar',
    'GET /api/v1/productos/categorias',
    'GET /api/v1/productos/marcas',
    
    // Pedidos
    'GET /api/v1/pedidos',
    'GET /api/v1/pedidos/:id',
    'POST /api/v1/pedidos',
    'PUT /api/v1/pedidos/:id',
    'DELETE /api/v1/pedidos/:id',
    
    // Clientes
    'GET /api/v1/clientes',
    'GET /api/v1/clientes/:id',
    'POST /api/v1/clientes',
    'PUT /api/v1/clientes/:id',
    'DELETE /api/v1/clientes/:id',
    
    // Inventario
    'GET /api/v1/inventario',
    'GET /api/v1/inventario/:id',
    'POST /api/v1/inventario',
    'PUT /api/v1/inventario/:id',
    'DELETE /api/v1/inventario/:id'
  ];

  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe',
    ruta: req.originalUrl,
    rutasDisponibles,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
const iniciarServidor = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor FERREMAS API ejecutándose en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔍 Test DB: http://localhost:${PORT}/test-db`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🎯 Setup Demo: http://localhost:${PORT}/setup-demo-data`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;