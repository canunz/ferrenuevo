const bcrypt = require('bcryptjs');
const { Usuario } = require('./src/models');

async function actualizarPasswordAdmin() {
  const email = 'admin@ferremas.cl';
  const nuevaPassword = 'admin123';
  const hash = await bcrypt.hash(nuevaPassword, 10);

  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    console.log('❌ Usuario admin no encontrado');
    process.exit(1);
  }

  usuario.password = hash;
  await usuario.save();
  console.log('✅ Contraseña del admin actualizada a:', nuevaPassword);
}

actualizarPasswordAdmin().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 