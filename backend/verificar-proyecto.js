const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificar que las variables de entorno estén definidas
if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('❌ Error: Variables de entorno de base de datos no definidas');
  console.error('Verifica que tu archivo .env contenga: DB_NAME, DB_USER, DB_PASSWORD');
  process.exit(1);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '-03:00', // Zona horaria de Chile
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Probar conexión al exportar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Configuración de base de datos cargada correctamente');
  })
  .catch(err => {
    console.error('❌ Error en configuración de base de datos:', err.message);
  });

module.exports = sequelize;