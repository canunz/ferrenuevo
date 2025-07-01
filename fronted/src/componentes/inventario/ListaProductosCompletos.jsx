import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { obtenerProductosCompletos } from '../../servicios/servicioInventario';
import { useAuth } from '../../contexto/ContextoAuth';

const ListaProductosCompletos = () => {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    page: 1,
    limit: 1000,
    stock_bajo: false,
    en_oferta: false,
    q: ''
  });
  const [estadisticas, setEstadisticas] = useState({});

  useEffect(() => {
    // Solo cargar productos si el usuario está autenticado
    if (usuario && !cargandoAuth) {
      cargarProductos();
    }
  }, [filtros, usuario, cargandoAuth]);

  const cargarProductos = async () => {
    if (!usuario) {
      setError('Debes estar autenticado para ver el inventario');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await obtenerProductosCompletos(filtros);
      console.log('📦 Productos completos:', response.data);
      
      // Asegurar que productos sea siempre un array
      let productosData = [];
      let estadisticasData = {};
      
      if (response.data && response.data.success) {
        // Si la respuesta tiene la estructura esperada
        productosData = Array.isArray(response.data.message) ? response.data.message : [];
        estadisticasData = response.data.meta?.estadisticas || {};
      } else if (response.data && Array.isArray(response.data)) {
        // Si la respuesta es directamente un array
        productosData = response.data;
      } else if (response.data && response.data.message && Array.isArray(response.data.message)) {
        // Si los datos están en response.data.message
        productosData = response.data.message;
      } else {
        // Si no hay datos válidos, usar array vacío
        productosData = [];
      }
      
      console.log('📋 Productos procesados:', productosData);
      setProductos(productosData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
      setError('Error al cargar los productos: ' + (err.response?.data?.error || err.message));
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getEstadoStockColor = (estado) => {
    switch (estado) {
      case 'normal': return 'text-green-600 bg-green-100';
      case 'bajo': return 'text-yellow-600 bg-yellow-100';
      case 'agotado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEstadoStockIcon = (estado) => {
    switch (estado) {
      case 'normal': return <CheckCircleIcon className="w-4 h-4" />;
      case 'bajo': return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'agotado': return <XCircleIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  if (cargandoAuth) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Verificando autenticación...</span>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <XCircleIcon className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-red-600">Debes estar autenticado para ver el inventario</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <XCircleIcon className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Asegurar que productos sea siempre un array
  const productosArray = Array.isArray(productos) ? productos : [];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filtros.q}
                onChange={(e) => setFiltros(prev => ({ ...prev, q: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFiltros(prev => ({ ...prev, stock_bajo: !prev.stock_bajo, page: 1 }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtros.stock_bajo 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
              Stock Bajo
            </button>
            
            <button
              onClick={() => setFiltros(prev => ({ ...prev, en_oferta: !prev.en_oferta, page: 1 }))}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtros.en_oferta 
                  ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <TagIcon className="w-4 h-4 inline mr-1" />
              En Oferta
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && Object.keys(estadisticas).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total_productos || 0}</div>
            <div className="text-sm text-gray-600">Total Productos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{estadisticas.productos_con_stock || 0}</div>
            <div className="text-sm text-gray-600">Con Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-orange-600">{estadisticas.productos_en_oferta || 0}</div>
            <div className="text-sm text-gray-600">En Oferta</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">{estadisticas.productos_sin_stock || 0}</div>
            <div className="text-sm text-gray-600">Sin Stock</div>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Productos ({productosArray.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {productosArray.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron productos con los filtros aplicados.
            </div>
          ) : (
            productosArray.map((producto) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {producto.nombre}
                      </h4>
                      
                      {/* Badge de oferta */}
                      {producto.tiene_promocion && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {producto.descuento_porcentaje}% OFF
                        </span>
                      )}
                      
                      {/* Estado del stock */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoStockColor(producto.estado_stock)}`}>
                        {getEstadoStockIcon(producto.estado_stock)}
                        <span className="ml-1 capitalize">{producto.estado_stock}</span>
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">SKU:</span> {producto.codigo_sku || 'No asignado'} | 
                      <span className="font-medium ml-2">Marca:</span> {producto.marca?.nombre || 'Sin marca'} | 
                      <span className="font-medium ml-2">Categoría:</span> {producto.categoria?.nombre || 'Sin categoría'}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {producto.descripcion || 'Sin descripción'}
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    {/* Precios */}
                    <div className="space-y-1">
                      {producto.tiene_promocion ? (
                        <>
                          <div className="text-sm text-gray-500 line-through">
                            {formatearPrecio(producto.precio_original)}
                          </div>
                          <div className="text-xl font-bold text-orange-600">
                            {formatearPrecio(producto.precio_final)}
                          </div>
                        </>
                      ) : (
                        <div className="text-xl font-bold text-gray-900">
                          {formatearPrecio(producto.precio)}
                        </div>
                      )}
                    </div>
                    
                    {/* Stock */}
                    <div className="mt-2">
                      <div className="text-lg font-semibold text-gray-900">
                        {producto.stock_total} unidades
                      </div>
                      <div className="text-sm text-gray-500">
                        {producto.stock_disponible}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaProductosCompletos; 