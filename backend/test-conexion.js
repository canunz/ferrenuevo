const sequelize = require('./src/config/database');

async function probarConexion() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Probar que Sequelize funciona
    console.log('🔍 Probando funcionalidad de Sequelize...');
    const { DataTypes } = require('sequelize');
    
    const TestModel = sequelize.define('Test', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      tableName: 'test_temp',
      timestamps: false
    });
    
    console.log('✅ Sequelize.define funciona correctamente');
    console.log('🎉 Todo está configurado correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.error('🔧 Solución: Verifica usuario y contraseña en .env');
    } else if (error.message.includes('Unknown database')) {
      console.error('🔧 Solución: Crea la base de datos "ferremas_db" en MySQL');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('🔧 Solución: Verifica que MySQL esté ejecutándose');
    }
  } finally {
    await sequelize.close();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  probarConexion();
}