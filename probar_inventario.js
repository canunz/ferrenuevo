const fetch = require('node-fetch');

async function probarInventario() {
  try {
    console.log('🧪 Probando API de inventario...\n');
    
      console.log('📡 Haciendo petición a: http://localhost:3003/api/v1/inventario/productos-completos');
  const response = await fetch('http://localhost:3003/api/v1/inventario/productos-completos');
    
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', response.headers.get('content-type'));
    
    const data = await response.json();
    console.log('📊 Respuesta completa recibida:', JSON.stringify(data, null, 2));
    
    if (!data.datos || !Array.isArray(data.datos) || data.datos.length === 0) {
      console.log('❌ No se recibieron productos o la respuesta no es la esperada.');
      return;
    }
    
    console.log('✅ Respuesta recibida:');
    console.log('📊 Total productos:', data.datos.length);
    console.log('📈 Estadísticas:', data.meta?.estadisticas || 'No disponible');
    
    if (data.datos && data.datos.length > 0) {
      console.log('\n📦 Primeros 3 productos:');
      data.datos.slice(0, 3).forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre}`);
        console.log(`   SKU: ${producto.codigo_sku}`);
        console.log(`   Stock: ${producto.stock_total}`);
        console.log(`   Precio: $${producto.precio_final}`);
        console.log(`   Descuento: ${producto.tiene_promocion ? producto.descuento_porcentaje + '%' : 'Sin descuento'}`);
        console.log('');
      });
    }
    
    console.log('🎉 ¡Prueba completada!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
  }
}

probarInventario(); 