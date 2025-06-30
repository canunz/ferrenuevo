const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function actualizarPassword() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'emma2004',
    database: 'ferremasnueva'
  });

  try {
    const password = 'admin123';
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    console.log('Hash generado:', hashedPassword);
    
    const [result] = await connection.execute(
      'UPDATE usuarios SET password = ? WHERE email = ?',
      [hashedPassword, 'admin@ferremas.cl']
    );
    
    console.log('Usuario actualizado:', result);
    
    // Verificar que se actualizó
    const [rows] = await connection.execute(
      'SELECT email, password FROM usuarios WHERE email = ?',
      ['admin@ferremas.cl']
    );
    
    console.log('Usuario después de actualizar:', rows[0]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

actualizarPassword(); 