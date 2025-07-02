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
const promocionesRoutes = require('./src/routes/promociones.routes');
const pagosRoutes = require('./src/routes/pagos.routes');
const transbankRoutes = require('./src/routes/transbank.routes');
const reportesRoutes = require('./src/routes/reportes.routes');
const sistemaRoutes = require('./src/routes/sistema.routes');
const divisasRoutes = require('./src/routes/divisas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const facturasRoutes = require('./src/routes/facturas.routes'); // ← NUEVO
const dashboardRoutes = require('./src/routes/dashboard.routes'); // ← NUEVO
const descuentosRoutes = require('./src/routes/descuentos.routes');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public/favicon.ico')));
app.use('/logo192.png', express.static(path.join(__dirname, 'public/logo192.png')));
app.use('/logo512.png', express.static(path.join(__dirname, 'public/logo512.png')));

// Servir archivos estáticos de forma más robusta
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/pedidos', pedidosRoutes); // ← NUEVO
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/inventario', inventarioRoutes);
app.use('/api/v1/promociones', promocionesRoutes);
app.use('/api/v1/pagos', pagosRoutes);
app.use('/api/v1/transbank', transbankRoutes);
app.use('/api/v1/reportes', reportesRoutes);
app.use('/api/v1/sistema', sistemaRoutes);
app.use('/api/v1/divisas', divisasRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/facturas', facturasRoutes); // ← NUEVO
app.use('/api/v1/dashboard', dashboardRoutes); // ← NUEVO
app.use('/api/v1/descuentos', descuentosRoutes);

// Servir el frontend de React para cualquier otra ruta (SPA)
const frontBuildPath = path.join(__dirname, '../fronted/build');
app.use(express.static(frontBuildPath));
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    // Si la ruta es de la API y no existe, responder JSON
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.sendFile(path.join(frontBuildPath, 'index.html'));
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API Ferremas Nueva funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Inicializar base de datos y servidor
async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();