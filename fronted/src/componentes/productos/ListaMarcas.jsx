// ==========================================
// ARCHIVO: frontend/src/componentes/productos/ListaMarcas.jsx
// ==========================================
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ListaMarcas = ({ marcas = [], titulo = "Nuestras Marcas" }) => {
  const marcasFiltradas = marcas.filter(marca => 
    marca.nombre !== 'Todas' && marca.id !== 'todas' && marca.activo !== false
  );

  const obtenerImagenMarca = (imagen) => {
    if (!imagen) {
      return '/assets/imagenes/marcas/placeholder.png';
    }
    
    // Si la imagen ya tiene una URL completa, la devolvemos
    if (imagen.startsWith('http')) {
      return imagen;
    }
    
    // Si es solo el nombre del archivo, construimos la ruta
    return `/assets/imagenes/marcas/${imagen}`;
  };

  return (
    <section className="bg-white py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{titulo}</h2>
          <p className="text-gray-600">Trabajamos con las mejores marcas del mercado</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {marcasFiltradas.map((marca, index) => (
            <motion.div
              key={marca.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <Link
                to={`/productos?marca=${marca.id}`}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 group-hover:border-blue-200"
              >
                {/* Logo de la marca */}
                <div className="flex items-center justify-center h-20 w-24 mb-4">
                  <img
                    src={obtenerImagenMarca(marca.imagen)}
                    alt={marca.nombre}
                    className="h-16 w-full object-contain transition-all duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Si la imagen falla, mostramos un ícono de marca
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback cuando la imagen no carga */}
                  <div 
                    className="hidden h-16 w-full items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Nombre de la marca */}
                <span className="font-semibold text-gray-700 text-center text-sm group-hover:text-blue-600 transition-colors">
                  {marca.nombre}
                </span>
                
                {/* Descripción si existe */}
                {marca.descripcion && (
                  <p className="text-xs text-gray-500 text-center mt-2 line-clamp-2">
                    {marca.descripcion}
                  </p>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListaMarcas; 