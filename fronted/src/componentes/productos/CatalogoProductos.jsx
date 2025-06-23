// ==========================================
// ARCHIVO: frontend/src/componentes/productos/CatalogoProductos.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ListaProductos from './ListaProductos';
import { servicioProductos } from '../../servicios/servicioProductos';

console.log('CatalogoProductos SE MONTA');

const CatalogoProductos = ({ 
  productosIniciales = [],
  mostrarFiltros = true,
  titulo = "Catálogo de Productos",
  subtitulo = "Encuentra las mejores herramientas y materiales"
}) => {
  const [productos, setProductos] = useState(productosIniciales);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('nombre');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  useEffect(() => {
    console.log('CatalogoProductos useEffect ejecutado');
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [productosRes, categoriasRes, marcasRes] = await Promise.all([
        servicioProductos.obtenerTodos(),
        servicioProductos.obtenerCategorias(),
        servicioProductos.obtenerMarcas()
      ]);
      
      console.log('PRODUCTOS DEL BACKEND:', productosRes.data?.productos);
      setProductos(productosRes.data?.productos || []);
      setCategorias(categoriasRes.data || []);
      setMarcas(marcasRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    // Aceptar activo como 1, true o undefined (por si no viene el campo)
    const activo = producto.activo === 1 || producto.activo === true || producto.activo === undefined;
    if (!activo) return false;
    const cumpleBusqueda = !busqueda || 
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (producto.marca && producto.marca.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    
    const cumpleCategoria = !categoriaSeleccionada || 
      producto.categoria?.id?.toString() === categoriaSeleccionada;
    
    const cumpleMarca = !marcaSeleccionada || 
      producto.marca?.id?.toString() === marcaSeleccionada;
    
    const cumplePrecioMin = !precioMin || producto.precio >= parseFloat(precioMin);
    const cumplePrecioMax = !precioMax || producto.precio <= parseFloat(precioMax);
    
    return cumpleBusqueda && cumpleCategoria && cumpleMarca && cumplePrecioMin && cumplePrecioMax;
  });

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'precio-asc':
        return (a.precio_oferta || a.precio) - (b.precio_oferta || b.precio);
      case 'precio-desc':
        return (b.precio_oferta || b.precio) - (a.precio_oferta || a.precio);
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      case 'marca':
        return (a.marca?.nombre || '').localeCompare(b.marca?.nombre || '');
      default:
        return 0;
    }
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaSeleccionada('');
    setMarcaSeleccionada('');
    setPrecioMin('');
    setPrecioMax('');
    setOrdenamiento('nombre');
  };

  const toggleFavorito = (productoId) => {
    setFavoritos(prev => 
      prev.includes(productoId) 
        ? prev.filter(id => id !== productoId)
        : [...prev, productoId]
    );
  };

  const tieneFiltrosActivos = busqueda || categoriaSeleccionada || marcaSeleccionada || precioMin || precioMax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{titulo}</h1>
        <p className="text-gray-600">{subtitulo}</p>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {/* Búsqueda y filtros básicos */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Ordenamiento */}
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="nombre">Nombre A-Z</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="marca">Marca A-Z</option>
            </select>

            {/* Botón filtros avanzados */}
            <button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
              <ChevronDownIcon className={`h-4 w-4 ml-2 transform transition-transform ${mostrarFiltrosAvanzados ? 'rotate-180' : ''}`} />
            </button>

            {/* Limpiar filtros */}
            {tieneFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
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
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
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
                  onChange={(e) => setMarcaSeleccionada(e.target.value)}
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
                  onChange={(e) => setPrecioMin(e.target.value)}
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
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resultados */}
      <div>
        {/* Contador de resultados */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? 's' : ''} encontrado{productosOrdenados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de productos */}
        <ListaProductos
          productos={productosOrdenados}
          cargando={cargando}
          favoritos={favoritos}
          onToggleFavorito={toggleFavorito}
        />
      </div>
    </div>
  );
};

export default CatalogoProductos;
