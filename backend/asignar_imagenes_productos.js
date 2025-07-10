const { Producto } = require('./src/models');
const fs = require('fs');
const path = require('path');

// Mapeo de nombres de productos a imágenes disponibles
const mapeoImagenes = {
  // Taladros
  'taladro': 'taladro_percutor_black_decker.jpg',
  'taladro percutor': 'taladro_percutor_black_decker.jpg',
  'taladro eléctrico': 'taladro_electrico_dewalt_20v.jpg',
  'taladro dewalt': 'taladro_electrico_dewalt_20v.jpg',
  
  // Sierra circular
  'sierra circular': 'sierra_circular_bosch_725.jpg',
  'sierra': 'sierra_circular_bosch_725.jpg',
  'sierra bosch': 'sierra_circular_bosch_725.jpg',
  
  // Set destornilladores
  'destornillador': 'set_destornilladores_dewalt.jpg',
  'set destornilladores': 'set_destornilladores_dewalt.jpg',
  'destornilladores': 'set_destornilladores_dewalt.jpg',
  
  // Martillo
  'martillo': 'martillo_stanley_16oz.jpg',
  'martillo stanley': 'martillo_stanley_16oz.jpg',
  
  // Llave inglesa
  'llave': 'llave_inglesa_ajustable_12.jpg',
  'llave inglesa': 'llave_inglesa_ajustable_12.jpg',
  'llave ajustable': 'llave_inglesa_ajustable_12.jpg',
  
  // Lijadora
  'lijadora': 'lijadora_orbital_makita.jpg',
  'lijadora orbital': 'lijadora_orbital_makita.jpg',
  'lijadora makita': 'lijadora_orbital_makita.jpg'
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

async function asignarImagenesProductos() {
  try {
    console.log('🔍 Buscando productos sin imágenes...');
    
    // Obtener todos los productos
    const productos = await Producto.findAll();
    
    console.log(`📦 Encontrados ${productos.length} productos`);
    
    let actualizados = 0;
    let sinCambios = 0;
    
    for (const producto of productos) {
      const nombreProducto = producto.nombre;
      const imagenActual = producto.imagen;
      
      // Si ya tiene imagen, verificar si existe
      if (imagenActual && imagenActual !== 'placeholder.jpg') {
        if (imagenExiste(imagenActual)) {
          console.log(`✅ ${nombreProducto} - Ya tiene imagen válida: ${imagenActual}`);
          sinCambios++;
          continue;
        } else {
          console.log(`⚠️  ${nombreProducto} - Imagen no encontrada: ${imagenActual}`);
        }
      }
      
      // Buscar imagen apropiada
      const imagenApropiada = encontrarImagenProducto(nombreProducto);
      
      // Verificar si la imagen existe
      if (!imagenExiste(imagenApropiada)) {
        console.log(`❌ ${nombreProducto} - Imagen no encontrada: ${imagenApropiada}, usando placeholder`);
        producto.imagen = 'placeholder.jpg';
      } else {
        console.log(`🔄 ${nombreProducto} - Asignando imagen: ${imagenApropiada}`);
        producto.imagen = imagenApropiada;
      }
      
      // Guardar cambios
      await producto.save();
      actualizados++;
    }
    
    console.log('\n📊 RESUMEN:');
    console.log(`✅ Productos actualizados: ${actualizados}`);
    console.log(`⏭️  Productos sin cambios: ${sinCambios}`);
    console.log(`📦 Total de productos: ${productos.length}`);
    
    // Mostrar productos que quedaron con placeholder
    const productosConPlaceholder = productos.filter(p => p.imagen === 'placeholder.jpg');
    if (productosConPlaceholder.length > 0) {
      console.log('\n⚠️  Productos que necesitan imágenes manuales:');
      productosConPlaceholder.forEach(p => {
        console.log(`   - ${p.nombre}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error al asignar imágenes:', error);
  }
}

// Ejecutar el script
asignarImagenesProductos()
  .then(() => {
    console.log('\n🎉 Proceso completado');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  }); 