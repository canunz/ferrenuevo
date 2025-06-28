import React, { useState, useEffect } from 'react';
import MovimientoStock from './MovimientoStock';
import api from '../../servicios/api';

const ListaInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [formAbierto, setFormAbierto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventario = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/inventario');
        setInventario(res.data.data || []);
      } catch (err) {
        setError('Error al cargar el inventario');
      } finally {
        setLoading(false);
      }
    };
    fetchInventario();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando inventario...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!inventario.length) {
    return <div className="p-8 text-center text-gray-500">No hay productos en inventario.</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Inventario</h2>
      <div className="grid grid-cols-4 gap-2 mb-1 items-end">
        <div className="text-xs text-gray-500 pl-2">Producto</div>
        <div className="text-xs text-gray-500">Stock actual</div>
        <div className="text-xs text-gray-500">Mínimo</div>
        <div className="text-xs text-gray-500">Máximo</div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {inventario.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="grid grid-cols-4 gap-2 items-center">
              <div>
                <div className="font-bold text-gray-800 text-base leading-tight">{item.producto?.nombre || 'Sin nombre'}</div>
                <div className="text-xs text-gray-500 leading-tight">ID: {item.producto?.id || '-'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.stock_actual}</div>
                <div style={{ minHeight: '18px' }}>
                  {item.stock_actual <= item.stock_minimo ? (
                    <div className="text-red-600 flex items-center text-xs font-bold mt-0.5" title="Stock bajo">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: 2 }}>
                        <path d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 11.856c.027.047.04.1.04.153a.267.267 0 0 1-.267.267H1.307a.267.267 0 0 1-.267-.267.266.266 0 0 1 .04-.153L7.938 2.016zm.562-1.032a1.13 1.13 0 0 0-1 0L.643 12.84A1.267 1.267 0 0 0 1.307 15h13.386a1.267 1.267 0 0 0 1.267-2.16L8.5.984zM8 6c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 6.995A.905.905 0 0 1 8 6zm.002 6a1 1 0 1 1-2.002 0 1 1 0 0 1 2.002 0z" />
                      </svg>
                      ¡Stock bajo!
                    </div>
                  ) : (
                    <div style={{ height: '18px' }}></div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.stock_minimo}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{item.stock_maximo}</div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${formAbierto === item.id ? 'bg-gray-200 text-gray-800' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                onClick={() => setFormAbierto(formAbierto === item.id ? null : item.id)}
              >
                {formAbierto === item.id ? 'Cerrar' : '+ Movimiento'}
              </button>
            </div>
            {formAbierto === item.id && (
              <div className="mt-2 border-t pt-2">
                <MovimientoStock
                  productoId={item.producto?.id}
                  modoCompacto
                  onMovimientoExitoso={(nuevoInventario) => {
                    setInventario(prev => prev.map(inv =>
                      inv.id === item.id ? { ...inv, stock_actual: nuevoInventario.stock_actual } : inv
                    ));
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaInventario;
