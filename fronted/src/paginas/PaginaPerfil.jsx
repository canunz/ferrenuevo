import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  LockClosedIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  HomeIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { servicioClientes } from '../servicios/servicioClientes';
import { servicioAuth } from '../servicios/servicioAuth';

const PaginaPerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordNueva, setMostrarPasswordNueva] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('datos'); // 'datos', 'direccion', 'seguridad'
  
  // Formulario de datos personales
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: '',
    email: '',
    telefono: '',
    rut: ''
  });

  // Formulario de cambio de contraseña
  const [cambioPassword, setCambioPassword] = useState({
    password_actual: '',
    password_nueva: '',
    password_confirmar: ''
  });

  // Formulario de dirección de envío
  const [direccionEnvio, setDireccionEnvio] = useState({
    calle: '',
    numero: '',
    departamento: '',
    comuna: '',
    ciudad: '',
    codigo_postal: '',
    instrucciones: ''
  });

  // Cargar datos del usuario y cliente
  const cargarDatosUsuario = async () => {
    try {
      setCargando(true);
      setError(null);
      // 1. Obtener perfil del usuario autenticado
      const perfil = await servicioAuth.obtenerPerfil();
      if (perfil && perfil.data) {
        setUsuario(perfil.data);
        setDatosPersonales((prev) => ({
          ...prev,
          nombre: perfil.data.nombre || '',
          email: perfil.data.email || ''
        }));
        // 2. Intentar obtener datos de cliente (si existe)
        try {
          const cliente = await servicioClientes.obtenerPorId(perfil.data.id);
          setClienteId(cliente.id);
          setDatosPersonales({
            nombre: cliente.nombre || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            rut: cliente.rut || ''
          });
          // 3. Obtener dirección de envío
          try {
            const direccion = await servicioClientes.obtenerDireccionEnvio(cliente.id);
            if (direccion) {
              setDireccionEnvio({
                calle: direccion.direccion || '',
                numero: direccion.numero || '',
                departamento: direccion.depto_oficina || '',
                comuna: direccion.comuna || '',
                ciudad: direccion.ciudad || '',
                region: direccion.region || '',
                nombre_receptor: direccion.nombre_receptor || '',
                codigo_postal: direccion.codigo_postal || '',
                instrucciones: direccion.instrucciones_entrega || ''
              });
            }
          } catch (e) {
            // No hay dirección, no hacer nada
          }
        } catch (e) {
          // No es cliente, solo usuario
        }
      }
    } catch (err) {
      setError('Error al cargar datos del usuario: ' + (err.message || err));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosUsuario();
    // eslint-disable-next-line
  }, []);

  // Guardar datos personales
  const guardarDatosPersonales = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(null);
    try {
      // Solo enviar el campo telefono si el usuario es cliente
      let datosParaActualizar;
      if (usuario?.rol === 'cliente') {
        datosParaActualizar = { telefono: datosPersonales.telefono };
      } else {
        datosParaActualizar = { ...datosPersonales };
      }
      if (clienteId) {
        await servicioClientes.actualizar(clienteId, datosParaActualizar);
        setExito('Datos personales actualizados correctamente');
      } else if (usuario?.id) {
        await servicioAuth.actualizarPerfil({
          nombre: datosPersonales.nombre,
          email: datosPersonales.email
        });
        setExito('Datos personales actualizados correctamente');
      } else {
        setError('No se pudo identificar el usuario.');
      }
    } catch (err) {
      setError('Error al actualizar datos: ' + (err.message || err));
    } finally {
      setGuardando(false);
    }
  };

  // Cambiar contraseña
  const cambiarPassword = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(null);
    
    try {
      // Validaciones del frontend
      if (!cambioPassword.password_actual) {
        throw new Error('Debes ingresar tu contraseña actual');
      }
      
      if (!cambioPassword.password_nueva) {
        throw new Error('Debes ingresar una nueva contraseña');
      }
      
      if (cambioPassword.password_nueva.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }
      
      if (cambioPassword.password_nueva !== cambioPassword.password_confirmar) {
        throw new Error('Las contraseñas no coinciden');
      }
      
      if (cambioPassword.password_actual === cambioPassword.password_nueva) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }

      console.log('🔄 Enviando solicitud de cambio de contraseña...');
      
      const response = await servicioAuth.cambiarPassword({
        password_actual: cambioPassword.password_actual,
        password_nueva: cambioPassword.password_nueva
      });
      
      console.log('✅ Respuesta del servidor:', response);
      
      if (response && response.success) {
        setExito('¡Contraseña cambiada exitosamente! Tu nueva contraseña ya está activa.');
        // Limpiar formulario
        setCambioPassword({
          password_actual: '',
          password_nueva: '',
          password_confirmar: ''
        });
        setMostrarPassword(false);
        setMostrarPasswordNueva(false);
      } else {
        throw new Error(response?.error || 'Error al cambiar contraseña');
      }
      
    } catch (err) {
      console.error('❌ Error al cambiar contraseña:', err);
      
      // Manejar errores específicos del backend
      if (err.response) {
        const errorData = err.response.data;
        if (errorData && errorData.error) {
          setError(errorData.error);
        } else if (errorData && errorData.message) {
          setError(errorData.message);
        } else {
          setError('Error al cambiar contraseña. Verifica tu contraseña actual.');
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error al cambiar contraseña. Intenta nuevamente.');
      }
    } finally {
      setGuardando(false);
    }
  };

  // Guardar dirección de envío
  const guardarDireccionEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    setExito(null);
    try {
      const idParaDireccion = clienteId || usuario?.id;
      // Validar campos obligatorios
      if (!direccionEnvio.nombre_receptor || !direccionEnvio.calle || !direccionEnvio.region) {
        alert('Completa todos los campos obligatorios de la dirección: Nombre del Receptor, Dirección y Región.');
        setGuardando(false);
        return;
      }
      // Mapear los campos del frontend a los del backend
      const direccionEnvioBackend = {
        nombre_receptor: direccionEnvio.nombre_receptor,
        direccion: direccionEnvio.calle,
        numero: direccionEnvio.numero,
        depto_oficina: direccionEnvio.departamento,
        comuna: direccionEnvio.comuna,
        ciudad: direccionEnvio.ciudad,
        region: direccionEnvio.region,
        codigo_postal: direccionEnvio.codigo_postal,
        instrucciones_entrega: direccionEnvio.instrucciones
      };
      console.log('Datos a enviar:', direccionEnvioBackend);
      if (idParaDireccion && direccionEnvio.calle) {
        await servicioClientes.actualizarDireccionEnvio(idParaDireccion, direccionEnvioBackend);
        setExito('Dirección de envío actualizada correctamente');
      } else {
        setError('No se puede guardar dirección: usuario no identificado');
      }
    } catch (err) {
      setError('Error al actualizar dirección: ' + (err.message || err));
    } finally {
      setGuardando(false);
    }
  };

  // Handler para actualizar el estado de la dirección de envío
  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccionEnvio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Cargando tu perfil...</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Preparando tu información personal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        {/* Encabezado mejorado */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Gestiona tu información personal, seguridad y preferencias de envío de manera segura
          </p>
        </div>

        {/* Navegación de secciones */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => setSeccionActiva('datos')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                seccionActiva === 'datos'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Datos Personales
            </button>
            <button
              onClick={() => setSeccionActiva('direccion')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                seccionActiva === 'direccion'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <MapPinIcon className="w-5 h-5" />
              Dirección
            </button>
            <button
              onClick={() => setSeccionActiva('seguridad')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                seccionActiva === 'seguridad'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <KeyIcon className="w-5 h-5" />
              Seguridad
            </button>
          </div>
        </div>

        {/* Mensajes de estado mejorados */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-400 rounded-lg p-6 flex items-start gap-4 shadow-lg"
          >
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {exito && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-l-4 border-green-400 rounded-lg p-6 flex items-start gap-4 shadow-lg"
          >
            <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-800 font-medium">¡Éxito!</h3>
              <p className="text-green-700 mt-1">{exito}</p>
            </div>
          </motion.div>
        )}

        {/* Contenido de secciones */}
        <motion.div
          key={seccionActiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {seccionActiva === 'datos' && (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Datos Personales
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={guardarDatosPersonales} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-blue-600" />
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          value={datosPersonales.nombre}
                          onChange={(e) => setDatosPersonales({...datosPersonales, nombre: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Ingresa tu nombre completo"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-green-600" />
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={datosPersonales.email}
                          onChange={(e) => setDatosPersonales({...datosPersonales, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-purple-600" />
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            value={datosPersonales.telefono}
                            onChange={(e) => setDatosPersonales({...datosPersonales, telefono: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                            placeholder="+56 9 1234 5678"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <IdentificationIcon className="w-4 h-4 text-orange-600" />
                            RUT
                          </label>
                          <input
                            type="text"
                            value={datosPersonales.rut}
                            onChange={(e) => setDatosPersonales({...datosPersonales, rut: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                            placeholder="12.345.678-9"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={guardando}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {guardando ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Guardando...
                        </div>
                      ) : (
                        'Guardar Datos Personales'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {seccionActiva === 'direccion' && (
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MapPinIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Dirección de Envío
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={guardarDireccionEnvio} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-purple-600" />
                          Nombre del Receptor *
                        </label>
                        <input
                          type="text"
                          name="nombre_receptor"
                          value={direccionEnvio.nombre_receptor}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Nombre completo del receptor"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <GlobeAltIcon className="w-4 h-4 text-blue-600" />
                          Región *
                        </label>
                        <input
                          type="text"
                          name="region"
                          value={direccionEnvio.region}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Ej: Metropolitana"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <HomeIcon className="w-4 h-4 text-green-600" />
                          Calle *
                        </label>
                        <input
                          type="text"
                          name="calle"
                          value={direccionEnvio.calle}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Nombre de la calle"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <BuildingOfficeIcon className="w-4 h-4 text-orange-600" />
                          Número
                        </label>
                        <input
                          type="text"
                          name="numero"
                          value={direccionEnvio.numero}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="123"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <BuildingOfficeIcon className="w-4 h-4 text-indigo-600" />
                          Departamento
                        </label>
                        <input
                          type="text"
                          name="departamento"
                          value={direccionEnvio.departamento}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Depto 45"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-red-600" />
                          Comuna
                        </label>
                        <input
                          type="text"
                          name="comuna"
                          value={direccionEnvio.comuna}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Providencia"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <GlobeAltIcon className="w-4 h-4 text-teal-600" />
                          Ciudad
                        </label>
                        <input
                          type="text"
                          name="ciudad"
                          value={direccionEnvio.ciudad}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Santiago"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <DocumentTextIcon className="w-4 h-4 text-gray-600" />
                          Código Postal
                        </label>
                        <input
                          type="text"
                          name="codigo_postal"
                          value={direccionEnvio.codigo_postal}
                          onChange={handleDireccionChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="8320000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4 text-purple-600" />
                        Instrucciones Adicionales
                      </label>
                      <textarea
                        name="instrucciones"
                        value={direccionEnvio.instrucciones}
                        onChange={handleDireccionChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                        rows="3"
                        placeholder="Instrucciones especiales para la entrega (opcional)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={guardando}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      {guardando ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Guardando...
                        </div>
                      ) : (
                        'Guardar Dirección de Envío'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {seccionActiva === 'seguridad' && (
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      Seguridad y Contraseña
                    </h2>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                        <ShieldCheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Información de Seguridad</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Para cambiar tu contraseña, asegúrate de recordar tu contraseña actual. 
                          La nueva contraseña debe tener al menos 6 caracteres y ser diferente a la actual.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={cambiarPassword} className="space-y-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <LockClosedIcon className="w-4 h-4 text-red-600" />
                          Contraseña Actual *
                        </label>
                        <div className="relative">
                          <input
                            type={mostrarPassword ? "text" : "password"}
                            value={cambioPassword.password_actual}
                            onChange={(e) => setCambioPassword({...cambioPassword, password_actual: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 pr-12"
                            placeholder="Ingresa tu contraseña actual"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {mostrarPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <LockClosedIcon className="w-4 h-4 text-green-600" />
                          Nueva Contraseña *
                        </label>
                        <div className="relative">
                          <input
                            type={mostrarPasswordNueva ? "text" : "password"}
                            value={cambioPassword.password_nueva}
                            onChange={(e) => setCambioPassword({...cambioPassword, password_nueva: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 pr-12"
                            placeholder="Mínimo 6 caracteres"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setMostrarPasswordNueva(!mostrarPasswordNueva)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {mostrarPasswordNueva ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {cambioPassword.password_nueva && (
                          <div className="mt-2 space-y-1">
                            <div className={`flex items-center gap-2 text-sm ${cambioPassword.password_nueva.length >= 6 ? 'text-green-600' : 'text-red-500'}`}>
                              <div className={`w-2 h-2 rounded-full ${cambioPassword.password_nueva.length >= 6 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              Mínimo 6 caracteres
                            </div>
                            {cambioPassword.password_actual && (
                              <div className={`flex items-center gap-2 text-sm ${cambioPassword.password_actual !== cambioPassword.password_nueva ? 'text-green-600' : 'text-red-500'}`}>
                                <div className={`w-2 h-2 rounded-full ${cambioPassword.password_actual !== cambioPassword.password_nueva ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                Diferente a la contraseña actual
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <LockClosedIcon className="w-4 h-4 text-blue-600" />
                          Confirmar Nueva Contraseña *
                        </label>
                        <input
                          type="password"
                          value={cambioPassword.password_confirmar}
                          onChange={(e) => setCambioPassword({...cambioPassword, password_confirmar: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          placeholder="Confirma tu nueva contraseña"
                          required
                        />
                        {cambioPassword.password_confirmar && (
                          <div className="mt-2 text-sm">
                            <div className={`flex items-center gap-2 ${cambioPassword.password_nueva === cambioPassword.password_confirmar ? 'text-green-600' : 'text-red-500'}`}>
                              <div className={`w-2 h-2 rounded-full ${cambioPassword.password_nueva === cambioPassword.password_confirmar ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              {cambioPassword.password_nueva === cambioPassword.password_confirmar ? 'Contraseñas coinciden' : 'Las contraseñas no coinciden'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={guardando || !cambioPassword.password_actual || !cambioPassword.password_nueva || !cambioPassword.password_confirmar || cambioPassword.password_nueva !== cambioPassword.password_confirmar || cambioPassword.password_nueva.length < 6}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        {guardando ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Cambiando contraseña...
                          </div>
                        ) : (
                          'Cambiar Contraseña'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaginaPerfil; 