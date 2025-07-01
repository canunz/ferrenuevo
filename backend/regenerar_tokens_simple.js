const jwt = require('jsonwebtoken');

console.log('🔄 Regenerando tokens JWT...');

// Datos de usuario de prueba
const usuariosPrueba = [
  {
    id: 1,
    email: 'admin@ferremas.com',
    nombre: 'Administrador',
    rol_id: 1
  },
  {
    id: 2,
    email: 'cliente@ferremas.com',
    nombre: 'Cliente',
    rol_id: 2
  }
];

// Generar nuevos tokens
usuariosPrueba.forEach(usuario => {
  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol_id: usuario.rol_id 
    },
    'ferremas_secret_key',
    { expiresIn: '30d' }
  );
  
  console.log(`\n👤 Usuario: ${usuario.nombre}`);
  console.log(`📧 Email: ${usuario.email}`);
  console.log(`🔑 Token: ${token}`);
  console.log(`⏰ Expira: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}`);
});

console.log('\n✅ Tokens regenerados exitosamente!');
console.log('💡 Copia estos tokens y úsalos en el frontend para autenticación.'); 