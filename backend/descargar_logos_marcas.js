const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const logos = [
  {
    nombre: 'bosch_logo.png',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/1/1a/Bosch-logo.png',
      'https://1000marcas.net/wp-content/uploads/2020/01/Bosch-Logo.png'
    ]
  },
  {
    nombre: 'dewalt_logo.png',
    urls: [
      'https://seeklogo.com/images/D/dewalt-logo-7B6B2B2C2C-seeklogo.com.png',
      'https://vectorseek.com/wp-content/uploads/2023/08/DeWalt-Logo-Vector.svg_.png'
    ]
  },
  {
    nombre: 'makita_logo.png',
    urls: [
      'https://seeklogo.com/images/M/makita-logo-6B6B2B2C2C-seeklogo.com.png',
      'https://vectorseek.com/wp-content/uploads/2023/08/Makita-Logo-Vector.svg_.png'
    ]
  },
  {
    nombre: 'stanley_logo.png',
    urls: [
      'https://seeklogo.com/images/S/stanley-logo-7B6B2B2C2C-seeklogo.com.png',
      'https://vectorseek.com/wp-content/uploads/2023/08/Stanley-Logo-Vector.svg_.png'
    ]
  },
  {
    nombre: 'black_decker_logo.png',
    urls: [
      'https://seeklogo.com/images/B/black-decker-logo-7B6B2B2C2C-seeklogo.com.png',
      'https://vectorseek.com/wp-content/uploads/2023/08/Black-Decker-Logo-Vector.svg_.png'
    ]
  }
];

const CARPETA = path.join(__dirname, 'public', 'imagenes', 'productos');

async function descargarLogo(logo) {
  for (const url of logo.urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
      });
      if (!res.ok) throw new Error(`No se pudo descargar ${url}`);
      const ruta = path.join(CARPETA, logo.nombre);
      const dest = fs.createWriteStream(ruta);
      await new Promise((resolve, reject) => {
        res.body.pipe(dest);
        res.body.on('error', reject);
        dest.on('finish', resolve);
      });
      console.log(`✅ Logo descargado: ${logo.nombre}`);
      return true;
    } catch (e) {
      console.log(`❌ Falló con ${url}, intento siguiente...`);
    }
  }
  console.log(`❌ No se pudo descargar el logo: ${logo.nombre}`);
  return false;
}

async function main() {
  for (const logo of logos) {
    await descargarLogo(logo);
  }
  console.log('Intento de descarga de todos los logos finalizado.');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); 