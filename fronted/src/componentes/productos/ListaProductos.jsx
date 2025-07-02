// ==========================================
// ARCHIVO: frontend/src/componentes/productos/ListaProductos.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarjetaProducto from './TarjetaProducto';
import { useCarrito } from '../../contexto/ContextoCarrito';

const ListaProductos = ({ 
  productos, 
  cargando = false, 
  favoritos = [], 
  onToggleFavorito,
  mostrarAcciones = true,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
}) => {
  const { agregarItem } = useCarrito();

  // Moneda y tipos de cambio
  const [moneda, setMoneda] = useState('CLP');
  const [tiposCambio, setTiposCambio] = useState({ USD: 1, EUR: 1 });
  const [cargandoTasas, setCargandoTasas] = useState(false);

  useEffect(() => {
    const obtenerTiposCambio = async () => {
      setCargandoTasas(true);
      try {
        const res = await fetch('http://localhost:3003/api/v1/divisas/tipos-cambio');
        const data = await res.json();
        const usd = Array.isArray(data.data) ? data.data.find(d => d.codigo === 'USD') : null;
        const eur = Array.isArray(data.data) ? data.data.find(d => d.codigo === 'EUR') : null;
        setTiposCambio({
          USD: usd?.valor || 1,
          EUR: eur?.valor || 1
        });
      } catch {
        setTiposCambio({ USD: 1, EUR: 1 });
      } finally {
        setCargandoTasas(false);
      }
    };
    obtenerTiposCambio();
  }, []);

  const handleAgregarAlCarrito = (producto) => {
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio_oferta || producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  };

  const handleToggleFavorito = (productoId) => {
    if (onToggleFavorito) {
      onToggleFavorito(productoId);
    }
  };

  if (cargando) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
        <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <label className="mr-2 text-sm text-gray-700">Moneda:</label>
        <select
          value={moneda}
          onChange={e => setMoneda(e.target.value)}
          className="border px-2 py-1 rounded text-sm"
          disabled={cargandoTasas}
        >
          <option value="CLP">CLP</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {cargandoTasas && <span className="ml-2 text-xs text-gray-400">Cargando tasas...</span>}
      </div>
      <div className={`grid ${gridCols} gap-6`}>
        <AnimatePresence>
          {productos.map((producto, index) => (
            <motion.div
              key={producto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
            >
              <TarjetaProducto
                producto={producto}
                onAgregarAlCarrito={handleAgregarAlCarrito}
                onToggleFavorito={handleToggleFavorito}
                esFavorito={favoritos.includes(producto.id)}
                mostrarAcciones={mostrarAcciones}
                moneda={moneda}
                tiposCambio={tiposCambio}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ListaProductos;
