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
const clientesRoutes = require('./routes/clientes.routes');

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
app.use('/api/v1/clientes', clientesRoutes);
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
          path: '/api/v1/auth/login',
          description: 'Iniciar sesión'
        },
        registro: {
          method: 'POST',
          path: '/api/v1/auth/registro',
          description: 'Registrar nuevo usuario'
        }
      },
      usuarios: {
        listar: {
          method: 'GET',
          path: '/api/v1/usuarios',
          description: 'Listar usuarios (solo admin)'
        },
        crear: {
          method: 'POST',
          path: '/api/v1/usuarios',
          description: 'Crear usuario (solo admin)'
        }
      },
      productos: {
        listar: {
          method: 'GET',
          path: '/api/v1/productos',
          description: 'Listar productos'
        },
        crear: {
          method: 'POST',
          path: '/api/v1/productos',
          description: 'Crear producto (solo admin)'
        }
      },
      pedidos: {
        crear: {
          method: 'POST',
          path: '/api/v1/pedidos',
          description: 'Crear nuevo pedido'
        },
        listar: {
          method: 'GET',
          path: '/api/v1/pedidos',
          description: 'Listar pedidos'
        },
        obtener: {
          method: 'GET',
          path: '/api/v1/pedidos/:id',
          description: 'Obtener pedido específico'
        },
        cambiarEstado: {
          method: 'PUT',
          path: '/api/v1/pedidos/:id/estado',
          description: 'Cambiar estado del pedido (solo admin)'
        }
      }
    },
    swagger: `http://localhost:${process.env.PORT || 3001}/swagger.json`
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  const PORT = process.env.PORT || 3001;
  res.json({
    success: true,
    message: 'Bienvenido a la API de Ferremas',
    version: '1.0.0',
    servidor: `http://localhost:${PORT}`,
    documentacion: `http://localhost:${PORT}/api-docs`,
    healthCheck: `http://localhost:${PORT}/health`,
    testDb: `http://localhost:${PORT}/test-db`,
    setupDemo: `http://localhost:${PORT}/setup-demo-data`,
    modulos: {
      autenticacion: '/api/v1/auth',
      productos: '/api/v1/productos',
      pedidos: '/api/v1/pedidos',
      inventario: '/api/v1/inventario',
      clientes: '/api/v1/clientes'
    },
    endpoints: {
      auth: '/api/v1/auth',
      usuarios: '/api/v1/usuarios',
      productos: '/api/v1/productos',
      pedidos: '/api/v1/pedidos',
      inventario: '/api/v1/inventario',
      pagos: '/api/v1/pagos',
      reportes: '/api/v1/reportes',
      sistema: '/api/v1/sistema',
      divisas: '/api/v1/divisas',
      imagenes: '/api/v1/imagenes',
      clientes: '/api/v1/clientes'
    },
    endpointsPedidos: {
      crear: 'POST /api/v1/pedidos',
      listar: 'GET /api/v1/pedidos',
      obtener: 'GET /api/v1/pedidos/:id',
      cambiarEstado: 'PUT /api/v1/pedidos/:id/estado'
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
    timestamp: new Date().toISOString()
  });
});

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

// Iniciar servidor
const PORT = process.env.PORT || 3001;

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
