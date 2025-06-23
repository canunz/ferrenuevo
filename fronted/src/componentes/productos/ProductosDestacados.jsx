// ==========================================
// FRONTEND/SRC/COMPONENTES/PRODUCTOSDESTACADOS.JSX - COMPLETO
// ==========================================
import React, { useState, useEffect } from 'react';
import { productosAPI } from '../servicios/api';

const ProductosDestacados = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos
  const cargarProductos = async () => {
    console.log('🔥 ProductosDestacados: Cargando productos...');
    setCargando(true);
    setError(null);

    try {
      const response = await productosAPI.obtenerTodos();
      console.log('📦 ProductosDestacados: Respuesta recibida:', response);

      if (response.success && response.data) {
        // Tomar solo los primeros 6 para destacados
        const productosDestacados = response.data.slice(0, 6);
        setProductos(productosDestacados);
        console.log('✅ ProductosDestacados: Productos establecidos:', productosDestacados.length);
      } else {
        throw new Error('No se pudieron cargar los productos');
      }
    } catch (error) {
      console.error('❌ ProductosDestacados: Error:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    console.log('🚀 ProductosDestacados: Componente montado');
    cargarProductos();
  }, []);

  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(precio);
  };

  if (cargando) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Las mejores ofertas y productos más populares de la semana
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Las mejores ofertas y productos más populares de la semana
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={cargarProductos}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Las mejores ofertas y productos más populares de la semana
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">No hay productos destacados actualmente.</p>
              <button 
                onClick={cargarProductos}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Recargar
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-600">
            Las mejores ofertas y productos más populares de la semana
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✅ {productos.length} productos cargados desde la base de datos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {producto.imagen ? (
                  <img
                    src={`/assets/imagenes/productos/${producto.imagen}`}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-xs text-gray-500">{producto.categoria_nombre}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  {producto.marca_nombre && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                      {producto.marca_nombre}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {producto.descripcion || 'Descripción no disponible'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-red-600">
                    {formatearPrecio(producto.precio)}
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    Ver Producto
                  </button>
                </div>
                
                {producto.codigo_sku && (
                  <p className="text-xs text-gray-400 mt-2">
                    SKU: {producto.codigo_sku}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors text-lg font-medium">
            Ver Todos los Productos →
          </button>
        </div>

        {/* DEBUG BUTTON */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              console.log('🧪 Debug - Productos actuales:', productos);
              cargarProductos();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            🔥 DEBUG: Recargar Productos
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductosDestacados;