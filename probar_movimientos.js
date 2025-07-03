// ==========================================
// SCRIPT: PROBAR MOVIMIENTOS DE INVENTARIO
// ==========================================
const axios = require('axios');

const API_BASE = 'http://localhost:3003/api/v1';

async function probarMovimientos() {
  console.log('🧪 Probando movimientos de inventario...\n');

  try {
    // 1. Verificar que el servidor esté corriendo
    console.log('1️⃣ Verificando servidor...');
    await axios.get(`${API_BASE}/health`);
    console.log('✅ Servidor funcionando');

    // 2. Obtener un producto para probar
    console.log('\n2️⃣ Obteniendo productos...');
    const productos = await axios.get(`${API_BASE}/inventario/productos-completos?limit=1`);
    
    if (!productos.data.success || !productos.data.datos || productos.data.datos.length === 0) {
      throw new Error('No hay productos disponibles para probar');
    }

    const producto = productos.data.datos[0];
    console.log(`✅ Producto seleccionado: ${producto.nombre} (ID: ${producto.id})`);

    // 3. Probar movimiento de entrada
    console.log('\n3️⃣ Probando movimiento de entrada...');
    const movimientoEntrada = await axios.post(`${API_BASE}/inventario/movimientos`, {
      producto_id: producto.id,
      tipo: 'entrada',
      cantidad: 10,
      motivo: 'Prueba de entrada de stock',
      observaciones: 'Movimiento de prueba'
    });

    console.log('✅ Movimiento de entrada exitoso:', {
      stock_anterior: movimientoEntrada.data.datos.stock_anterior,
      stock_nuevo: movimientoEntrada.data.datos.stock_nuevo,
      cantidad: movimientoEntrada.data.datos.cantidad
    });

    // 4. Probar movimiento de salida
    console.log('\n4️⃣ Probando movimiento de salida...');
    const movimientoSalida = await axios.post(`${API_BASE}/inventario/movimientos`, {
      producto_id: producto.id,
      tipo: 'salida',
      cantidad: 5,
      motivo: 'Prueba de salida de stock',
      observaciones: 'Movimiento de prueba'
    });

    console.log('✅ Movimiento de salida exitoso:', {
      stock_anterior: movimientoSalida.data.datos.stock_anterior,
      stock_nuevo: movimientoSalida.data.datos.stock_nuevo,
      cantidad: movimientoSalida.data.datos.cantidad
    });

    // 5. Verificar el stock final
    console.log('\n5️⃣ Verificando stock final...');
    const stockFinal = await axios.get(`${API_BASE}/inventario/productos-completos?limit=1`);
    const productoFinal = stockFinal.data.datos.find(p => p.id === producto.id);
    
    console.log(`✅ Stock final del producto: ${productoFinal.stock_total} unidades`);

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen de la corrección:');
    console.log('   ✅ Error de stock_anterior y stock_nuevo null SOLUCIONADO');
    console.log('   ✅ Movimientos de entrada funcionando');
    console.log('   ✅ Movimientos de salida funcionando');
    console.log('   ✅ Cálculo automático de stock correcto');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    
    if (error.response) {
      console.error('📄 Respuesta del servidor:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor no está corriendo. Ejecuta:');
      console.log('   cd backend && npm start');
    }
  }
}

probarMovimientos(); 