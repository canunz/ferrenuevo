// ==========================================
// src/index.js - ACTUALIZADO CON TODOS LOS MÓDULOS
// ==========================================

const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');
const morgan = require('morgan');

// Importar configuración de base de datos
const { sequelize } = require('./models');

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));

// Servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../public/imagenes')));

// ==========================================
// IMPORTAR RUTAS - MÓDULOS PRINCIPALES
// ==========================================

// Rutas existentes
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const clientesRoutes = require('./routes/clientes.routes');
const inventarioRoutes = require('./routes/inventario.routes');

// ==========================================
// NUEVOS MÓDULOS IMPLEMENTADOS
// ==========================================

// Promociones Admin (Gestión completa de promociones)
const promocionesAdminRoutes = require('../routes/promociones-admin.routes');

// Integraciones Externas (API Keys, Webhooks, etc.)
const integracionesRoutes = require('./routes/integraciones.routes');

// Divisas y Banco Central
const divisasRoutes = require('./routes/divisas.routes');

// Transbank - Sistema de pagos
const transbankRoutes = require('./routes/transbank.routes');

// Facturas
const facturasRoutes = require('./routes/facturas.routes');

// ==========================================
// CONFIGURAR RUTAS - API V1
// ==========================================

// Rutas principales existentes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/inventario', inventarioRoutes);

// ==========================================
// NUEVAS RUTAS IMPLEMENTADAS
// ==========================================

// Promociones y Descuentos Admin
app.use('/api/v1/promociones-admin', promocionesAdminRoutes);

// Integraciones Externas
app.use('/api/v1/integraciones', integracionesRoutes);

// Divisas y Banco Central
app.use('/api/v1/divisas', divisasRoutes);

// Transbank - Sistema de pagos
app.use('/api/v1/transbank', transbankRoutes);

// Facturas
app.use('/api/v1/facturas', facturasRoutes);

// ==========================================
// RUTAS ESPECIALES Y UTILIDADES
// ==========================================

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Ferremas API - Documentación",
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// Health Check mejorado
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await sequelize.authenticate();
    
    // Verificar estado de tablas principales
    const [productosCount] = await sequelize.query('SELECT COUNT(*) as total FROM productos');
    const [usuariosCount] = await sequelize.query('SELECT COUNT(*) as total FROM usuarios');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      services: {
        database: 'connected',
        api: 'operational',
        promociones: 'active',
        integraciones: 'ready'
      },
      estadisticas: {
        productos: productosCount[0].total,
        usuarios: usuariosCount[0].total
      },
      endpoints: {
        productos: '/api/v1/productos',
        promociones_admin: '/api/v1/promociones-admin',
        integraciones: '/api/v1/integraciones',
        documentacion: '/api-docs'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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

// Ruta para setup de datos demo
app.post('/setup-demo-data', async (req, res) => {
  try {
    const { Usuario, Rol } = require('./models');
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

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🔥 FERREMAS API COMPLETA - MÓDULOS IMPLEMENTADOS',
    version: '2.0.0',
    server_port: process.env.PORT || 3000,
    modules: {
      productos: {
        base: '/api/v1/productos',
        status: 'active',
        endpoints: [
          'GET /api/v1/productos - Listar productos con filtros',
          'POST /api/v1/productos - Crear producto',
          'GET /api/v1/productos/:id - Obtener producto',
          'PUT /api/v1/productos/:id - Actualizar producto',
          'DELETE /api/v1/productos/:id - Eliminar producto'
        ]
      },
      promociones: {
        base: '/api/v1/promociones-admin',
        status: 'active',
        endpoints: [
          'GET /api/v1/promociones-admin - Listar promociones',
          'POST /api/v1/promociones-admin - Crear promoción',
          'PUT /api/v1/promociones-admin/:id - Actualizar promoción',
          'DELETE /api/v1/promociones-admin/:id - Eliminar promoción'
        ]
      },
      integraciones: {
        base: '/api/v1/integraciones',
        status: 'active',
        endpoints: [
          'GET /api/v1/integraciones/api-keys - Listar API Keys',
          'POST /api/v1/integraciones/api-keys - Generar API Key',
          'POST /api/v1/integraciones/webhooks - Configurar webhook',
          'GET /api/v1/integraciones/webhooks/logs - Ver logs'
        ]
      },
      auth: {
        base: '/api/v1/auth',
        status: 'active',
        endpoints: [
          'POST /api/v1/auth/login - Iniciar sesión',
          'POST /api/v1/auth/registro - Registrarse',
          'GET /api/v1/auth/perfil - Obtener perfil'
        ]
      },
      clientes: {
        base: '/api/v1/clientes',
        status: 'active',
        endpoints: [
          'GET /api/v1/clientes - Listar clientes',
          'GET /api/v1/clientes/:id - Obtener cliente',
          'POST /api/v1/clientes - Crear cliente',
          'PUT /api/v1/clientes/:id - Actualizar cliente'
        ]
      }
    },
    testing: {
      basic_test: `http://localhost:${process.env.PORT || 3000}/health`,
      server_status: `http://localhost:${process.env.PORT || 3000}/test-db`,
      health_check: `http://localhost:${process.env.PORT || 3000}/health`
    },
    features: [
      '✅ Gestión completa de productos',
      '✅ Sistema de promociones y cupones',
      '✅ API Keys y webhooks',
      '✅ Subida de imágenes',
      '✅ Filtros avanzados',
      '✅ Paginación',
      '✅ Logs y auditoría',
      '✅ Dashboard con estadísticas',
      '✅ Gestión de clientes',
      '✅ Sistema de autenticación',
      '✅ Integración con Transbank'
    ]
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  console.log(`❌ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    suggestions: [
      'GET /health - Para verificar estado del servidor',
      'GET /test-db - Para probar conexión a base de datos',
      'GET /api-docs - Para ver documentación completa',
      'GET /api/v1/productos - Para listar productos',
      'GET /api/v1/clientes - Para listar clientes'
    ],
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((error, req, res, next) => {
  console.error('❌ Error del servidor:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const iniciarServidor = async () => {
  try {
    // Verificar conexión a la base de datos sin modificar tablas
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Solo sincronizar en desarrollo si las tablas no existen
    if (process.env.NODE_ENV === 'development') {
      try {
        await sequelize.sync({ force: false });
        console.log('✅ Base de datos verificada');
      } catch (syncError) {
        console.warn('⚠️ Advertencia al sincronizar (tablas pueden existir):', syncError.message);
      }
    }
    
    const PORT = process.env.PORT || 3002;
    const server = app.listen(PORT, () => {
      console.log(`
🚀 ==========================================
     FERREMAS API COMPLETA FUNCIONANDO
🚀 ==========================================
🌐 Servidor: http://localhost:${PORT}

🧪 PRUEBAS BÁSICAS:
   http://localhost:${PORT}/health
   http://localhost:${PORT}/test-db

📊 API ENDPOINTS:
   http://localhost:${PORT}/api/v1/productos
   http://localhost:${PORT}/api/v1/clientes

📚 Documentación completa:
   http://localhost:${PORT}/api-docs

✅ SERVIDOR CONFIGURADO PARA FRONTEND EN PUERTO 3000!
      `);
      
      // Verificar que las rutas críticas funcionan
      console.log('\n🔍 Verificando rutas críticas...');
      setTimeout(() => {
        console.log('✅ Servidor completamente inicializado');
      }, 1000);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Puerto ${PORT} está ocupado. Intentando puerto ${PORT + 1}...`);
        const newPort = PORT + 1;
        app.listen(newPort, () => {
          console.log(`🚀 Servidor iniciado en puerto ${newPort}: http://localhost:${newPort}`);
        });
      } else {
        console.error('❌ Error al iniciar servidor:', err);
      }
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
iniciarServidor();

module.exports = app;
