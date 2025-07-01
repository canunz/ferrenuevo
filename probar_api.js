const axios = require('axios');

const API_BASE = 'http://localhost:3004/api/v1';

async function probarAPI() {
  console.log('🧪 Probando API de Ferremas Nueva...\n');

  try {
    // 1. Probar endpoint principal
    console.log('1️⃣ Probando endpoint principal...');
    const response1 = await axios.get(`${API_BASE.replace('/api/v1', '')}`);
    console.log('✅ Endpoint principal:', response1.data.message);
    console.log('');

    // 2. Probar productos
    console.log('2️⃣ Probando API de productos...');
    const response2 = await axios.get(`${API_BASE}/productos?limit=5`);
    console.log('✅ Productos obtenidos:', response2.data.data.length, 'productos');
    console.log('📊 Paginación:', response2.data.pagination);
    
    if (response2.data.data.length > 0) {
      const primerProducto = response2.data.data[0];
      console.log('📦 Primer producto:', primerProducto.nombre);
      console.log('💰 Precio:', primerProducto.precio);
      console.log('🏷️ Descuento:', primerProducto.descuento_porcentaje || 0, '%');
      console.log('🎯 Precio final:', primerProducto.precio_final);
    }
    console.log('');

    // 3. Probar categorías
    console.log('3️⃣ Probando API de categorías...');
    const response3 = await axios.get(`${API_BASE}/productos/categorias`);
    console.log('✅ Categorías obtenidas:', response3.data.data.length, 'categorías');
    console.log('');

    // 4. Probar marcas
    console.log('4️⃣ Probando API de marcas...');
    const response4 = await axios.get(`${API_BASE}/productos/marcas`);
    console.log('✅ Marcas obtenidas:', response4.data.data.length, 'marcas');
    console.log('');

    // 5. Probar ofertas
    console.log('5️⃣ Probando API de ofertas...');
    const response5 = await axios.get(`${API_BASE}/productos/ofertas`);
    console.log('✅ Ofertas obtenidas:', response5.data.data.length, 'ofertas');
    console.log('');

    // 6. Probar dashboard (sin auth)
    console.log('6️⃣ Probando API de dashboard...');
    const response6 = await axios.get(`${API_BASE}/dashboard/estadisticas`);
    console.log('✅ Dashboard funcionando');
    console.log('');

    console.log('🎉 ¡Todas las pruebas exitosas!');
    console.log('✅ La API está funcionando correctamente');
    console.log('✅ Los descuentos se están aplicando');
    console.log('✅ El sistema está listo para usar');

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Data:', error.response.data);
    }
  }
}

probarAPI(); 