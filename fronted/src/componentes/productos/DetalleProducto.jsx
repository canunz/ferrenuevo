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
          {/* Ficha Técnica */}
          {producto.ficha_tecnica && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1 text-blue-800">Ficha Técnica</h3>
              <table className="w-full text-sm border mb-2">
                <tbody>
                  {producto.ficha_tecnica.dimensiones && (
                    <tr>
                      <td className="font-semibold pr-2">Dimensiones:</td>
                      <td>{producto.ficha_tecnica.dimensiones}</td>
                    </tr>
                  )}
                  {producto.ficha_tecnica.materiales && (
                    <tr>
                      <td className="font-semibold pr-2">Materiales:</td>
                      <td>{producto.ficha_tecnica.materiales}</td>
                    </tr>
                  )}
                  {producto.ficha_tecnica.caracteristicas && (
                    <tr>
                      <td className="font-semibold pr-2">Características:</td>
                      <td>{producto.ficha_tecnica.caracteristicas}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="mb-4">
            {producto.tiene_promocion && producto.promocion_activa ? (
              <>
                <span className="text-xl font-bold text-red-600 mr-2">
                  {producto.precio_final ? `$${Number(producto.precio_final).toLocaleString('es-CL')}` : ''}
                </span>
                <span className="line-through text-gray-400 mr-2">
                  {producto.precio_original ? `$${Number(producto.precio_original).toLocaleString('es-CL')}` : ''}
                </span>
                <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                  {producto.promocion_activa.tipo === 'porcentaje'
                    ? `-${producto.promocion_activa.porcentaje}% OFF`
                    : `-$${Number(producto.promocion_activa.monto).toLocaleString('es-CL')} OFF`}
                </span>
                <span className="text-xs text-gray-500">{producto.promocion_activa.vigencia}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-700">
                {producto.precio ? `$${Number(producto.precio).toLocaleString('es-CL')}` : 'Sin precio'}
              </span>
            )}
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
