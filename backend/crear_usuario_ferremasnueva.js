const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const Usuario = require('./src/models/Usuario');
const Rol = require('./src/models/Rol');

async function crearUsuariosIniciales() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar roles
    const rolAdmin = await Rol.findOne({ where: { nombre: 'administrador' } });
    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });

    if (!rolAdmin || !rolCliente) {
      console.log('❌ No se encontraron los roles necesarios');
      return;
    }

    // Usuarios a crear
    const usuarios = [
      {
        nombre: 'Cata Soledad',
        email: 'catasoledad256@gmail.com',
        password: 'emma2004',
        rol_id: rolAdmin.id,
        rol: 'Administrador'
      },
      {
        nombre: 'Alex B',
        email: 'alexb321401@gmail.com',
        password: 'juanito2004',
        rol_id: rolCliente.id,
        rol: 'Cliente'
      }
    ];

    for (const u of usuarios) {
      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email: u.email } });
      if (usuarioExistente) {
        console.log(`⚠️ El usuario ${u.email} ya existe`);
        continue;
      }
      // Hashear la contraseña
      const passwordHash = await bcrypt.hash(u.password, 10);
      // Crear el usuario
      await Usuario.create({
        nombre: u.nombre,
        email: u.email,
        password: passwordHash,
        rol_id: u.rol_id,
        activo: true
      });
      console.log(`✅ Usuario creado: ${u.email} (${u.rol})`);
    }
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  } finally {
    await sequelize.close();
  }
}

crearUsuariosIniciales(); 