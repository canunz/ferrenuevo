const { Producto } = require('./src/models');

async function verificarImagenesFrontend() {
  try {
    console.log('🔍 Verificando imágenes en el frontend...');
    
    // Obtener todos los productos
    const productos = await Producto.findAll({
      include: [
        { model: require('./src/models').Categoria, as: 'categoria', required: false },
        { model: require('./src/models').Marca, as: 'marca', required: false }
      ]
    });
    
    console.log(`📦 Total de productos: ${productos.length}`);
    
    let conImagen = 0;
    let sinImagen = 0;
    let conPlaceholder = 0;
    
    console.log('\n📋 LISTADO DE PRODUCTOS CON SUS IMÁGENES:');
    console.log('='.repeat(80));
    
    productos.forEach((producto, index) => {
      const nombre = producto.nombre;
      const imagen = producto.imagen;
      const marca = producto.marca?.nombre || 'Sin marca';
      const categoria = producto.categoria?.nombre || 'Sin categoría';
      
      if (imagen && imagen !== 'placeholder.jpg') {
        console.log(`✅ ${index + 1}. ${nombre}`);
        console.log(`   📸 Imagen: ${imagen}`);
        console.log(`   🏷️  Marca: ${marca}`);
        console.log(`   📂 Categoría: ${categoria}`);
        console.log(`   🌐 URL: http://localhost:3003/public/imagenes/productos/${imagen}`);
        conImagen++;
      } else if (imagen === 'placeholder.jpg') {
        console.log(`⚠️  ${index + 1}. ${nombre}`);
        console.log(`   📸 Imagen: placeholder.jpg (necesita imagen real)`);
        console.log(`   🏷️  Marca: ${marca}`);
        console.log(`   📂 Categoría: ${categoria}`);
        conPlaceholder++;
      } else {
        console.log(`❌ ${index + 1}. ${nombre}`);
        console.log(`   📸 Imagen: Sin imagen`);
        console.log(`   🏷️  Marca: ${marca}`);
        console.log(`   📂 Categoría: ${categoria}`);
        sinImagen++;
      }
      console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('📊 RESUMEN:');
    console.log(`✅ Productos con imagen: ${conImagen}`);
    console.log(`⚠️  Productos con placeholder: ${conPlaceholder}`);
    console.log(`❌ Productos sin imagen: ${sinImagen}`);
    console.log(`📦 Total: ${productos.length}`);
    
    // Mostrar estadísticas por marca
    const estadisticasMarca = {};
    productos.forEach(producto => {
      const marca = producto.marca?.nombre || 'Sin marca';
      if (!estadisticasMarca[marca]) {
        estadisticasMarca[marca] = { total: 0, conImagen: 0, conPlaceholder: 0, sinImagen: 0 };
      }
      estadisticasMarca[marca].total++;
      
      if (producto.imagen && producto.imagen !== 'placeholder.jpg') {
        estadisticasMarca[marca].conImagen++;
      } else if (producto.imagen === 'placeholder.jpg') {
        estadisticasMarca[marca].conPlaceholder++;
      } else {
        estadisticasMarca[marca].sinImagen++;
      }
    });
    
    console.log('\n📈 ESTADÍSTICAS POR MARCA:');
    console.log('='.repeat(50));
    Object.entries(estadisticasMarca).forEach(([marca, stats]) => {
      console.log(`🏷️  ${marca}:`);
      console.log(`   📦 Total: ${stats.total}`);
      console.log(`   ✅ Con imagen: ${stats.conImagen}`);
      console.log(`   ⚠️  Con placeholder: ${stats.conPlaceholder}`);
      console.log(`   ❌ Sin imagen: ${stats.sinImagen}`);
      console.log('');
    });
    
    // Productos que necesitan atención
    const productosNecesitanAtencion = productos.filter(p => 
      !p.imagen || p.imagen === 'placeholder.jpg'
    );
    
    if (productosNecesitanAtencion.length > 0) {
      console.log('⚠️  PRODUCTOS QUE NECESITAN IMÁGENES:');
      console.log('='.repeat(50));
      productosNecesitanAtencion.forEach(p => {
        console.log(`   - ${p.nombre} (${p.marca?.nombre || 'Sin marca'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al verificar imágenes:', error);
  }
}

// Ejecutar el script
verificarImagenesFrontend()
  .then(() => {
    console.log('\n🎉 Verificación completada');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 