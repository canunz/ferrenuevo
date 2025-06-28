const bcrypt = require('bcryptjs');

async function generarHashesUsuarios() {
  console.log('Generando hashes de contraseñas para usuarios...');
  
  const usuarios = [
    { email: 'catasoledad256@gmail.com', password: 'catasoledad256' },
    { email: 'alexb321401@gmail.com', password: 'emma2004' },
    { email: 'cjcatalinac@gmail.com', password: 'catalina123' },
    { email: 'ferremasnueva@ferremas.cl', password: 'ferremas123' }
  ];
  
  console.log('\n=== HASHES GENERADOS ===');
  
  for (const usuario of usuarios) {
    const hash = await bcrypt.hash(usuario.password, 10);
    console.log(`\nUsuario: ${usuario.email}`);
    console.log(`Contraseña: ${usuario.password}`);
    console.log(`Hash: ${hash}`);
  }
  
  console.log('\n=== COMANDOS SQL ===');
  console.log('-- Actualizar contraseñas de usuarios');
  
  for (const usuario of usuarios) {
    const hash = await bcrypt.hash(usuario.password, 10);
    console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = '${usuario.email}';`);
  }
  
  console.log('\n=== VERIFICACIÓN ===');
  console.log('-- Verificar que se actualizaron correctamente');
  usuarios.forEach(u => {
    console.log(`SELECT id, nombre, email, LEFT(password, 10) as password_preview FROM usuarios WHERE email = '${u.email}';`);
  });
}

generarHashesUsuarios().catch(console.error); 