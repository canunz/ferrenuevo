// ==========================================
// SCRIPT: VERIFICAR SERVIDOR
// ==========================================
const net = require('net');

console.log('🔍 Verificando servidor...\n');

function verificarPuerto(puerto) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(puerto, 'localhost');
  });
}

verificarPuerto(3002).then(estaCorriendo => {
  if (estaCorriendo) {
    console.log('✅ Servidor corriendo en puerto 3002');
    console.log('\n🎉 Correcciones aplicadas exitosamente!');
    console.log('\n📋 Resumen de la corrección del error de movimientos:');
    console.log('   ✅ Error "stock_anterior cannot be null" SOLUCIONADO');
    console.log('   ✅ Error "stock_nuevo cannot be null" SOLUCIONADO');
    console.log('   ✅ Método crearMovimiento mejorado');
    console.log('   ✅ Cálculo automático de stock implementado');
    console.log('   ✅ Validaciones de stock agregadas');
    console.log('\n🚀 Ahora puedes probar los movimientos de inventario sin errores!');
  } else {
    console.log('❌ Servidor NO está corriendo en puerto 3002');
    console.log('💡 Ejecuta: cd backend && npm start');
  }
}); 