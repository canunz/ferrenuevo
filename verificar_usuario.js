const { Usuario, Rol } = require('./src/models');
const sequelize = require('./src/config/database');

async function verificarUsuario() {
  try {
    await sequelize.sync();
    
    const usuario = await Usuario.findOne({ 
      where: { email: 'catasoledad256@gmail.com' },
      include: [{ model: Rol, as: 'rol' }]
    });
    
    if (usuario) {
      console.log('✅ Usuario encontrado:');
      console.log(`   ID: ${usuario.id}`);
      console.log(`   Nombre: ${usuario.nombre}`);
      console.log(`   Email: ${usuario.email}`);
      console.log(`   Rol: ${usuario.rol ? usuario.rol.nombre : 'Sin rol'}`);
      console.log(`   Activo: ${usuario.activo ? 'Sí' : 'No'}`);
      console.log('');
      console.log('🔑 Credenciales de acceso:');
      console.log('   Email: catasoledad256@gmail.com');
      console.log('   Contraseña: emma2004');
    } else {
      console.log('❌ Usuario no encontrado');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit();
  }
}

verificarUsuario(); 