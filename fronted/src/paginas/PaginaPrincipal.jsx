// ==========================================
// ARCHIVO: frontend/src/paginas/PaginaPrincipal.jsx - ACTUALIZADO
// ==========================================
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  HeartIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useCarrito } from '../contexto/ContextoCarrito';
import { useAuth } from '../contexto/ContextoAuth';
import { servicioProductos } from '../servicios/servicioProductos';

console.log('PAGINA PRINCIPAL SE MONTA');

const PaginaPrincipal = () => {
  const { agregarItem, carrito } = useCarrito();
  const { usuario } = useAuth();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState('destacados');

  // ESTADOS REALES CON NUEVA API
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([{ id: 'todos', nombre: 'Todos los Productos', icono: '🔧' }]);
  const [marcas, setMarcas] = useState([{ id: 'todas', nombre: 'Todas' }]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // CARGAR DATOS CON NUEVA API
  useEffect(() => {
    const cargarDatos = async () => {
      console.log('🔄 Cargando datos para PaginaPrincipal...');
      setCargando(true);
      setError(null);
      
      try {
        // Cargar productos
        console.log('📦 Cargando productos...');
        const productosResponse = await servicioProductos.obtenerTodos();
        console.log('✅ Productos recibidos:', productosResponse);
        
        if (productosResponse.success && Array.isArray(productosResponse.data)) {
          setProductos(productosResponse.data);
          console.log('✅ Productos establecidos:', productosResponse.data.length);
        } else {
          setProductos([]);
        }

        // Cargar marcas
        console.log('🏷️ Cargando marcas...');
        const marcasResponse = await servicioProductos.obtenerMarcas();
        console.log('✅ Marcas recibidas:', marcasResponse);
        
        if (marcasResponse.success && marcasResponse.data) {
          setMarcas([
            { id: 'todas', nombre: 'Todas' }, 
            ...marcasResponse.data.map(marca => ({
              id: marca.id,
              nombre: marca.nombre,
              total_productos: marca.total_productos
            }))
          ]);
          console.log('✅ Marcas establecidas:', marcasResponse.data.length);
        }

        // Cargar categorías
        console.log('📁 Cargando categorías...');
        const categoriasResponse = await servicioProductos.obtenerCategorias();
        console.log('✅ Categorías recibidas:', categoriasResponse);
        
        if (categoriasResponse.success && categoriasResponse.data) {
          setCategorias([
            { id: 'todos', nombre: 'Todos los Productos', icono: '🔧' },
            ...categoriasResponse.data.map(categoria => ({
              id: categoria.id,
              nombre: categoria.nombre,
              total_productos: categoria.total_productos
            }))
          ]);
          console.log('✅ Categorías establecidas:', categoriasResponse.data.length);
        }

      } catch (error) {
        console.error('❌ Error cargando datos:', error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca?.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
    
    const cumpleCategoria = categoriaSeleccionada === 'todos' || 
      producto.categoria?.id === parseInt(categoriaSeleccionada);
    
    const cumpleMarca = marcaSeleccionada === 'todas' || 
      producto.marca?.id === parseInt(marcaSeleccionada);
    
    return cumpleBusqueda && cumpleCategoria && cumpleMarca;
  });

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'precio-asc':
        return parseFloat(a.precio) - parseFloat(b.precio);
      case 'precio-desc':
        return parseFloat(b.precio) - parseFloat(a.precio);
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      default:
        return 0;
    }
  });

  const toggleFavorito = (productoId) => {
    setFavoritos(prev => 
      prev.includes(productoId) 
        ? prev.filter(id => id !== productoId)
        : [...prev, productoId]
    );
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const manejarAgregarCarrito = (producto) => {
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
      imagen: producto.imagen,
      marca_nombre: producto.marca?.nombre,
      categoria_nombre: producto.categoria?.nombre
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/test-backend" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔧 Probar Conexión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative text-white py-16"
        style={{
          backgroundImage: "url('/assets/imagenes/banner/bannerferremas.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-4">FERREMAS</h1>
              <p className="text-xl mb-8 text-blue-100">
                Tu distribuidora de confianza desde 1980
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Envío a todo Chile
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Garantía extendida
                </div>
                <div className="flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  Mejores precios
                </div>
              </div>
              
              {/* Estadísticas */}
              <div className="mt-8 bg-black bg-opacity-30 rounded-lg p-4 inline-block">
                <div className="flex gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {productos.length}
                    </div>
                    <div className="text-sm">Productos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">
                      {marcas.length - 1}
                    </div>
                    <div className="text-sm">Marcas</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {categorias.length - 1}
                    </div>
                    <div className="text-sm">Categorías</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Barra de búsqueda y filtros */}
      <section className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtros
                <ChevronDownIcon className={`h-4 w-4 ml-2 transform transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>
          </div>

          {/* Panel de filtros expandible */}
          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <select
                      value={marcaSeleccionada}
                      onChange={(e) => setMarcaSeleccionada(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {marcas.map(marca => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nombre} {marca.total_productos ? `(${marca.total_productos})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nombre} {categoria.total_productos ? `(${categoria.total_productos})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Resultados */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Catálogo de Productos Ferremas
          </h2>
          <p className="text-xl text-gray-600">
            {productos.length} productos encontrados en nuestra base de datos
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuestros Productos</h2>
            <p className="text-gray-600">
              {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} encontrado{productosOrdenados.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Debug info */}
          <div className="text-right text-sm text-gray-500">
            <div>✅ {productos.length} productos cargados</div>
            <div>🏷️ {marcas.length - 1} marcas</div>
            <div>📁 {categorias.length - 1} categorías</div>
          </div>
        </div>

        {productosOrdenados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosOrdenados.map((producto) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
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
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {producto.nombre}
                    </h3>
                    <button
                      onClick={() => toggleFavorito(producto.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {favoritos.includes(producto.id) ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    {producto.marca_nombre && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {producto.marca_nombre}
                      </span>
                    )}
                    {producto.codigo_sku && (
                      <span className="text-xs text-gray-400">
                        SKU: {producto.codigo_sku}
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
                    <button
                      onClick={() => manejarAgregarCarrito(producto)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaPrincipal;