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
const sequelize = require('./config/database');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// IMPORTAR RUTAS - MÓDULOS PRINCIPALES
// ==========================================

// Rutas existentes
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

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

// ==========================================
// CONFIGURAR RUTAS - API V1
// ==========================================

// Rutas principales existentes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);

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
    const [promocionesCount] = await sequelize.query('SELECT COUNT(*) as total FROM promociones');
    const [usuariosCount] = await sequelize.query('SELECT COUNT(*) as total FROM usuarios');
    
    // Verificar promociones vigentes (sin depender de columna activo)
    const [promocionesVigentes] = await sequelize.query(`
      SELECT COUNT(*) as vigentes 
      FROM promociones 
      WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW()
    `);

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
        promociones_totales: promocionesCount[0].total,
        promociones_vigentes: promocionesVigentes[0].vigentes,
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

// Endpoint de información del sistema
app.get('/api/v1/sistema/info', async (req, res) => {
  try {
    // Obtener configuraciones del sistema
    const [configuraciones] = await sequelize.query(`
      SELECT clave, valor, descripcion, tipo_dato, es_publica 
      FROM configuraciones_sistema 
      WHERE es_publica = 1
    `);

    // Estadísticas generales del sistema
    const [estadisticas] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM productos) as productos_activos,
        (SELECT COUNT(*) FROM categorias) as categorias_activas,
        (SELECT COUNT(*) FROM marcas) as marcas_activas,
        (SELECT COUNT(*) FROM promociones WHERE fecha_inicio <= NOW() AND fecha_fin >= NOW()) as promociones_vigentes,
        (SELECT COUNT(*) FROM api_keys) as api_keys_activas,
        (SELECT COUNT(*) FROM webhooks) as webhooks_activos
    `);

    // Convertir configuraciones a objeto clave-valor
    const config = {};
    configuraciones.forEach(conf => {
      let valor = conf.valor;
      
      // Convertir según tipo de dato
      if (conf.tipo_dato === 'number') {
        valor = parseFloat(valor);
      } else if (conf.tipo_dato === 'boolean') {
        valor = valor === 'true';
      } else if (conf.tipo_dato === 'json') {
        try {
          valor = JSON.parse(valor);
        } catch (e) {
          valor = conf.valor;
        }
      }
      
      config[conf.clave] = {
        valor: valor,
        descripcion: conf.descripcion
      };
    });

    res.json({
      success: true,
      data: {
        configuracion: config,
        estadisticas: estadisticas[0],
        version: '2.0.0',
        modulos_activos: [
          'productos',
          'promociones',
          'integraciones',
          'usuarios',
          'pedidos'
        ]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al obtener info del sistema:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la información del sistema',
      timestamp: new Date().toISOString()
    });
  }
});

// Setup de datos demo (mejorado)
app.post('/setup-demo-data', async (req, res) => {
  try {
    console.log('🚀 Configurando datos de demostración...');

    // Verificar si ya existen datos
    const [productosExistentes] = await sequelize.query('SELECT COUNT(*) as total FROM productos');
    const [promocionesExistentes] = await sequelize.query('SELECT COUNT(*) as total FROM promociones');

    if (productosExistentes[0].total > 0 && promocionesExistentes[0].total > 0) {
      return res.json({
        success: true,
        message: 'Los datos de demostración ya existen',
        data: {
          productos: productosExistentes[0].total,
          promociones: promocionesExistentes[0].total
        },
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Sistema configurado correctamente con todos los módulos',
      data: {
        modulos_implementados: [
          '✅ Gestión de Productos Completa',
          '✅ Sistema de Promociones Avanzado',
          '✅ Integraciones Externas',
          '✅ API Keys y Webhooks',
          '✅ Documentación Swagger',
          '✅ Estadísticas en Tiempo Real'
        ],
        endpoints_nuevos: [
          '/api/v1/promociones-admin',
          '/api/v1/integraciones',
          '/api/v1/sistema/info'
        ]
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en setup:', error);
    res.status(500).json({
      success: false,
      error: 'Error en configuración',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==========================================
// MANEJO DE ERRORES GLOBALES
// ==========================================

// 404 - Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    endpoints_disponibles: [
      '/api/v1/productos',
      '/api/v1/promociones-admin',
      '/api/v1/integraciones',
      '/api/v1/auth',
      '/api/v1/usuarios',
      '/api-docs',
      '/health'
    ],
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.name || 'Error interno del servidor',
    message: error.message || 'Ha ocurrido un error inesperado',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ Modelos sincronizados');
    }
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

// Iniciar servidor
async function startServer() {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log('\n🎉 ===================================');
      console.log('🚀 FERREMAS API - SERVIDOR INICIADO');
      console.log('🎉 ===================================');
      console.log(`🌐 Servidor: http://localhost:${PORT}`);
      console.log(`📚 Documentación: http://localhost:${PORT}/api-docs`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
      console.log(`ℹ️  Info Sistema: http://localhost:${PORT}/api/v1/sistema/info`);
      console.log('\n✅ MÓDULOS ACTIVOS:');
      console.log('🔐 Autenticación (/api/v1/auth)');
      console.log('🛍️  Productos (/api/v1/productos)');
      console.log('🎁 Promociones Admin (/api/v1/promociones-admin)');
      console.log('🔗 Integraciones (/api/v1/integraciones)');
      console.log('👥 Usuarios (/api/v1/usuarios)');
      console.log('📦 Pedidos (/api/v1/pedidos)');
      console.log('🎉 ===================================\n');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('👋 Cerrando servidor gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando servidor gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Iniciar la aplicación
startServer();

module.exports = app;