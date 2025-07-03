const http = require('http');

// Función para verificar si una URL de imagen existe
function verificarImagen(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type']
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        error: 'Timeout después de 5 segundos'
      });
    });
  });
}

// Lista de imágenes para verificar
const imagenes = [
  'sierra_circular_bosch_725.jpg',
  'taladro_electrico_dewalt_20v.jpg',
  'martillo_stanley_16oz.jpg',
  'placeholder.jpg'
];

async function verificarImagenes() {
  console.log('🔍 Verificando imágenes del backend...\n');
  
  for (const imagen of imagenes) {
    const url = `http://localhost:3003/public/imagenes/productos/${imagen}`;
    const resultado = await verificarImagen(url);
    
    if (resultado.status === 200) {
      console.log(`✅ ${imagen} - OK (${resultado.contentType})`);
    } else {
      console.log(`❌ ${imagen} - ERROR: ${resultado.status} ${resultado.error || ''}`);
    }
  }
  
  console.log('\n🔍 Verificando imágenes del frontend...\n');
  
  for (const imagen of imagenes) {
    const url = `http://localhost:3001/assets/imagenes/productos/${imagen}`;
    const resultado = await verificarImagen(url);
    
    if (resultado.status === 200) {
      console.log(`✅ ${imagen} - OK (${resultado.contentType})`);
    } else {
      console.log(`❌ ${imagen} - ERROR: ${resultado.status} ${resultado.error || ''}`);
    }
  }
}

verificarImagenes().catch(console.error); 