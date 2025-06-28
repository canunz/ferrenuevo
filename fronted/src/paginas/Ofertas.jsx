import React, { useEffect, useState } from 'react';
import { servicioProductos } from '../servicios/servicioProductos';
import { ShoppingCartIcon, MagnifyingGlassIcon, TagIcon, FireIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCarrito } from '../contexto/ContextoCarrito';
import { useNotificacion } from '../contexto/ContextoNotificacion';

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas');
  const [ordenamiento, setOrdenamiento] = useState('descuento');
  const [cargando, setCargando] = useState(true);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(0);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [estadisticas, setEstadisticas] = useState({});
  const { agregarItem } = useCarrito();
  const { mostrarNotificacion } = useNotificacion();

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        // Usar la ruta específica de ofertas
        const res = await fetch('http://localhost:3000/api/v1/productos/ofertas');
        const data = await res.json();
        console.log('Respuesta de ofertas:', data); // Debug
        
        let productosConOfertas = [];
        if (data.success && data.data) {
          productosConOfertas = data.data.ofertas || [];
          console.log('Productos con ofertas:', productosConOfertas); // Debug
          setProductos(productosConOfertas);
          setEstadisticas(data.data.estadisticas || {});
        } else {
          console.error('Error en respuesta de ofertas:', data);
          setProductos([]);
          setEstadisticas({});
        }
        
        // Cargar marcas
        const marcasData = await servicioProductos.obtenerMarcas();
        setMarcas([{ id: 'todas', nombre: 'Todas las Marcas' }, ...(marcasData.data || [])]);
        
        // Calcular rangos de precio de productos en oferta
        if (productosConOfertas && productosConOfertas.length > 0) {
          const preciosFinales = productosConOfertas.map(p => p.precio_final || p.precio);
          setPrecioMin(Math.min(...preciosFinales));
          setPrecioMax(Math.max(...preciosFinales));
          setFiltroPrecioMin(Math.min(...preciosFinales));
          setFiltroPrecioMax(Math.max(...preciosFinales));
        }
        
      } catch (error) {
        console.error('Error al cargar ofertas:', error);
        setProductos([]);
        setMarcas([{ id: 'todas', nombre: 'Todas las Marcas' }]);
        mostrarNotificacion('Error al cargar las ofertas', 'error');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [mostrarNotificacion]);

  // Aplicar filtros a productos en oferta
  let productosEnOferta = productos.filter(producto => {
    const precioFinal = producto.precio_final || producto.precio;
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca_nombre?.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleMarca = marcaSeleccionada === 'todas' || 
      producto.marca_id === marcaSeleccionada ||
      producto.marca_nombre === marcaSeleccionada;
    const cumplePrecio = (!filtroPrecioMin || precioFinal >= filtroPrecioMin) && 
      (!filtroPrecioMax || precioFinal <= filtroPrecioMax);
    
    return cumpleBusqueda && cumpleMarca && cumplePrecio;
  });

  // Ordenar productos
  productosEnOferta = [...productosEnOferta].sort((a, b) => {
    switch (ordenamiento) {
      case 'descuento':
        return (b.descuento_porcentaje || 0) - (a.descuento_porcentaje || 0);
      case 'ahorro':
        return (b.ahorro_total || 0) - (a.ahorro_total || 0);
      case 'precio-asc':
        return (a.precio_final || a.precio) - (b.precio_final || b.precio);
      case 'precio-desc':
        return (b.precio_final || b.precio) - (a.precio_final || a.precio);
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      default:
        return 0;
    }
  });

  // Agrupar por categoría
  const productosPorCategoria = productosEnOferta.reduce((acc, prod) => {
    const cat = prod.categoria_nombre || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const manejarAgregarCarrito = (producto) => {
    // Usar precio final si está disponible
    const productoParaCarrito = {
      ...producto,
      precio: producto.precio_final || producto.precio
    };
    agregarItem(productoParaCarrito);
    
    const mensaje = producto.tiene_promocion 
      ? `¡${producto.nombre} agregado con ${producto.descuento_porcentaje}% de descuento!`
      : `${producto.nombre} agregado al carrito`;
    mostrarNotificacion(mensaje, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header con estadísticas */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
            🔥 OFERTAS ESPECIALES 🔥
          </h1>
          {estadisticas && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-4 mx-auto max-w-4xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{estadisticas.productos_con_oferta || productosEnOferta.length}</div>
                  <div className="text-sm opacity-90">Productos en Oferta</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{estadisticas.mejor_descuento || 0}%</div>
                  <div className="text-sm opacity-90">Mejor Descuento</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatearPrecio(estadisticas.ahorro_total_disponible || 0)}</div>
                  <div className="text-sm opacity-90">Ahorro Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{estadisticas.porcentaje_en_oferta || 0}%</div>
                  <div className="text-sm opacity-90">Productos con Descuento</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros mejorados */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <select
                value={marcaSeleccionada}
                onChange={e => setMarcaSeleccionada(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                {marcas.map(marca => (
                  <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Precio</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={precioMin}
                  max={precioMax}
                  value={filtroPrecioMin}
                  onChange={e => setFiltroPrecioMin(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  placeholder="Mín"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  min={precioMin}
                  max={precioMax}
                  value={filtroPrecioMax}
                  onChange={e => setFiltroPrecioMax(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                  placeholder="Máx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={ordenamiento}
                onChange={e => setOrdenamiento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="descuento">Mayor Descuento</option>
                <option value="ahorro">Mayor Ahorro</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-lg font-bold text-red-600">{productosEnOferta.length} ofertas</div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {cargando ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Cargando ofertas increíbles...</div>
          </div>
        ) : productosEnOferta.length === 0 ? (
          <div className="text-center py-20">
            <FireIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <div className="text-xl text-gray-600 mb-2">No hay ofertas que coincidan con tus filtros</div>
            <div className="text-gray-500">Prueba ajustando los filtros de búsqueda</div>
          </div>
        ) : (
          Object.entries(productosPorCategoria).map(([categoria, productos]) => (
            <div key={categoria} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <TagIcon className="h-6 w-6 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-800">{categoria}</h2>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {productos.length} ofertas
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map(producto => (
                  <div key={producto.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img
                        src={producto.imagen ? `/assets/imagenes/productos/${producto.imagen}` : '/assets/imagenes/productos/placeholder.jpg'}
                        alt={producto.nombre}
                        className="w-full h-48 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Badge de descuento */}
                      {producto.tiene_promocion && (
                        <div className="absolute top-2 left-2">
                          <div 
                            className="text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                            style={{ backgroundColor: producto.color_promocion || '#e74c3c' }}
                          >
                            -{producto.descuento_porcentaje}% OFF
                          </div>
                        </div>
                      )}
                      
                      {/* Etiqueta de promoción */}
                      {producto.etiqueta_promocion && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                          {producto.etiqueta_promocion}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                          {producto.marca_nombre}
                        </span>
                        {producto.tiene_stock && (
                          <span className="text-xs text-green-600 font-medium">✓ En Stock</span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg leading-tight">
                        {producto.nombre}
                      </h3>
                      
                      {/* Promoción activa */}
                      {producto.badge_promocion && (
                        <div className="mb-3 p-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                          <div className="text-xs font-medium text-red-700">{producto.badge_promocion}</div>
                          {producto.vigencia_promocion && (
                            <div className="text-xs text-red-600">{producto.vigencia_promocion}</div>
                          )}
                        </div>
                      )}
                      
                      {/* Precios */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatearPrecio(producto.precio_final || producto.precio)}
                          </span>
                          {producto.precio_original && producto.precio_original !== (producto.precio_final || producto.precio) && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatearPrecio(producto.precio_original)}
                            </span>
                          )}
                        </div>
                        {producto.ahorro_total > 0 && (
                          <div className="text-sm font-medium text-green-600">
                            💰 Ahorras {formatearPrecio(producto.ahorro_total)}
                          </div>
                        )}
                      </div>
                      
                      {/* Botones */}
                      <div className="space-y-2">
                        <button
                          onClick={() => manejarAgregarCarrito(producto)}
                          className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <ShoppingCartIcon className="h-5 w-5 mr-2" />
                          Agregar al carrito
                        </button>
                        
                        <Link
                          to={`/producto/${producto.id}`}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Ofertas;