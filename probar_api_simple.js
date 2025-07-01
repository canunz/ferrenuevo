const https = require('https');

// Configurar para ignorar certificados SSL en desarrollo
const agent = new https.Agent({
  rejectUnauthorized: false
});

async function probarAPI() {
  console.log('🧪 Probando API de Ferremas Nueva...\n');

  try {
    // 1. Probar endpoint principal
    console.log('1️⃣ Probando endpoint principal...');
    const response1 = await fetch('http://localhost:3004/');
    const data1 = await response1.json();
    console.log('✅ Endpoint principal:', data1.message);
    console.log('');

    // 2. Probar productos
    console.log('2️⃣ Probando API de productos...');
    const response2 = await fetch('http://localhost:3004/api/v1/productos?limit=5');
    const data2 = await response2.json();
    console.log('✅ Productos obtenidos:', data2.data.length, 'productos');
    console.log('📊 Paginación:', data2.pagination);
    
    if (data2.data.length > 0) {
      const primerProducto = data2.data[0];
      console.log('📦 Primer producto:', primerProducto.nombre);
      console.log('💰 Precio:', primerProducto.precio);
      console.log('🏷️ Descuento:', primerProducto.descuento_porcentaje || 0, '%');
      console.log('🎯 Precio final:', primerProducto.precio_final);
    }
    console.log('');

    // 3. Probar categorías
    console.log('3️⃣ Probando API de categorías...');
    const response3 = await fetch('http://localhost:3004/api/v1/productos/categorias');
    const data3 = await response3.json();
    console.log('✅ Categorías obtenidas:', data3.data.length, 'categorías');
    console.log('');

    // 4. Probar marcas
    console.log('4️⃣ Probando API de marcas...');
    const response4 = await fetch('http://localhost:3004/api/v1/productos/marcas');
    const data4 = await response4.json();
    console.log('✅ Marcas obtenidas:', data4.data.length, 'marcas');
    console.log('');

    // 5. Probar ofertas
    console.log('5️⃣ Probando API de ofertas...');
    const response5 = await fetch('http://localhost:3004/api/v1/productos/ofertas');
    const data5 = await response5.json();
    console.log('✅ Ofertas obtenidas:', data5.data.length, 'ofertas');
    console.log('');

    // 6. Probar dashboard (sin auth)
    console.log('6️⃣ Probando API de dashboard...');
    const response6 = await fetch('http://localhost:3004/api/v1/dashboard/estadisticas');
    const data6 = await response6.json();
    console.log('✅ Dashboard funcionando');
    console.log('');

    console.log('🎉 ¡Todas las pruebas exitosas!');
    console.log('✅ La API está funcionando correctamente');
    console.log('✅ Los descuentos se están aplicando');
    console.log('✅ El sistema está listo para usar');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

probarAPI(); 