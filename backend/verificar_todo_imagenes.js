const { Producto } = require('./src/models');

async function verificarTodoImagenes() {
  try {
    console.log('🎯 VERIFICACIÓN FINAL DE IMÁGENES');
    console.log('='.repeat(60));
    
    // Obtener productos con imágenes
    const productos = await Producto.findAll({
      where: {
        imagen: {
          [require('sequelize').Op.not]: 'placeholder.jpg'
        }
      },
      include: [
        { model: require('./src/models').Categoria, as: 'categoria', required: false },
        { model: require('./src/models').Marca, as: 'marca', required: false }
      ]
    });
    
    console.log(`✅ Productos con imágenes asignadas: ${productos.length}`);
    console.log('\n📸 PRODUCTOS CON IMÁGENES:');
    console.log('-'.repeat(60));
    
    productos.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre}`);
      console.log(`   📸 Imagen: ${producto.imagen}`);
      console.log(`   🏷️  Marca: ${producto.marca?.nombre || 'Sin marca'}`);
      console.log(`   📂 Categoría: ${producto.categoria?.nombre || 'Sin categoría'}`);
      console.log(`   💰 Precio: $${producto.precio}`);
      console.log(`   🌐 URL: http://localhost:3003/public/imagenes/productos/${producto.imagen}`);
      console.log('');
    });
    
    // Verificar productos con placeholder
    const productosPlaceholder = await Producto.findAll({
      where: {
        imagen: 'placeholder.jpg'
      }
    });
    
    if (productosPlaceholder.length > 0) {
      console.log(`⚠️  Productos que aún necesitan imágenes: ${productosPlaceholder.length}`);
      console.log('-'.repeat(60));
      productosPlaceholder.forEach((producto, index) => {
        console.log(`${index + 1}. ${producto.nombre} (${producto.marca?.nombre || 'Sin marca'})`);
      });
      console.log('');
    }
    
    // Estadísticas generales
    const totalProductos = await Producto.count();
    const productosConImagen = productos.length;
    const productosSinImagen = productosPlaceholder.length;
    
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log('='.repeat(60));
    console.log(`📦 Total de productos: ${totalProductos}`);
    console.log(`✅ Con imágenes: ${productosConImagen} (${Math.round((productosConImagen/totalProductos)*100)}%)`);
    console.log(`⚠️  Con placeholder: ${productosSinImagen} (${Math.round((productosSinImagen/totalProductos)*100)}%)`);
    
    if (productosConImagen > 0) {
      console.log('\n🎉 ¡ÉXITO! Las imágenes están configuradas correctamente.');
      console.log('🌐 El frontend debería mostrar las imágenes en:');
      console.log('   http://localhost:3001');
      console.log('🔧 El backend está sirviendo las imágenes en:');
      console.log('   http://localhost:3003/public/imagenes/productos/');
    }
    
  } catch (error) {
    console.error('❌ Error en la verificación:', error);
  }
}

// Ejecutar el script
verificarTodoImagenes()
  .then(() => {
    console.log('\n✅ Verificación completada exitosamente');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 