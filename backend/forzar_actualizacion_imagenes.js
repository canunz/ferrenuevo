const { Producto } = require('./src/models');

async function forzarPlaceholderEnTodos() {
  const productos = await Producto.findAll();
  let actualizados = 0;
  for (const producto of productos) {
    producto.imagen = 'placeholder.jpg';
    await producto.save();
    actualizados++;
  }
  console.log(`Todos los productos actualizados a placeholder.jpg (${actualizados})`);
}

forzarPlaceholderEnTodos().then(() => process.exit(0)); 