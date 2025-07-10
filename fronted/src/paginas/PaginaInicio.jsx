// ==========================================
// ARCHIVO: frontend/src/paginas/PaginaInicio.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { obtenerImagenProducto } from '../utilidades/ayudantes';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PhoneIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
  HomeModernIcon,
  PaintBrushIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useCarrito } from '../contexto/ContextoCarrito';
import { useNotificacion } from '../contexto/ContextoNotificacion';
import { servicioProductos } from '../servicios/servicioProductos';

const PaginaInicio = () => {
  const { agregarItem } = useCarrito();
  const { mostrarNotificacion } = useNotificacion();
  
  const [bannerActual, setBannerActual] = useState(0);
  const [testimonioActual, setTestimonioActual] = useState(0);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [cargandoDestacados, setCargandoDestacados] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [cargandoMarcas, setCargandoMarcas] = useState(true);

  // Hero Banners
  const banners = [
    {
      id: 1,
      titulo: "FERREMAS",
      subtitulo: "Tu ferretería de confianza desde 1985",
      descripcion: "Más de 10,000 productos para construcción, herramientas profesionales y todo lo que necesitas para tus proyectos",
      imagen: "/assets/imagenes/banner/ferremas-hero-1.jpg",
      boton: "Ver Catálogo",
      enlace: "/catalogo"
    },
    {
      id: 2,
      titulo: "Herramientas Profesionales",
      subtitulo: "Las mejores marcas del mercado",
      descripcion: "BOSCH, MAKITA, STANLEY, DeWALT y más. Calidad garantizada para profesionales y aficionados",
      imagen: "/assets/imagenes/banner/ferremas-hero-2.jpg",
      boton: "Ver Herramientas",
      enlace: "/catalogo?categoria=herramientas"
    },
    {
      id: 3,
      titulo: "Materiales de Construcción",
      subtitulo: "Todo para tu obra",
      descripcion: "Cemento, fierro, maderas, pinturas y más. Precios mayoristas y entregas a obra",
      imagen: "/assets/imagenes/banner/ferremas-hero-3.jpg",
      boton: "Ver Materiales",
      enlace: "/catalogo?categoria=materiales"
    }
  ];

  // Categorías principales
  const categoriasPrincipales = [
    {
      id: 1,
      nombre: "Herramientas Eléctricas",
      descripcion: "Taladros, sierras, lijadoras y más",
      imagen: "/assets/imagenes/categorias/herramientas-electricas.jpg",
      icon: WrenchScrewdriverIcon,
      color: "bg-blue-500"
    },
    {
      id: 2,
      nombre: "Materiales de Construcción",
      descripcion: "Cemento, fierro, ladrillos",
      imagen: "/assets/imagenes/categorias/materiales-construccion.jpg",
      icon: HomeModernIcon,
      color: "bg-orange-500"
    },
    {
      id: 3,
      nombre: "Pinturas y Barnices",
      descripcion: "Pinturas, barnices, brochas",
      imagen: "/assets/imagenes/categorias/pinturas-barnices.jpg",
      icon: PaintBrushIcon,
      color: "bg-green-500"
    },
    {
      id: 4,
      nombre: "Ferretería",
      descripcion: "Tornillos, clavos, bisagras",
      imagen: "/assets/imagenes/categorias/ferreteria.jpg",
      icon: WrenchScrewdriverIcon,
      color: "bg-purple-500"
    },
    {
      id: 5,
      nombre: "Plomería",
      descripcion: "Tuberías, grifería, accesorios",
      imagen: "/assets/imagenes/categorias/plomeria.jpg",
      icon: WrenchScrewdriverIcon,
      color: "bg-blue-600"
    },
    {
      id: 6,
      nombre: "Electricidad",
      descripcion: "Cables, enchufes, interruptores",
      imagen: "/assets/imagenes/categorias/electricidad.jpg",
      icon: WrenchScrewdriverIcon,
      color: "bg-yellow-500"
    }
  ];

  // Testimonios genéricos sin nombres específicos
  const testimonios = [
    {
      id: 1,
      nombre: "Cliente Satisfecho",
      cargo: "Cliente",
      texto: "Excelente servicio y productos de calidad. Las herramientas son duraderas y el personal muy atento.",
      avatar: "/assets/imagenes/testimonios/default-avatar.png"
    },
    {
      id: 2,
      nombre: "Cliente Fiel",
      cargo: "Cliente",
      texto: "La mejor ferretería de la zona. Siempre tienen lo que necesito y los precios son muy competitivos.",
      avatar: "/assets/imagenes/testimonios/default-avatar.png"
    },
    {
      id: 3,
      nombre: "Cliente Regular",
      cargo: "Cliente",
      texto: "He trabajado con FERREMAS por años y nunca me han fallado. Su servicio post-venta es excepcional.",
      avatar: "/assets/imagenes/testimonios/default-avatar.png"
    }
  ];

  // Beneficios
  const beneficios = [
    {
      icon: TruckIcon,
      titulo: "Envío Gratis",
      descripcion: "En compras sobre $50.000 en RM",
      color: "text-blue-600"
    },
    {
      icon: ShieldCheckIcon,
      titulo: "Garantía Extendida",
      descripcion: "Hasta 3 años en herramientas",
      color: "text-green-600"
    },
    {
      icon: CreditCardIcon,
      titulo: "Múltiples Pagos",
      descripcion: "Tarjetas, transferencia, cuotas",
      color: "text-purple-600"
    },
    {
      icon: PhoneIcon,
      titulo: "Asesoría Técnica",
      descripcion: "Expertos disponibles 24/7",
      color: "text-orange-600"
    }
  ];

  // Efectos
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonioActual((prev) => (prev + 1) % testimonios.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonios.length]);

  useEffect(() => {
    const cargarDestacados = async () => {
      setCargandoDestacados(true);
      try {
        const res = await servicioProductos.obtenerTodos();
        let productos = res.data?.productos || [];
        // Mostrar siempre los primeros 4 productos activos
        let destacados = productos.slice(0, 4);
        setProductosDestacados(destacados);
      } catch (e) {
        setProductosDestacados([]);
      } finally {
        setCargandoDestacados(false);
      }
    };
    cargarDestacados();
  }, []);

  useEffect(() => {
    const cargarMarcas = async () => {
      setCargandoMarcas(true);
      try {
        const res = await servicioProductos.obtenerMarcas();
        setMarcas(res.data || []);
      } catch (e) {
        setMarcas([]);
      } finally {
        setCargandoMarcas(false);
      }
    };
    cargarMarcas();
  }, []);

  // Funciones
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const renderEstrellas = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const manejarAgregarCarrito = (producto) => {
    agregarItem(producto);
    mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerActual}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banners[bannerActual]?.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-bold text-white mb-4"
                  >
                    {banners[bannerActual]?.titulo}
                  </motion.h1>
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl text-orange-400 font-semibold mb-6"
                  >
                    {banners[bannerActual]?.subtitulo}
                  </motion.h2>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xl text-gray-200 mb-8 leading-relaxed"
                  >
                    {banners[bannerActual]?.descripcion}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      to={banners[bannerActual]?.enlace || "/catalogo"}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 inline-flex items-center"
                    >
                      {banners[bannerActual]?.boton}
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                    <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-flex items-center">
                      <PlayIcon className="mr-2 h-5 w-5" />
                      Ver Video
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controles del banner */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerActual(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === bannerActual 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 right-8 text-white animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll</span>
            <div className="w-0.5 h-8 bg-white opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <beneficio.icon className={`h-12 w-12 ${beneficio.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600">{beneficio.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías Principales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra todo lo que necesitas para tus proyectos de construcción, 
              reparación y mejoramiento del hogar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriasPrincipales.map((categoria, index) => (
              <motion.div
                key={categoria.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="h-64 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${categoria.imagen})`
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className={`w-12 h-12 ${categoria.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <categoria.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{categoria.nombre}</h3>
                    <p className="text-gray-200 mb-4">{categoria.descripcion}</p>
                    <Link
                      to={`/catalogo?categoria=${categoria.id}`}
                      className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      Ver productos
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Marcas</h2>
            <p className="text-lg text-gray-600">Trabajamos con las mejores marcas del mercado</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-center">
            {cargandoMarcas ? (
              <div className="col-span-5 text-center py-8 text-gray-400">Cargando marcas...</div>
            ) : marcas.length === 0 ? (
              <div className="col-span-5 text-center py-8 text-gray-400">No hay marcas registradas.</div>
            ) : (
              marcas.map((marca) => (
                <div key={marca.id} className="flex flex-col items-center">
                  <img
                    src={`/assets/imagenes/marcas/${marca.nombre.toLowerCase().replace(/ /g, '_')}.png`}
                    alt={marca.nombre}
                    className="h-16 w-auto object-contain mb-2"
                    onError={(e) => { e.target.src = '/assets/imagenes/marcas/placeholder.png'; }}
                  />
                  <span className="text-sm text-gray-700 font-medium">{marca.nombre}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Las mejores ofertas y productos más populares de la semana
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cargandoDestacados ? (
              <div className="col-span-4 text-center py-12 text-gray-400">Cargando productos destacados...</div>
            ) : productosDestacados.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-400">No hay productos destacados actualmente.</div>
            ) : (
              productosDestacados.map((producto, index) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                      src={obtenerImagenProducto(producto.imagen)}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = obtenerImagenProducto('placeholder.jpg');
                    }}
                  />
                    {producto.etiquetas && producto.etiquetas.includes('Promoción') && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      OFERTA
                    </div>
                  )}
                    {producto.etiquetas && producto.etiquetas.includes('Destacado') && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded text-xs font-semibold">
                        DESTACADO
                      </div>
                    )}
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 font-medium">
                        {producto.marca?.nombre || producto.marca}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {renderEstrellas(producto.rating)}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      ({producto.reviews})
                    </span>
                  </div>
                  {/* Precio */}
                  <div className="mb-3">
                    {producto.precioAnterior && (
                      <span className="text-sm text-gray-500 line-through mr-2">
                        {formatearPrecio(producto.precioAnterior)}
                      </span>
                    )}
                    <span className="text-lg font-bold text-gray-900">
                      {formatearPrecio(producto.precio)}
                    </span>
                    {producto.precioAnterior && (
                      <span className="text-sm text-green-600 font-medium ml-2">
                        {Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  {/* Botón agregar al carrito */}
                  <button
                    onClick={() => manejarAgregarCarrito(producto)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Agregar al Carrito
                  </button>
                </div>
              </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/catalogo"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Ver Todos los Productos
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-blue-200">
              Más de 40 años construyendo confianza
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonioActual}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-8">
                  <img
                    src={testimonios[testimonioActual]?.avatar}
                    alt={testimonios[testimonioActual]?.nombre}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div className="flex justify-center mb-4">
                    {renderEstrellas(testimonios[testimonioActual]?.rating)}
                  </div>
                </div>
                
                <blockquote className="text-xl italic mb-6 text-blue-100">
                  "{testimonios[testimonioActual]?.texto}"
                </blockquote>
                
                <div>
                  <p className="font-semibold text-lg">
                    {testimonios[testimonioActual]?.nombre}
                  </p>
                  <p className="text-blue-300">
                    {testimonios[testimonioActual]?.cargo}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controles de testimonios */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonioActual(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === testimonioActual ? 'bg-orange-500' : 'bg-blue-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Llamada a la Acción */}
      <section className="py-20 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para tu próximo proyecto?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Encuentra todo lo que necesitas en FERREMAS. Asesoría experta, 
              mejores precios y entregas rápidas en toda la Región Metropolitana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalogo"
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Explorar Catálogo
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contacto"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                Contactar Asesor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PaginaInicio;