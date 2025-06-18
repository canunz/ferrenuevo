const sequelize = require('../config/database');

// Importar todos los modelos
const Usuario = require('./Usuario');
const Rol = require('./Rol');
const Categoria = require('./Categoria');
const Marca = require('./Marca');
const Producto = require('./Producto');
const Pedido = require('./Pedido');
const DetallePedido = require('./DetallePedido');
const MetodoPago = require('./MetodoPago');
const Pago = require('./Pago');
const Inventario = require('./Inventario');
const Divisa = require('./Divisa');
const HistorialPrecio = require('./HistorialPrecio');
const DireccionEnvio = require('./DireccionEnvio');
const HistorialCompras = require('./HistorialCompras');
const PreferenciasCliente = require('./PreferenciasCliente');
const SegmentacionClientes = require('./SegmentacionClientes');
const ComunicacionesCliente = require('./ComunicacionesCliente');

// DEFINIR TODAS LAS ASOCIACIONES CORRECTAMENTE
console.log('🔗 Configurando asociaciones de modelos...');

// Usuario - Rol (Muchos a Uno)
Usuario.belongsTo(Rol, { 
  foreignKey: 'rol_id', 
  as: 'rol' 
});
Rol.hasMany(Usuario, { 
  foreignKey: 'rol_id', 
  as: 'usuarios' 
});

// Producto - Categoria (Muchos a Uno)
Producto.belongsTo(Categoria, { 
  foreignKey: 'categoria_id', 
  as: 'categoria' 
});
Categoria.hasMany(Producto, { 
  foreignKey: 'categoria_id', 
  as: 'productos' 
});

// Producto - Marca (Muchos a Uno)
Producto.belongsTo(Marca, { 
  foreignKey: 'marca_id', 
  as: 'marca' 
});
Marca.hasMany(Producto, { 
  foreignKey: 'marca_id', 
  as: 'productos' 
});

// Pedido - Usuario (Muchos a Uno)
Pedido.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});
Usuario.hasMany(Pedido, { 
  foreignKey: 'usuario_id', 
  as: 'pedidos' 
});

// DetallePedido - Pedido (Muchos a Uno)
DetallePedido.belongsTo(Pedido, { 
  foreignKey: 'pedido_id', 
  as: 'pedido' 
});
Pedido.hasMany(DetallePedido, { 
  foreignKey: 'pedido_id', 
  as: 'detalles' 
});

// DetallePedido - Producto (Muchos a Uno)
DetallePedido.belongsTo(Producto, { 
  foreignKey: 'producto_id', 
  as: 'producto' 
});
Producto.hasMany(DetallePedido, { 
  foreignKey: 'producto_id', 
  as: 'detalles_pedido' 
});

// Pago - Pedido (Uno a Uno)
Pago.belongsTo(Pedido, { 
  foreignKey: 'pedido_id', 
  as: 'pedido' 
});
Pedido.hasOne(Pago, { 
  foreignKey: 'pedido_id', 
  as: 'pago' 
});

// Pago - MetodoPago (Muchos a Uno)
Pago.belongsTo(MetodoPago, { 
  foreignKey: 'metodo_pago_id', 
  as: 'metodo_pago' 
});
MetodoPago.hasMany(Pago, { 
  foreignKey: 'metodo_pago_id', 
  as: 'pagos' 
});

// Inventario - Producto (Muchos a Uno)
Inventario.belongsTo(Producto, { 
  foreignKey: 'producto_id', 
  as: 'producto' 
});
Producto.hasMany(Inventario, { 
  foreignKey: 'producto_id', 
  as: 'inventarios' 
});

// HistorialPrecio - Producto (Muchos a Uno)
HistorialPrecio.belongsTo(Producto, { 
  foreignKey: 'producto_id', 
  as: 'producto' 
});
Producto.hasMany(HistorialPrecio, { 
  foreignKey: 'producto_id', 
  as: 'historial_precios' 
});

// HistorialPrecio - Divisa (Muchos a Uno)
HistorialPrecio.belongsTo(Divisa, { 
  foreignKey: 'divisa_id', 
  as: 'divisa' 
});
Divisa.hasMany(HistorialPrecio, { 
  foreignKey: 'divisa_id', 
  as: 'historial_precios' 
});


// Usuario - DireccionEnvio (Uno a Muchos)
Usuario.hasMany(DireccionEnvio, { 
  foreignKey: 'usuario_id', 
  as: 'direcciones' 
});
DireccionEnvio.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// Usuario - HistorialCompras (Uno a Muchos)
Usuario.hasMany(HistorialCompras, { 
  foreignKey: 'usuario_id', 
  as: 'historial_compras' 
});
HistorialCompras.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// HistorialCompras - Pedido (Muchos a Uno)
HistorialCompras.belongsTo(Pedido, { 
  foreignKey: 'pedido_id', 
  as: 'pedido' 
});
Pedido.hasOne(HistorialCompras, { 
  foreignKey: 'pedido_id', 
  as: 'historial' 
});

// Usuario - PreferenciasCliente (Uno a Uno)
Usuario.hasOne(PreferenciasCliente, { 
  foreignKey: 'usuario_id', 
  as: 'preferencias' 
});
PreferenciasCliente.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// PreferenciasCliente - Categoria (Muchos a Uno)
PreferenciasCliente.belongsTo(Categoria, { 
  foreignKey: 'categoria_preferida_id', 
  as: 'categoria_preferida' 
});

// PreferenciasCliente - Marca (Muchos a Uno)
PreferenciasCliente.belongsTo(Marca, { 
  foreignKey: 'marca_preferida_id', 
  as: 'marca_preferida' 
});

// Usuario - ComunicacionesCliente (Uno a Muchos)
Usuario.hasMany(ComunicacionesCliente, { 
  foreignKey: 'usuario_id', 
  as: 'comunicaciones' 
});
ComunicacionesCliente.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

// Usuario - Segmentación (Muchos a Muchos)
Usuario.belongsToMany(SegmentacionClientes, { 
  through: 'usuario_segmentos',
  foreignKey: 'usuario_id',
  otherKey: 'segmento_id',
  as: 'segmentos' 
});
SegmentacionClientes.belongsToMany(Usuario, { 
  through: 'usuario_segmentos',
  foreignKey: 'segmento_id',
  otherKey: 'usuario_id',
  as: 'usuarios' 
});

console.log('✅ Asociaciones de modelos configuradas correctamente');

// Exportar todos los modelos y sequelize
module.exports = {
  sequelize,
  Usuario,
  Rol,
  Categoria,
  Marca,
  Producto,
  Pedido,
  DetallePedido,
  MetodoPago,
  Pago,
  Inventario,
  Divisa,
  HistorialPrecio,
  DireccionEnvio,
  HistorialCompras,
  PreferenciasCliente,
  SegmentacionClientes,
  ComunicacionesCliente
};