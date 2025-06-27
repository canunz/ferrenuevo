exports.obtenerEstadisticas = (req, res) => {
  res.json({
    ventasTotales: 12345,
    clientesTotales: 234,
    productosTotales: 56
  });
};

exports.obtenerVentasRecientes = (req, res) => {
  res.json([
    { id: 1, cliente: "Juan", total: 10000, fecha: "2024-04-01" },
    { id: 2, cliente: "Ana", total: 15000, fecha: "2024-04-02" }
  ]);
};

exports.obtenerProductosPopulares = (req, res) => {
  res.json([
    { id: 1, nombre: "Taladro", vendidos: 50 },
    { id: 2, nombre: "Martillo", vendidos: 40 }
  ]);
};

exports.obtenerAlertas = (req, res) => {
  res.json([
    { tipo: "stock", mensaje: "Producto X bajo en stock" },
    { tipo: "pago", mensaje: "Pago pendiente de cliente Y" }
  ]);
}; 