const mysql = require('mysql2/promise');

async function solucionarMarcasFaltantes() {
  let connection;
  
  try {
    // Configuración de la base de datos
    const config = {
      host: 'localhost',
      user: 'root',
      password: 'emma2004',
      database: 'ferremasnueva'
    };

    connection = await mysql.createConnection(config);
    console.log('✅ Conectado a la base de datos');

    // 1. Verificar marcas existentes
    console.log('\n📋 Marcas existentes:');
    const [marcasExistentes] = await connection.execute('SELECT id, nombre FROM marcas ORDER BY id');
    marcasExistentes.forEach(marca => {
      console.log(`  ID ${marca.id}: ${marca.nombre}`);
    });

    // 2. Agregar marcas faltantes
    console.log('\n➕ Agregando marcas faltantes...');
    const marcasFaltantes = [
      ['Bosch', 'Herramientas eléctricas profesionales alemanas'],
      ['Makita', 'Herramientas eléctricas japonesas de alta calidad'],
      ['Black+Decker', 'Herramientas para bricolaje y hogar'],
      ['Hyundai', 'Herramientas y equipos de construcción'],
      ['Genérica', 'Productos de marca genérica']
    ];

    for (const [nombre, descripcion] of marcasFaltantes) {
      try {
        await connection.execute(
          'INSERT INTO marcas (nombre, descripcion, activo, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
          [nombre, descripcion]
        );
        console.log(`  ✅ Agregada marca: ${nombre}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`  ⚠️  Marca ya existe: ${nombre}`);
        } else {
          console.log(`  ❌ Error agregando marca ${nombre}: ${error.message}`);
        }
      }
    }

    // 3. Verificar marcas después de la inserción
    console.log('\n📋 Marcas después de la inserción:');
    const [marcasFinales] = await connection.execute('SELECT id, nombre FROM marcas ORDER BY id');
    marcasFinales.forEach(marca => {
      console.log(`  ID ${marca.id}: ${marca.nombre}`);
    });

    // 4. Verificar productos que usan marcas inexistentes
    console.log('\n🔍 Verificando productos con marcas inexistentes...');
    const [productosConMarcasInvalidas] = await connection.execute(`
      SELECT p.id, p.nombre, p.marca_id, m.nombre as marca_nombre
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      WHERE m.id IS NULL
    `);

    if (productosConMarcasInvalidas.length > 0) {
      console.log('  ❌ Productos con marcas inexistentes:');
      productosConMarcasInvalidas.forEach(producto => {
        console.log(`    Producto: ${producto.nombre} (ID: ${producto.id}) - Marca ID: ${producto.marca_id}`);
      });
    } else {
      console.log('  ✅ Todos los productos tienen marcas válidas');
    }

    console.log('\n✅ Proceso completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
solucionarMarcasFaltantes(); 