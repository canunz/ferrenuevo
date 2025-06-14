// ============================================
// server.js ACTUALIZADO CON SISTEMA DE PEDIDOS
// ============================================
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const path = require('path');

// Importar rutas funcionando + PEDIDOS
const authRoutes = require('./src/routes/auth.routes');
const productosRoutes = require('./src/routes/productos.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes'); // ← NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "FERREMAS API Documentation"
}));

// Página principal
app.get('/', (req, res) => {
  res.json({
    message: '🏗️ API FERREMAS - Sistema con Pedidos',
    version: '1.0.0',
    status: 'OK',
    documentacion: `http://localhost:${PORT}/api-docs`,
    modulos_funcionando: {
      '🔐 Autenticación': '/api/v1/auth',
      '🛍️ Productos': '/api/v1/productos',
      '📦 Pedidos': '/api/v1/pedidos' // ← NUEVO
    },
    endpoints_activos: [
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/registro', 
      'GET /api/v1/auth/perfil',
      'GET /api/v1/productos',
      'GET /api/v1/productos/:id',
      'GET /api/v1/productos/categorias',
      'GET /api/v1/productos/marcas',
      // NUEVOS ENDPOINTS DE PEDIDOS
      'POST /api/v1/pedidos',
      'GET /api/v1/pedidos',
      'GET /api/v1/pedidos/:id',
      'PUT /api/v1/pedidos/:id/estado'
    ],
    timestamp: new Date().toISOString()
  });
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
    
    // ✨ NUEVOS ENDPOINTS DE PEDIDOS
    'POST /api/v1/pedidos',
    'GET /api/v1/pedidos',
    'GET /api/v1/pedidos/:id',
    'PUT /api/v1/pedidos/:id/estado'
  ];

  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    rutas_disponibles: rutasDisponibles,
    total_endpoints: rutasDisponibles.length,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    console.log('🔗 Conectando a MySQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente');

    app.listen(PORT, () => {
      console.log(`
🚀 ==========================================
      FERREMAS API CON SISTEMA DE PEDIDOS
🚀 ==========================================

🌐 Servidor: http://localhost:${PORT}
📚 Documentación: http://localhost:${PORT}/api-docs
❤️ Health Check: http://localhost:${PORT}/health
🔧 Setup Users: POST http://localhost:${PORT}/setup-demo-data

✅ MÓDULOS FUNCIONANDO:
   🔐 Autenticación (/api/v1/auth)
   🛍️ Productos (/api/v1/productos)
   📦 Pedidos (/api/v1/pedidos) ← NUEVO!

🎯 NUEVOS ENDPOINTS DE PEDIDOS:
   POST /api/v1/pedidos           # Crear pedido
   GET  /api/v1/pedidos           # Listar pedidos  
   GET  /api/v1/pedidos/:id       # Ver pedido específico
   PUT  /api/v1/pedidos/:id/estado # Cambiar estado (admin)

💡 CREDENCIALES:
   admin@ferremas.cl / password123
   cliente@test.com / password123

🎯 ¡SISTEMA DE PEDIDOS LISTO PARA USAR!
      `);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;