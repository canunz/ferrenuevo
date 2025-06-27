const bcrypt = require('bcryptjs');

async function generarHashes() {
  console.log('Generando hashes de contraseñas...');
  
  const password1 = 'catasoledad256';
  const password2 = 'emma2004';
  
  const hash1 = await bcrypt.hash(password1, 10);
  const hash2 = await bcrypt.hash(password2, 10);
  
  console.log('Hash para catasoledad256:', hash1);
  console.log('Hash para emma2004:', hash2);
  
  console.log('\nComandos SQL para actualizar:');
  console.log(`UPDATE usuarios SET password = '${hash1}' WHERE email = 'catasoledad256@gmail.com';`);
  console.log(`UPDATE usuarios SET password = '${hash2}' WHERE email = 'alexb321401@gmail.com';`);
}

generarHashes().catch(console.error); 