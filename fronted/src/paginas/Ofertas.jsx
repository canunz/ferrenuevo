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
        // Obtener todos los productos sin paginación (el backend ya aplica las promociones automáticamente)
        const res = await servicioProductos.obtenerTodos({ limit: 1000 }); // Obtener muchos productos
        let todosLosProductos = [];
        let productosConOferta = [];
        if (res.success && Array.isArray(res.data)) {
          todosLosProductos = res.data;
          productosConOferta = todosLosProductos.filter(p => p.tiene_promocion || (p.precio_oferta && parseFloat(p.precio_oferta) < parseFloat(p.precio)));

          // Calcular productos en oferta y estadísticas
          const mejorDescuento = productosConOferta.length > 0 
            ? Math.max(...productosConOferta.map(p => p.descuento_porcentaje || 0))
            : 0;
          const ahorroTotal = productosConOferta.reduce((total, p) => total + (p.ahorro_total || 0), 0);
          const porcentajeEnOferta = todosLosProductos.length > 0 
            ? Math.round((productosConOferta.length / todosLosProductos.length) * 100)
            : 0;
          setEstadisticas({
            productos_con_oferta: productosConOferta.length,
            mejor_descuento: mejorDescuento,
            ahorro_total_disponible: ahorroTotal,
            porcentaje_en_oferta: porcentajeEnOferta
          });
          setProductos(productosConOferta); // Solo productos en oferta para el resto de la página
        } else {
          setProductos([]);
          setEstadisticas({});
        }

        // Cargar marcas
        const marcasData = await servicioProductos.obtenerMarcas();
        setMarcas([{ id: 'todas', nombre: 'Todas las Marcas' }, ...(marcasData.data || [])]);

        // Calcular rangos de precio de todos los productos en oferta
        if (productosConOferta && productosConOferta.length > 0) {
          const preciosFinales = productosConOferta.map(p => parseFloat(p.precio_oferta) || parseFloat(p.precio));
          const minPrecio = Math.min(...preciosFinales);
          const maxPrecio = Math.max(...preciosFinales);
          setPrecioMin(minPrecio);
          setPrecioMax(maxPrecio);
          setFiltroPrecioMin(minPrecio);
          setFiltroPrecioMax(maxPrecio);
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

  // Filtrar productos en oferta según búsqueda, marca y precio
  let productosFiltrados = productos.filter(producto => {
    const precioFinal = parseFloat(producto.precio_oferta) || parseFloat(producto.precio);
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca_nombre?.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleMarca = marcaSeleccionada === 'todas' || 
      producto.marca_id === marcaSeleccionada ||
      producto.marca_nombre === marcaSeleccionada;
    // Si los filtros de precio están vacíos o iguales, no filtrar por precio
    const sinFiltroPrecio = !filtroPrecioMin && !filtroPrecioMax;
    const rangoIgual = filtroPrecioMin === filtroPrecioMax;
    const cumplePrecio = sinFiltroPrecio || rangoIgual || (precioFinal >= filtroPrecioMin && precioFinal <= filtroPrecioMax);
    return cumpleBusqueda && cumpleMarca && cumplePrecio;
  });

  // Ordenar productos
  productosFiltrados = [...productosFiltrados].sort((a, b) => {
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
  const productosPorCategoria = productosFiltrados.reduce((acc, prod) => {
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

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando ofertas...</p>
        </div>
      </div>
    );
  }

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
                  <div className="text-2xl font-bold">{estadisticas.productos_con_oferta || 0}</div>
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
                <option value="precio-asc">Precio Menor</option>
                <option value="precio-desc">Precio Mayor</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-lg font-bold text-red-600">{productosFiltrados.length} productos</p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="space-y-8">
          {Object.entries(productosPorCategoria).map(([categoria, productos]) => (
            <div key={categoria} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TagIcon className="w-6 h-6" />
                  {categoria}
                </h2>
                <p className="text-sm opacity-90">{productos.length} productos</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productos.map(producto => (
                    <div key={producto.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Badge de oferta */}
                      {producto.tiene_promocion && (
                        <div className="relative">
                          <div 
                            className="absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white rounded"
                            style={{ backgroundColor: producto.color_promocion || '#e74c3c' }}
                          >
                            -{producto.descuento_porcentaje}% OFF
                          </div>
                          <div 
                            className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold text-white rounded"
                            style={{ backgroundColor: producto.color_promocion || '#e74c3c' }}
                          >
                            {producto.etiqueta_promocion}
                          </div>
                        </div>
                      )}
                      
                      {/* Imagen del producto */}
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {producto.imagen_url ? (
                          <img 
                            src={producto.imagen_url} 
                            alt={producto.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <TagIcon className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Sin imagen</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Información del producto */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {producto.nombre}
                        </h3>
                        
                        {producto.tiene_promocion && (
                          <div className="mb-2">
                            <p className="text-xs text-gray-600 mb-1">{producto.badge_promocion}</p>
                            <p className="text-xs text-gray-500">{producto.vigencia_promocion}</p>
                          </div>
                        )}
                        {/* Stock */}
                        {(() => {
                          let stockTotal = 0;
                          if (Array.isArray(producto.inventario) && producto.inventario.length > 0) {
                            stockTotal = producto.inventario.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
                          } else if (typeof producto.stock_actual === 'number') {
                            stockTotal = producto.stock_actual;
                          }
                          return stockTotal > 0 ? (
                            <div className="text-green-600 text-xs font-semibold mb-2">✓ Stock: {stockTotal}</div>
                          ) : (
                            <div className="text-red-600 text-xs font-semibold mb-2">✗ Agotado</div>
                          );
                        })()}
                        {/* Precios */}
                        <div className="mb-3">
                          {producto.tiene_promocion ? (
                            <>
                              <p className="text-lg font-bold text-red-600">
                                {formatearPrecio(producto.precio_final)}
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {formatearPrecio(producto.precio_original)}
                              </p>
                              <p className="text-xs text-green-600 font-medium">
                                💰 Ahorras {formatearPrecio(producto.ahorro_total)}
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-gray-900">
                              {formatearPrecio(producto.precio)}
                            </p>
                          )}
                        </div>
                        
                        {/* Botones */}
                        <div className="flex gap-2">
                          {(() => {
                            let stockTotal = 0;
                            if (Array.isArray(producto.inventario) && producto.inventario.length > 0) {
                              stockTotal = producto.inventario.reduce((sum, inv) => sum + (inv.stock_actual || 0), 0);
                            } else if (typeof producto.stock_actual === 'number') {
                              stockTotal = producto.stock_actual;
                            }
                            return (
                              <button
                                onClick={() => manejarAgregarCarrito(producto)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors ${stockTotal > 0 ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                                disabled={stockTotal === 0}
                              >
                                <ShoppingCartIcon className="w-4 h-4" />
                                Agregar al carrito
                              </button>
                            );
                          })()}
                          <Link
                            to={`/productos/${producto.id}`}
                            className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                          >
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay productos */}
        {productosFiltrados.length === 0 && !cargando && (
          <div className="text-center py-12">
            <FireIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ofertas;