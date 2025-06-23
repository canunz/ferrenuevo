import React, { useEffect, useState } from 'react';
import { servicioProductos } from '../servicios/servicioProductos';
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useCarrito } from '../contexto/ContextoCarrito';
import { useNotificacion } from '../contexto/ContextoNotificacion';

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('todas');
  const [ordenamiento, setOrdenamiento] = useState('destacados');
  const [cargando, setCargando] = useState(true);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(0);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState('todas');
  const { agregarItem } = useCarrito();
  const { mostrarNotificacion } = useNotificacion();

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const res = await servicioProductos.obtenerTodos();
        const productosBD = res.data?.productos || [];
        setProductos(productosBD);
        const marcasData = await servicioProductos.obtenerMarcas();
        setMarcas([{ id: 'todas', nombre: 'Todas' }, ...(marcasData.data || [])]);
        // Calcular precios mínimo y máximo reales de productos en oferta
        const ofertas = productosBD.filter(p => p.precioAnterior || (p.etiquetas && p.etiquetas.length > 0));
        if (ofertas.length > 0) {
          const precios = ofertas.map(p => p.precio);
          setPrecioMin(Math.min(...precios));
          setPrecioMax(Math.max(...precios));
          setFiltroPrecioMin(Math.min(...precios));
          setFiltroPrecioMax(Math.max(...precios));
        }
        // Obtener etiquetas únicas
        const etiquetasUnicas = Array.from(new Set(ofertas.flatMap(p => p.etiquetas || [])));
        setEtiquetas(['todas', ...etiquetasUnicas]);
      } catch (e) {
        setProductos([]);
        setMarcas([{ id: 'todas', nombre: 'Todas' }]);
        setPrecioMin(0);
        setPrecioMax(0);
        setFiltroPrecioMin('');
        setFiltroPrecioMax('');
        setEtiquetas(['todas']);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Filtrar solo productos en oferta
  let productosEnOferta = productos.filter(
    p => (p.precio_anterior && p.precio_anterior > p.precio) || 
         (typeof p.etiquetas === 'string' && p.etiquetas.includes('Promoción')) ||
         (Array.isArray(p.etiquetas) && p.etiquetas.includes('Promoción'))
  );

  // Filtros de búsqueda, marca, precio y etiqueta
  productosEnOferta = productosEnOferta.filter(producto => {
    const cumpleBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.marca?.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
    const cumpleMarca = marcaSeleccionada === 'todas' || producto.marca?.id === marcaSeleccionada;
    const cumplePrecio = (!filtroPrecioMin || producto.precio >= filtroPrecioMin) && (!filtroPrecioMax || producto.precio <= filtroPrecioMax);
    const cumpleEtiqueta = etiquetaSeleccionada === 'todas' || 
      (typeof producto.etiquetas === 'string' && producto.etiquetas.includes(etiquetaSeleccionada)) ||
      (Array.isArray(producto.etiquetas) && producto.etiquetas.includes(etiquetaSeleccionada));
    return cumpleBusqueda && cumpleMarca && cumplePrecio && cumpleEtiqueta;
  });

  // Ordenar productos
  productosEnOferta = [...productosEnOferta].sort((a, b) => {
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

  // Agrupar por categoría
  const productosPorCategoria = productosEnOferta.reduce((acc, prod) => {
    const cat = prod.categoria?.nombre || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {});

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(precio);
  };

  const manejarAgregarCarrito = (producto) => {
    agregarItem(producto);
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-10 drop-shadow">Ofertas Especiales</h1>
        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-white p-6 rounded-lg shadow flex-wrap">
          <div className="relative w-full md:w-1/4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos, marcas..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <select
            value={marcaSeleccionada}
            onChange={e => setMarcaSeleccionada(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            {marcas.map(marca => (
              <option key={marca.id} value={marca.id}>{marca.nombre}</option>
            ))}
          </select>
          {/* Filtro de precio */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={precioMin}
              max={precioMax}
              value={filtroPrecioMin}
              onChange={e => setFiltroPrecioMin(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Mín"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              min={precioMin}
              max={precioMax}
              value={filtroPrecioMax}
              onChange={e => setFiltroPrecioMax(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Máx"
            />
          </div>
          {/* Filtro de etiqueta */}
          <select
            value={etiquetaSeleccionada}
            onChange={e => setEtiquetaSeleccionada(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            {etiquetas.map(et => (
              <option key={et} value={et}>{et === 'todas' ? 'Todas las Promociones' : et}</option>
            ))}
          </select>
          <select
            value={ordenamiento}
            onChange={e => setOrdenamiento(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="destacados">Destacados</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
        {cargando ? (
          <div className="text-center py-20 text-gray-500">Cargando ofertas...</div>
        ) : productosEnOferta.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No hay productos en oferta actualmente.</div>
        ) : (
          Object.entries(productosPorCategoria).map(([categoria, productos]) => (
            <div key={categoria} className="mb-12">
              <h2 className="text-2xl font-bold text-orange-600 mb-6 border-l-4 border-orange-400 pl-3 drop-shadow">{categoria}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productos.map(producto => (
                  <div key={producto.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-orange-100">
                    <div className="relative">
                      <img
                        src={producto.imagen ? `/assets/imagenes/productos/${producto.imagen}` : '/assets/imagenes/productos/Sierrabosch.jpg'}
                        alt={producto.nombre}
                        className="w-full h-48 object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow">OFERTA</div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">{producto.marca?.nombre}</span>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">{producto.nombre}</h3>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">{formatearPrecio(producto.precio)}</span>
                          {producto.precioAnterior && (
                            <span className="text-sm text-gray-500 line-through">{formatearPrecio(producto.precioAnterior)}</span>
                          )}
                        </div>
                        {producto.precioAnterior && (
                          <span className="text-sm text-green-600 font-medium">Ahorra {formatearPrecio(producto.precioAnterior - producto.precio)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => manejarAgregarCarrito(producto)}
                        className="w-full flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors bg-red-600 text-white hover:bg-red-700 shadow"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Agregar al carrito
                      </button>
                      <Link
                        to={`/producto/${producto.id}`}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors mt-2"
                      >
                        Ver detalles
                      </Link>
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