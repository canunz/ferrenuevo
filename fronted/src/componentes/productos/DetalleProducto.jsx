import React from 'react';

const DetalleProducto = ({ producto }) => {
  if (!producto) return <div>No se encontró el producto.</div>;

  // Calcular el stock total sumando todos los inventarios
  let stockTotal = 0;
  if (Array.isArray(producto.inventario) && producto.inventario.length > 0) {
    stockTotal = producto.inventario.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
  } else if (typeof producto.stock_actual === 'number') {
    stockTotal = producto.stock_actual;
  }

  if (stockTotal === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-red-600">Artículo no disponible</h2>
        <p className="text-gray-600 mb-4">Este producto está agotado actualmente.</p>
        <div className="flex flex-col items-center gap-2">
          <img
            src={`/assets/imagenes/productos/${producto.imagen}`}
            alt={producto.nombre}
            className="w-48 h-48 object-contain rounded-lg border mb-4"
            onError={e => e.target.src = '/assets/imagenes/productos/Sierrabosch.jpg'}
          />
          <div className="text-gray-500">{producto.nombre}</div>
          <div className="text-gray-400 text-sm">SKU: {producto.codigo_sku ?? 'No asignado'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Imagen grande */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <img
            src={`/assets/imagenes/productos/${producto.imagen}`}
            alt={producto.nombre}
            className="w-72 h-72 object-contain rounded-lg border"
            onError={e => e.target.src = '/assets/imagenes/productos/Sierrabosch.jpg'}
          />
        </div>
        {/* Info */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{producto.nombre}</h2>
          <p className="text-gray-600 mb-4">{producto.descripcion}</p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-blue-700">
              {producto.precio ? `$${Number(producto.precio).toLocaleString('es-CL')}` : 'Sin precio'}
            </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Stock:</span> {stockTotal}
          </div>
          <div className="mb-2">
            <span className="font-semibold">SKU:</span> {producto.codigo_sku ?? 'No asignado'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Marca:</span> {producto.marca?.nombre ?? 'Sin marca'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Categoría:</span> {producto.categoria?.nombre ?? 'Sin categoría'}
          </div>
          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
