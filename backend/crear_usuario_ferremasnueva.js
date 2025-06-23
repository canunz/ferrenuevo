const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const Usuario = require('./src/models/Usuario');
const Rol = require('./src/models/Rol');

async function crearUsuarioFerremasnueva() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({
      where: { email: 'ferremasnueva@ferremas.cl' }
    });

    if (usuarioExistente) {
      console.log('⚠️ El usuario ferremasnueva ya existe');
      console.log('📧 Email: ferremasnueva@ferremas.cl');
      console.log('🔑 Contraseña: emma2004');
      return;
    }

    // Buscar el rol de cliente
    const rolCliente = await Rol.findOne({
      where: { nombre: 'cliente' }
    });

    if (!rolCliente) {
      console.log('❌ No se encontró el rol de cliente');
      return;
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash('emma2004', 10);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre: 'Ferremas Nueva',
      email: 'ferremasnueva@ferremas.cl',
      password: passwordHash,
      rol_id: rolCliente.id,
      activo: true
    });

    console.log('✅ Usuario creado exitosamente');
    console.log('📧 Email: ferremasnueva@ferremas.cl');
    console.log('🔑 Contraseña: emma2004');
    console.log('👤 Nombre: Ferremas Nueva');
    console.log('🎭 Rol: Cliente');

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
  } finally {
    await sequelize.close();
  }
}

crearUsuarioFerremasnueva(); 