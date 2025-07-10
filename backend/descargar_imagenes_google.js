const { Producto, Categoria, Marca } = require('./src/models');
const axios = require('axios');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_KEY = 'AIzaSyD3mg8a6JUxkoYZxio3FYpSXaEnVJRTE7U';
const CX = '440f59995dbe24cf8';

const CARPETA_IMAGENES = path.join(__dirname, 'public', 'imagenes', 'productos');

async function buscarImagenGoogle(query) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&key=${API_KEY}&searchType=image&num=1`;
  try {
    const resp = await axios.get(url);
    if (resp.data.items && resp.data.items.length > 0) {
      return resp.data.items[0].link;
    }
    return null;
  } catch (error) {
    console.error(`❌ Error buscando imagen para "${query}":`, error.response?.data?.error?.message || error.message);
    return null;
  }
}

async function descargarImagen(url, nombreArchivo) {
  const rutaDestino = path.join(CARPETA_IMAGENES, nombreArchivo);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const dest = fs.createWriteStream(rutaDestino);
    await new Promise((resolve, reject) => {
      res.body.pipe(dest);
      res.body.on('error', reject);
      dest.on('finish', resolve);
    });
    return true;
  } catch (error) {
    console.error(`❌ Error descargando imagen: ${url}`, error.message);
    return false;
  }
}

async function main() {
  // Incluyo marca y categoría en la consulta
  const productos = await Producto.findAll({
    where: { imagen: 'placeholder.jpg' },
    include: [
      { model: Categoria, as: 'categoria', required: false },
      { model: Marca, as: 'marca', required: false }
    ]
  });
  console.log(`🔍 Buscando imágenes para ${productos.length} productos sin foto...`);
  let descargadas = 0;
  for (const producto of productos) {
    const nombre = producto.nombre;
    const marca = producto.marca?.nombre || '';
    const categoria = producto.categoria?.nombre || '';
    // Construyo la consulta más precisa
    const query = `${nombre} ${marca} ${categoria} producto`;
    console.log(`\n🔎 Buscando imagen para: ${query}`);
    const urlImagen = await buscarImagenGoogle(query);
    if (!urlImagen) {
      console.log(`⚠️  No se encontró imagen para: ${query}`);
      continue;
    }
    // Nombre de archivo seguro
    const nombreArchivo = nombre.toLowerCase().replace(/[^a-z0-9]/gi, '_').substring(0, 40) + '.jpg';
    const exito = await descargarImagen(urlImagen, nombreArchivo);
    if (exito) {
      producto.imagen = nombreArchivo;
      await producto.save();
      console.log(`✅ Imagen descargada y asignada: ${nombreArchivo}`);
      descargadas++;
    } else {
      console.log(`❌ Falló la descarga para: ${nombre}`);
    }
  }
  console.log(`\n🎉 Proceso terminado. Imágenes descargadas: ${descargadas}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 