// ==========================================
// ARCHIVO: frontend/src/paginas/PaginaPrincipal.jsx
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

const PaginaPrincipal = () => {
  const { agregarAlCarrito, carrito } = useCarrito();
  const { usuario } = useAuth();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState('destacados');

  // ESTADOS REALES
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([{ id: 'todos', nombre: 'Todos los Productos', icono: '🔧' }]);
  const [marcas, setMarcas] = useState([{ id: 'todas', nombre: 'Todas' }]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const productosData = await servicioProductos.obtenerTodos();
        const marcasData = await servicioProductos.obtenerMarcas();
        const categoriasData = await servicioProductos.obtenerCategorias();
        setProductos(productosData.data?.productos || []);
        setMarcas([{ id: 'todas', nombre: 'Todas' }, ...(marcasData.data || [])]);
        setCategorias([{ id: 'todos', nombre: 'Todos los Productos', icono: '🔧' }, ...(categoriasData.data || [])]);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Filtrar productos (solo catálogo general)
  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca?.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleCategoria = categoriaSeleccionada === 'todos' || producto.categoria?.id === categoriaSeleccionada;
    const cumpleMarca = marcaSeleccionada === 'todas' || producto.marca?.id === marcaSeleccionada;
    return cumpleBusqueda && cumpleCategoria && cumpleMarca;
  });

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'precio-asc':
        return a.precio - b.precio;
      case 'precio-desc':
        return b.precio - a.precio;
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
      currency: 'CLP'
    }).format(precio);
  };

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
        {/* Overlay para oscurecer la imagen y mejorar la legibilidad */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-4">
                FERREMAS
              </h1>
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
                          {marca.nombre}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de categorías */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categorías
              </h3>
              <nav className="space-y-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaSeleccionada(categoria.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${
                      categoriaSeleccionada === categoria.id
                        ? 'bg-blue-100 text-blue-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{categoria.icono}</span>
                    {categoria.nombre}
                  </button>
                ))}
              </nav>

              {/* Banner promocional */}
              <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg">
                <h4 className="font-bold text-sm mb-2">¡Oferta Especial!</h4>
                <p className="text-xs">Descuento del 20% en herramientas eléctricas</p>
                <button className="mt-2 bg-white text-orange-600 px-3 py-1 rounded text-xs font-medium">
                  Ver ofertas
                </button>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categorias.find(c => c.id === categoriaSeleccionada)?.nombre}
              </h2>
              <span className="text-gray-600">
                {productosOrdenados.length} productos encontrados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosOrdenados.map(producto => (
                <motion.div
                  key={producto.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  {/* Imagen del producto */}
                  <div className="relative">
                    <img
                      src={producto.imagen ? `/assets/imagenes/productos/${producto.imagen}` : '/assets/imagenes/productos/Sierrabosch.jpg'}
                      alt={producto.nombre}
                      className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300 bg-white"
                    />
                    
                    {/* Etiquetas */}
                    {producto.etiquetas && (
                      <div className="absolute top-2 left-2 space-y-1">
                        {producto.etiquetas.map(etiqueta => (
                          <span
                            key={etiqueta}
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              etiqueta === 'Promoción' ? 'bg-red-500 text-white' :
                              etiqueta === 'Nuevo' ? 'bg-green-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}
                          >
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Botón de favoritos */}
                    <button
                      onClick={() => toggleFavorito(producto.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
                    >
                      {favoritos.includes(producto.id) ? (
                        <HeartSolid className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {/* Stock bajo */}
                    {producto.stock < 10 && (
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded">
                          ¡Últimas {producto.stock} unidades!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-sm text-blue-600 font-medium">
                        {producto.marca?.nombre}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {producto.nombre}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarSolid
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(producto.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {producto.rating} ({producto.reviews})
                      </span>
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                          {formatearPrecio(producto.precio)}
                        </span>
                        {producto.precioAnterior && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatearPrecio(producto.precioAnterior)}
                          </span>
                        )}
                      </div>
                      {producto.precioAnterior && (
                        <span className="text-sm text-green-600 font-medium">
                          Ahorra {formatearPrecio(producto.precioAnterior - producto.precio)}
                        </span>
                      )}
                    </div>

                    {/* Características */}
                    {producto.caracteristicas && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {producto.caracteristicas.slice(0, 2).map(caracteristica => (
                            <span
                              key={caracteristica}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {caracteristica}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-2">
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                          producto.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                      </button>
                      
                      <Link
                        to={`/producto/${producto.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sin resultados */}
            {productosOrdenados.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta cambiar los filtros o la búsqueda
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Sección de marcas */}
      <section className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Marcas de Confianza
          </h2>
          <div className="w-full flex justify-center">
            <div
              className={`grid gap-8 justify-center mx-auto`}
              style={{
                gridTemplateColumns: `repeat(${marcas.filter(marca => marca.nombre !== 'Todas' && marca.id !== 'todas').length}, minmax(0, 1fr))`,
                maxWidth: '900px'
              }}
            >
              {marcas.filter(marca => marca.nombre !== 'Todas' && marca.id !== 'todas').map(marca => {
                console.log('Logo marca:', marca.imagen);
                return (
                  <div
                    key={marca.id}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 group cursor-pointer"
                  >
                    {/* Logo de la marca si existe */}
                    <div className="flex items-center justify-center h-16 w-24 mb-2">
                      <img
                        src={marca.imagen ? `/assets/imagenes/marcas/${marca.imagen}` : undefined}
                        alt={marca.nombre}
                        className="h-16 object-contain transition-all duration-300"
                      />
                    </div>
                    {/* Nombre de la marca */}
                    <span className="font-semibold text-gray-700 text-center text-base group-hover:text-blue-600 transition-colors">
                      {marca.nombre}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaginaPrincipal;