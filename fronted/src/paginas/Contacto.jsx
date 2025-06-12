// ==========================================
// ARCHIVO: frontend/src/paginas/Contacto.jsx
// ==========================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../contexto/ContextoNotificacion';

const Contacto = () => {
  const { mostrarNotificacion } = useNotificacion();
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    asunto: '',
    mensaje: '',
    tipoConsulta: 'general'
  });

  const [enviando, setEnviando] = useState(false);

  // Información de contacto
  const infoContacto = [
    {
      icon: PhoneIcon,
      titulo: "Teléfono Principal",
      contenido: "(56) 2 2XXX XXXX",
      descripcion: "Lunes a Viernes 8:00 - 18:00 hrs",
      color: "text-blue-600"
    },
    {
      icon: EnvelopeIcon,
      titulo: "Email Comercial",
      contenido: "devferremas@gmail.com",
      descripcion: "Respuesta en 24 horas",
      color: "text-green-600"
    },
    {
      icon: MapPinIcon,
      titulo: "Dirección Principal",
      contenido: "Av. Industrial 1234, Santiago",
      descripcion: "Santiago Centro, Chile",
      color: "text-orange-600"
    },
    {
      icon: ClockIcon,
      titulo: "Horarios de Atención",
      contenido: "Lun-Vie: 8:00-18:00",
      descripcion: "Sáb: 9:00-14:00",
      color: "text-purple-600"
    }
  ];

  // Sucursales
  const sucursales = [
    {
      nombre: "FERREMAS La Florida",
      direccion: "Av. Vicuña Mackenna 7110, La Florida, Santiago",
      telefono: "(56) 2 2555 1111",
      horario: "Lun-Vie: 8:00-19:00, Sáb: 9:00-18:00, Dom: 10:00-16:00",
      servicios: ["Venta al por mayor", "Asesoría técnica", "Entrega a domicilio", "Estacionamiento gratuito"],
      mapsUrl: "https://www.google.com/maps/dir//Av.+Vicuña+Mackenna+7110,+La+Florida"
    },
    {
      nombre: "FERREMAS Las Condes",
      direccion: "Av. Apoquindo 4501, Las Condes, Santiago",
      telefono: "(56) 2 2555 2222",
      horario: "Lun-Vie: 8:30-19:30, Sáb: 9:00-18:00, Dom: 10:00-15:00",
      servicios: ["Venta retail", "Servicios premium", "Asesoría especializada", "Parking disponible"],
      mapsUrl: "https://www.google.com/maps/dir//Av.+Apoquindo+4501,+Las+Condes"
    },
    {
      nombre: "FERREMAS Maipú",
      direccion: "Av. Américo Vespucio 1501, Maipú, Santiago",
      telefono: "(56) 2 2555 3333",
      horario: "Lun-Vie: 8:00-18:30, Sáb: 9:00-17:00, Dom: 10:00-14:00",
      servicios: ["Bodega principal", "Retiro en sucursal", "Carga pesada", "Precios mayoristas"],
      mapsUrl: "https://www.google.com/maps/dir//Av.+Américo+Vespucio+1501,+Maipú"
    }
  ];

  // Departamentos
  const departamentos = [
    {
      icon: UserGroupIcon,
      titulo: "Ventas Corporativas",
      email: "devferremas@gmail.com",
      telefono: "(56) 2 2XXX 4444",
      descripcion: "Atención a constructoras y empresas"
    },
    {
      icon: TruckIcon,
      titulo: "Logística y Entregas",
      email: "devferremas@gmail.com",
      telefono: "(56) 2 2XXX 5555",
      descripcion: "Seguimiento de pedidos y entregas"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      titulo: "Soporte Técnico",
      email: "devferremas@gmail.com",
      telefono: "(56) 2 2XXX 6666",
      descripcion: "Asesoría especializada en productos"
    },
    {
      icon: BuildingOfficeIcon,
      titulo: "Administración",
      email: "devferremas@gmail.com",
      telefono: "(56) 2 2XXX 7777",
      descripcion: "Facturación y temas administrativos"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    // Crear el contenido del email
    const asunto = `[FERREMAS] ${formulario.tipoConsulta.toUpperCase()}: ${formulario.asunto}`;
    const cuerpo = `
Consulta desde página web FERREMAS
=====================================

DATOS DEL CONTACTO:
• Nombre: ${formulario.nombre}
• Email: ${formulario.email}
• Teléfono: ${formulario.telefono}
• Empresa: ${formulario.empresa || 'No especificada'}

TIPO DE CONSULTA: ${formulario.tipoConsulta.toUpperCase()}
ASUNTO: ${formulario.asunto}

MENSAJE:
${formulario.mensaje}

=====================================
Enviado desde: www.ferremas.cl
Fecha: ${new Date().toLocaleString('es-CL')}
    `.trim();

    // Crear enlace mailto
    const mailtoLink = `mailto:devferremas@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    
    // Simular envío y abrir cliente de email
    setTimeout(() => {
      setEnviando(false);
      
      // Abrir cliente de email
      window.location.href = mailtoLink;
      
      mostrarNotificacion('Abriendo cliente de email. El mensaje se ha preparado automáticamente.', 'success');
      
      // Limpiar formulario
      setFormulario({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        asunto: '',
        mensaje: '',
        tipoConsulta: 'general'
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarte con tus proyectos. Más de 40 años de experiencia 
              nos respaldan para brindarte la mejor asesoría y servicio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Información de Contacto Rápido */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {infoContacto.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <info.icon className={`h-12 w-12 ${info.color} mx-auto mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {info.titulo}
                </h3>
                <p className="text-lg font-medium text-gray-800 mb-1">
                  {info.contenido}
                </p>
                <p className="text-sm text-gray-600">
                  {info.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de Contacto y Mapa */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envíanos un Mensaje
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formulario.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formulario.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+56 9 XXXX XXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={formulario.empresa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Consulta
                  </label>
                  <select
                    name="tipoConsulta"
                    value={formulario.tipoConsulta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">Consulta General</option>
                    <option value="ventas">Ventas y Cotizaciones</option>
                    <option value="soporte">Soporte Técnico</option>
                    <option value="reclamo">Reclamo o Sugerencia</option>
                    <option value="corporativo">Ventas Corporativas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    required
                    value={formulario.asunto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Resumen de tu consulta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    required
                    rows="6"
                    value={formulario.mensaje}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe tu consulta o requerimiento..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                    enviando 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                  }`}
                >
                  {enviando ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckIcon className="h-5 w-5 mr-2" />
                      Enviar Mensaje
                    </div>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Mapa e Información */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Mapa */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0847687944995!2d-70.6692659!3d-33.4569402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5410425af2f%3A0x8475d53c400f0931!2sSodimac%20-%20Plaza%20Vespucio!5e0!3m2!1es!2scl!4v1697000000000!5m2!1es!2scl"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de ubicación FERREMAS"
                    className="absolute inset-0"
                  ></iframe>
                  {/* Overlay con información */}
                  <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center text-blue-600">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-semibold text-sm">FERREMAS</p>
                        <p className="text-xs text-gray-600">Sucursal Principal</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sucursal Principal FERREMAS
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <span className="inline-flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-orange-600" />
                      Av. Vicuña Mackenna 7110, La Florida, Santiago
                    </span>
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="inline-flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-blue-600" />
                      Lun-Vie: 8:00-19:00, Sáb: 9:00-18:00, Dom: 10:00-16:00
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <span className="flex items-center text-green-600">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Estacionamiento gratuito
                    </span>
                    <span className="flex items-center text-green-600">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Acceso carga pesada
                    </span>
                    <span className="flex items-center text-green-600">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Asesoría especializada
                    </span>
                    <span className="flex items-center text-green-600">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Retiro en tienda
                    </span>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/dir//Av.+Vicuña+Mackenna+7110,+La+Florida,+Región+Metropolitana/@-33.4569402,-70.6692659,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Cómo llegar
                    </a>
                    <a
                      href="tel:+56222XXXXXX"
                      className="flex items-center justify-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Llamar
                    </a>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Necesitas Ayuda Inmediata?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+56222XXXXXX"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <PhoneIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Mesa de Ayuda: (56) 2 2XXX 0000</span>
                  </a>
                  <div className="flex items-center text-green-600">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Chat en línea: 24/7</span>
                  </div>
                  <a
                    href="mailto:devferremas@gmail.com"
                    className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">devferremas@gmail.com</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departamentos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Departamentos
            </h2>
            <p className="text-xl text-gray-600">
              Contacta directamente al departamento que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departamentos.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <dept.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {dept.titulo}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {dept.descripcion}
                </p>
                <div className="space-y-2 text-sm">
                  <a 
                    href={`mailto:${dept.email}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {dept.email}
                  </a>
                  <a
                    href={`tel:${dept.telefono}`}
                    className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {dept.telefono}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sucursales */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Sucursales en Santiago
            </h2>
            <p className="text-xl text-gray-600">
              Visítanos en cualquiera de nuestras ubicaciones estratégicas
            </p>
          </div>

          {/* Mapa con múltiples ubicaciones */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d106530.84091787651!2d-70.7729379!3d-33.4724228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m1!1m0!5e0!3m2!1ses!2scl!4v1697000000000!5m2!1ses!2scl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sucursales FERREMAS en Santiago"
                  className="absolute inset-0"
                ></iframe>
                <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Red de Sucursales FERREMAS</h3>
                  <p className="text-xs text-gray-600">3 ubicaciones en Santiago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sucursales.map((sucursal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {sucursal.nombre}
                </h3>
                <div className="space-y-3 mb-4">
                  <p className="flex items-start text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 text-orange-600" />
                    {sucursal.direccion}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-2 text-blue-600" />
                    {sucursal.telefono}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                    {sucursal.horario}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Servicios:</h4>
                  <ul className="space-y-1 mb-4">
                    {sucursal.servicios.map((servicio, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                        {servicio}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={sucursal.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      Ir a Maps
                    </a>
                    <a
                      href={`tel:${sucursal.telefono}`}
                      className="flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium"
                    >
                      <PhoneIcon className="h-3 w-3 mr-1" />
                      Llamar
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              ¿Tienes un Proyecto Grande?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contacta a nuestro equipo comercial para cotizaciones especiales y asesoría personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+56222XXXXXX"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                Llamar Ahora
              </a>
              <a
                href="mailto:devferremas@gmail.com"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Email Comercial
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;