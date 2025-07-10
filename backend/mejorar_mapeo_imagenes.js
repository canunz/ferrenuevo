const { Producto } = require('./src/models');
const fs = require('fs');
const path = require('path');

// Mapeo mejorado de nombres de productos a imágenes disponibles
const mapeoImagenes = {
  // Taladros
  'taladro': 'taladro_percutor_black_decker.jpg',
  'taladro percutor': 'taladro_percutor_black_decker.jpg',
  'taladro eléctrico': 'taladro_electrico_dewalt_20v.jpg',
  'taladro dewalt': 'taladro_electrico_dewalt_20v.jpg',
  'black decker': 'taladro_percutor_black_decker.jpg',
  'black & decker': 'taladro_percutor_black_decker.jpg',
  
  // Sierra circular
  'sierra circular': 'sierra_circular_bosch_725.jpg',
  'sierra': 'sierra_circular_bosch_725.jpg',
  'sierra bosch': 'sierra_circular_bosch_725.jpg',
  'bosch': 'sierra_circular_bosch_725.jpg',
  
  // Set destornilladores
  'destornillador': 'set_destornilladores_dewalt.jpg',
  'set destornilladores': 'set_destornilladores_dewalt.jpg',
  'destornilladores': 'set_destornilladores_dewalt.jpg',
  'atornillador': 'set_destornilladores_dewalt.jpg',
  'dewalt': 'set_destornilladores_dewalt.jpg',
  
  // Martillo
  'martillo': 'martillo_stanley_16oz.jpg',
  'martillo stanley': 'martillo_stanley_16oz.jpg',
  'stanley': 'martillo_stanley_16oz.jpg',
  
  // Llave inglesa
  'llave': 'llave_inglesa_ajustable_12.jpg',
  'llave inglesa': 'llave_inglesa_ajustable_12.jpg',
  'llave ajustable': 'llave_inglesa_ajustable_12.jpg',
  
  // Lijadora
  'lijadora': 'lijadora_orbital_makita.jpg',
  'lijadora orbital': 'lijadora_orbital_makita.jpg',
  'lijadora makita': 'lijadora_orbital_makita.jpg',
  'makita': 'lijadora_orbital_makita.jpg'
};

// Función para encontrar la imagen más apropiada según el nombre del producto
function encontrarImagenProducto(nombreProducto) {
  const nombreLower = nombreProducto.toLowerCase();
  
  // Buscar coincidencias exactas primero
  for (const [palabraClave, imagen] of Object.entries(mapeoImagenes)) {
    if (nombreLower.includes(palabraClave)) {
      return imagen;
    }
  }
  
  // Si no encuentra coincidencia, usar placeholder
  return 'placeholder.jpg';
}

// Función para verificar si una imagen existe
function imagenExiste(nombreImagen) {
  const rutaImagen = path.join(__dirname, 'public', 'imagenes', 'productos', nombreImagen);
  return fs.existsSync(rutaImagen);
}

async function mejorarMapeoImagenes() {
  try {
    console.log('🔍 Mejorando mapeo de imágenes...');
    
    // Obtener productos que tienen placeholder
    const productos = await Producto.findAll({
      where: {
        imagen: 'placeholder.jpg'
      }
    });
    
    console.log(`📦 Encontrados ${productos.length} productos con placeholder`);
    
    let actualizados = 0;
    
    for (const producto of productos) {
      const nombreProducto = producto.nombre;
      
      // Buscar imagen apropiada
      const imagenApropiada = encontrarImagenProducto(nombreProducto);
      
      // Verificar si la imagen existe
      if (imagenApropiada !== 'placeholder.jpg' && imagenExiste(imagenApropiada)) {
        console.log(`🔄 ${nombreProducto} - Asignando imagen: ${imagenApropiada}`);
        producto.imagen = imagenApropiada;
        await producto.save();
        actualizados++;
      } else {
        console.log(`⏭️  ${nombreProducto} - Sin imagen apropiada disponible`);
      }
    }
    
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Productos actualizados: ${actualizados}`);
    console.log(`📦 Total procesados: ${productos.length}`);
    
    // Mostrar productos que aún necesitan imágenes
    const productosRestantes = await Producto.findAll({
      where: {
        imagen: 'placeholder.jpg'
      }
    });
    
    if (productosRestantes.length > 0) {
      console.log('\n⚠️  Productos que aún necesitan imágenes manuales:');
      productosRestantes.forEach(p => {
        console.log(`   - ${p.nombre}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al mejorar mapeo:', error);
  }
}

// Ejecutar el script
mejorarMapeoImagenes()
  .then(() => {
    console.log('\n🎉 Proceso completado');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 