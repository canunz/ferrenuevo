// ==========================================
// ARCHIVO: frontend/src/componentes/productos/FiltrosProductos.jsx
// ==========================================
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const FiltrosProductos = ({
  categorias = [],
  marcas = [],
  filtros,
  onFiltroChange,
  onLimpiarFiltros,
  mostrarFiltrosAvanzados = false,
  onToggleFiltrosAvanzados
}) => {
  const {
    busqueda = '',
    categoriaSeleccionada = '',
    marcaSeleccionada = '',
    precioMin = '',
    precioMax = '',
    ordenamiento = 'nombre'
  } = filtros;

  const tieneFiltrosActivos = busqueda || categoriaSeleccionada || marcaSeleccionada || precioMin || precioMax;

  const handleInputChange = (campo, valor) => {
    onFiltroChange({
      ...filtros,
      [campo]: valor
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* Filtros básicos */}
      <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => handleInputChange('busqueda', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ordenamiento */}
        <select
          value={ordenamiento}
          onChange={(e) => handleInputChange('ordenamiento', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="nombre">Nombre A-Z</option>
          <option value="precio-asc">Precio: Menor a Mayor</option>
          <option value="precio-desc">Precio: Mayor a Menor</option>
          <option value="marca">Marca A-Z</option>
        </select>

        {/* Botón filtros avanzados */}
        <button
          onClick={onToggleFiltrosAvanzados}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filtros
          <ChevronDownIcon className={`h-4 w-4 ml-2 transform transition-transform ${mostrarFiltrosAvanzados ? 'rotate-180' : ''}`} />
        </button>

        {/* Limpiar filtros */}
        {tieneFiltrosActivos && (
          <button
            onClick={onLimpiarFiltros}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <XMarkIcon className="h-5 w-5 mr-1" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      <motion.div
        initial={false}
        animate={{ height: mostrarFiltrosAvanzados ? 'auto' : 0, opacity: mostrarFiltrosAvanzados ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Filtro Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => handleInputChange('categoriaSeleccionada', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <select
              value={marcaSeleccionada}
              onChange={(e) => handleInputChange('marcaSeleccionada', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las marcas</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Precio Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              placeholder="0"
              value={precioMin}
              onChange={(e) => handleInputChange('precioMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro Precio Máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              placeholder="999999"
              value={precioMax}
              onChange={(e) => handleInputChange('precioMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Filtros activos */}
      {tieneFiltrosActivos && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {busqueda && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Búsqueda: "{busqueda}"
                <button
                  onClick={() => handleInputChange('busqueda', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {categoriaSeleccionada && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Categoría: {categorias.find(c => c.id.toString() === categoriaSeleccionada)?.nombre}
                <button
                  onClick={() => handleInputChange('categoriaSeleccionada', '')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {marcaSeleccionada && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                Marca: {marcas.find(m => m.id.toString() === marcaSeleccionada)?.nombre}
                <button
                  onClick={() => handleInputChange('marcaSeleccionada', '')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {(precioMin || precioMax) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                Precio: {precioMin || '0'} - {precioMax || '∞'}
                <button
                  onClick={() => {
                    handleInputChange('precioMin', '');
                    handleInputChange('precioMax', '');
                  }}
                  className="ml-2 text-orange-600 hover:text-orange-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltrosProductos;
