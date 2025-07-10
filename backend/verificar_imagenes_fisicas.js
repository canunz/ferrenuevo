const { Producto } = require('./src/models');
const fs = require('fs');
const path = require('path');

const CARPETA_IMAGENES = path.join(__dirname, 'public', 'imagenes', 'productos');

async function verificarImagenesFisicas() {
  const productos = await Producto.findAll();
  let sinImagen = [];
  let reparados = 0;
  for (const producto of productos) {
    const nombreImagen = producto.imagen;
    if (!nombreImagen || nombreImagen === 'placeholder.jpg') continue;
    const ruta = path.join(CARPETA_IMAGENES, nombreImagen);
    if (!fs.existsSync(ruta) || fs.statSync(ruta).size < 1000) {
      sinImagen.push({ nombre: producto.nombre, imagen: nombreImagen });
      producto.imagen = 'placeholder.jpg';
      await producto.save();
      reparados++;
    }
  }
  console.log(`\nProductos con imagen rota o faltante: ${sinImagen.length}`);
  sinImagen.forEach(p => console.log(`- ${p.nombre} (imagen: ${p.imagen})`));
  console.log(`\nProductos reparados (asignado placeholder): ${reparados}`);
}

verificarImagenesFisicas().then(() => process.exit(0)); 