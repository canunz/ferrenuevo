import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CubeIcon } from '@heroicons/react/24/outline';
import { servicioProductos } from '../servicios/servicioProductos';

const PaginaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const response = await servicioProductos.obtenerTodos();
        console.log('Respuesta de productos:', response);
        // Mostrar el array de productos en pantalla para depuración
        let productosArray = [];
        if (response.success && Array.isArray(response.data)) {
          productosArray = response.data;
        } else if (response.success && response.data && Array.isArray(response.data.productos)) {
          productosArray = response.data.productos;
        } else if (response.success && response.data && Array.isArray(response.data.data)) {
          productosArray = response.data.data;
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
        }
        window.__productosDebug = productosArray;
        setProductos(productosArray);
      } catch (e) {
        console.error('Error al cargar productos:', e);
        setError(e.message);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Catálogo de Productos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Todos los productos disponibles
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {cargando ? (
          <div className="text-center py-12 text-gray-400">Cargando productos...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Error al cargar productos: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay productos disponibles.</div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productos.map(producto => (
                <div key={producto.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col items-center">
                  <img
                    src={`/assets/imagenes/productos/${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-32 h-32 object-contain mb-2"
                    onError={e => { e.target.src = '/assets/imagenes/productos/placeholder.jpg'; }}
                  />
                  <h3 className="font-semibold text-gray-900 mb-1 text-center">{producto.nombre}</h3>
                  <span className="text-sm text-blue-600 font-medium mb-1">
                    {producto.marca?.nombre || producto.marca || 'Sin marca'}
                  </span>
                  <span className="text-lg font-bold text-gray-800 mb-2">
                    ${parseInt(producto.precio).toLocaleString('es-CL')}
                  </span>
                  <span className="text-xs text-gray-500 mb-2">
                    {producto.categoria?.nombre || producto.categoria || 'Sin categoría'}
                  </span>
                  <span className="text-xs text-gray-400">ID: {producto.id}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaginaProductos;