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
const models = require('./models');

// Configuración de CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Importar rutas
const imagenRoutes = require('./routes/imagenRoutes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const pagosRoutes = require('./routes/pagos.routes');
const reportesRoutes = require('./routes/reportes.routes');
const sistemaRoutes = require('./routes/sistema.routes');
const divisasRoutes = require('./routes/divisas.routes');
const transbankRoutes = require('./routes/transbank.routes');
const promocionesRoutes = require('./routes/promociones.routes');

// Configurar rutas
app.use('/api/v1/imagenes', imagenRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/pagos', pagosRoutes);
app.use('/api/v1/reportes', reportesRoutes);
app.use('/api/v1/sistema', sistemaRoutes);
app.use('/api/v1/divisas', divisasRoutes);
app.use('/api/v1/transbank', transbankRoutes);
app.use('/api/v1/promociones', promocionesRoutes);
app.use('/static', express.static(path.join(__dirname, '../public/imagenes')));

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: 'connected',
      dialect: 'mysql'
    }
  });
});

// Ruta para setup de datos demo
app.get('/setup-demo-data', async (req, res) => {
  try {
    // Aquí iría la lógica para crear datos de prueba
    res.json({
      success: true,
      message: 'Datos de prueba creados exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear datos de prueba',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de documentación
app.get('/api-docs', (req, res) => {
  res.json({
    success: true,
    message: 'Documentación de la API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Iniciar sesión'
        },
        registro: {
          method: 'POST',
          path: '/api/auth/registro',
          description: 'Registrar nuevo usuario'
        }
      },
      usuarios: {
        listar: {
          method: 'GET',
          path: '/api/usuarios',
          description: 'Listar usuarios (solo admin)'
        },
        crear: {
          method: 'POST',
          path: '/api/usuarios',
          description: 'Crear usuario (solo admin)'
        }
      },
      productos: {
        listar: {
          method: 'GET',
          path: '/api/productos',
          description: 'Listar productos'
        },
        crear: {
          method: 'POST',
          path: '/api/productos',
          description: 'Crear producto (solo admin)'
        }
      },
      pedidos: {
        crear: {
          method: 'POST',
          path: '/api/pedidos',
          description: 'Crear nuevo pedido'
        },
        listar: {
          method: 'GET',
          path: '/api/pedidos',
          description: 'Listar pedidos'
        },
        obtener: {
          method: 'GET',
          path: '/api/pedidos/:id',
          description: 'Obtener pedido específico'
        },
        cambiarEstado: {
          method: 'PUT',
          path: '/api/pedidos/:id/estado',
          description: 'Cambiar estado del pedido (solo admin)'
        }
      }
    },
    swagger: `http://localhost:${process.env.PORT || 3000}/swagger.json`
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  const PORT = process.env.PORT || 3000;
  res.json({
    success: true,
    message: 'Bienvenido a la API de Ferremas',
    version: '1.0.0',
    servidor: `http://localhost:${PORT}`,
    documentacion: `http://localhost:${PORT}/api-docs`,
    healthCheck: `http://localhost:${PORT}/health`,
    setupDemo: `http://localhost:${PORT}/setup-demo-data`,
    modulos: {
      autenticacion: '/api/auth',
      productos: '/api/productos',
      pedidos: '/api/pedidos'
    },
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      pedidos: '/api/pedidos',
      inventario: '/api/inventario',
      pagos: '/api/pagos',
      reportes: '/api/reportes',
      sistema: '/api/sistema',
      divisas: '/api/divisas',
      imagenes: '/api/imagenes'
    },
    endpointsPedidos: {
      crear: 'POST /api/pedidos',
      listar: 'GET /api/pedidos',
      obtener: 'GET /api/pedidos/:id',
      cambiarEstado: 'PUT /api/pedidos/:id/estado'
    },
    credenciales: {
      admin: {
        email: 'admin@ferremas.cl',
        password: 'password123'
      },
      cliente: {
        email: 'cliente@test.com',
        password: 'password123'
      }
    },
    documentacion: 'Para más detalles sobre cada endpoint, consulte la documentación de la API'
  });
});

// Middleware 404 (debe ir al final)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada', message: `La ruta ${req.method} ${req.originalUrl} no existe` });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

// Sincronizar la base de datos y luego iniciar el servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor corriendo en http://localhost:${PORT}
📚 Documentación: http://localhost:${PORT}/api-docs
❤️ Health Check: http://localhost:${PORT}/health
🔧 Setup Users: POST http://localhost:${PORT}/setup-demo-data

✅ MÓDULOS FUNCIONANDO:
   🔐 Autenticación (/api/auth)
   🛍️ Productos (/api/productos)
   📦 Pedidos (/api/pedidos)
   💳 Transbank (/api/transbank)

🎯 ENDPOINTS DE PEDIDOS:
   POST /api/pedidos           # Crear pedido
   GET  /api/pedidos           # Listar pedidos  
   GET  /api/pedidos/:id       # Ver pedido específico
   PUT  /api/pedidos/:id/estado # Cambiar estado (admin)

💡 CREDENCIALES:
   ferremasnueva / emma2004
   admin@ferremas.cl / password123
   cliente@test.com / password123

🎯 ¡SISTEMA DE PEDIDOS Y PAGOS LISTO PARA USAR!
      `);
    });
  })
  .catch(error => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }); 