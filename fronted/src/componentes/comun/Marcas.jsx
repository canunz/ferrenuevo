// ==========================================
// FRONTEND/SRC/COMPONENTES/MARCAS.JSX - COMPLETO
// ==========================================
import React, { useState, useEffect } from 'react';
import { productosAPI } from '../servicios/api';

const Marcas = () => {
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar marcas
  const cargarMarcas = async () => {
    console.log('🔥 Marcas: Cargando marcas...');
    setCargando(true);
    setError(null);

    try {
      const response = await productosAPI.obtenerMarcas();
      console.log('🏷️ Marcas: Respuesta recibida:', response);

      if (response.success && response.data) {
        setMarcas(response.data);
        console.log('✅ Marcas: Marcas establecidas:', response.data.length);
      } else {
        throw new Error('No se pudieron cargar las marcas');
      }
    } catch (error) {
      console.error('❌ Marcas: Error:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Marcas: Componente montado');
    cargarMarcas();
  }, []);

  if (cargando) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Marcas
            </h2>
            <p className="text-xl text-gray-600">
              Trabajamos con las mejores marcas del mercado
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando marcas...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Marcas
            </h2>
            <p className="text-xl text-gray-600">
              Trabajamos con las mejores marcas del mercado
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
                onClick={cargarMarcas}
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

  if (marcas.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Marcas
            </h2>
            <p className="text-xl text-gray-600">
              Trabajamos con las mejores marcas del mercado
            </p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">No hay marcas registradas actualmente.</p>
              <button 
                onClick={cargarMarcas}
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestras Marcas
          </h2>
          <p className="text-xl text-gray-600">
            Trabajamos con las mejores marcas del mercado
          </p>
          <p className="text-sm text-green-600 mt-2">
            ✅ {marcas.length} marcas cargadas desde la base de datos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {marcas.map((marca) => (
            <div 
              key={marca.id} 
              className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 text-center"
            >
              <div className="mb-4">
                {marca.imagen ? (
                  <img
                    src={`/assets/imagenes/marcas/${marca.imagen.replace('_&_', '_')}`}
                    alt={marca.nombre}
                    className="w-20 h-20 mx-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-blue-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {marca.nombre}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {marca.descripcion || 'Marca de confianza'}
              </p>
              
              <div className="text-xs text-blue-600 font-medium">
                {marca.total_productos} producto{marca.total_productos !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors text-lg font-medium">
            Ver Todos los Productos por Marca →
          </button>
        </div>

        {/* DEBUG BUTTON */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              console.log('🧪 Debug - Marcas actuales:', marcas);
              cargarMarcas();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            🔥 DEBUG: Recargar Marcas
          </button>
        </div>
      </div>
    </section>
  );
};

export default Marcas;