const fs = require('fs');
const path = require('path');

console.log('🔧 Deshabilitando autenticación temporalmente...');

// Rutas que necesitan autenticación deshabilitada temporalmente
const rutasAAjustar = [
  'backend/src/routes/inventario.routes.js',
  'backend/src/routes/pagos.routes.js',
  'backend/src/routes/facturas.routes.js',
  'backend/src/routes/integraciones.routes.js',
  'backend/src/routes/reportes.routes.js',
  'backend/src/routes/usuarios.routes.js',
  'backend/src/routes/pedidos.routes.js',
  'backend/src/routes/clientes.routes.js'
];

rutasAAjustar.forEach(ruta => {
  try {
    const filePath = path.join(__dirname, '..', ruta);
    if (fs.existsSync(filePath)) {
      let contenido = fs.readFileSync(filePath, 'utf8');
      
      // Comentar líneas que usan verificarToken
      contenido = contenido.replace(
        /(router\.(get|post|put|delete|use)\s*\([^)]*),\s*verificarToken/g,
        '// $1, verificarToken'
      );
      
      // Comentar router.use(verificarToken)
      contenido = contenido.replace(
        /router\.use\(verificarToken\)/g,
        '// router.use(verificarToken)'
      );
      
      fs.writeFileSync(filePath, contenido);
      console.log(`✅ ${ruta} - Autenticación deshabilitada`);
    } else {
      console.log(`⚠️ ${ruta} - Archivo no encontrado`);
    }
  } catch (error) {
    console.log(`❌ Error en ${ruta}:`, error.message);
  }
});

console.log('\n🎉 Autenticación deshabilitada temporalmente en todas las rutas!');
console.log('💡 Reinicia el servidor para aplicar los cambios.'); 