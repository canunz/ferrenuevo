import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  LockClosedIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
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
  
  // Formulario de datos personales
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: '',
    apellido: '',
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
            apellido: cliente.apellido || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            rut: cliente.rut || ''
          });
          // 3. Obtener dirección de envío
          try {
            const direccion = await servicioClientes.obtenerDireccionEnvio(cliente.id);
            if (direccion) {
              setDireccionEnvio({
                calle: direccion.calle || '',
                numero: direccion.numero || '',
                departamento: direccion.departamento || '',
                comuna: direccion.comuna || '',
                ciudad: direccion.ciudad || '',
                codigo_postal: direccion.codigo_postal || '',
                instrucciones: direccion.instrucciones || ''
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
      if (clienteId) {
        await servicioClientes.actualizar(clienteId, datosPersonales);
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
      if (cambioPassword.password_nueva !== cambioPassword.password_confirmar) {
        throw new Error('Las contraseñas no coinciden');
      }
      await servicioAuth.cambiarPassword({
        password_actual: cambioPassword.password_actual,
        password_nueva: cambioPassword.password_nueva
      });
      setExito('Contraseña cambiada correctamente');
      setCambioPassword({
        password_actual: '',
        password_nueva: '',
        password_confirmar: ''
      });
    } catch (err) {
      setError('Error al cambiar contraseña: ' + (err.message || err));
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
      if (clienteId) {
        await servicioClientes.actualizarDireccionEnvio(clienteId, direccionEnvio);
        setExito('Dirección de envío actualizada correctamente');
      } else {
        setError('No se puede guardar dirección sin ser cliente registrado');
      }
    } catch (err) {
      setError('Error al actualizar dirección: ' + (err.message || err));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Encabezado */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gestiona tu información personal y preferencias
        </p>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {exito && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <p className="text-green-700">{exito}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Datos Personales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Datos Personales
            </h2>
          </div>

          <form onSubmit={guardarDatosPersonales} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={datosPersonales.nombre}
                  onChange={(e) => setDatosPersonales({...datosPersonales, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={datosPersonales.apellido}
                  onChange={(e) => setDatosPersonales({...datosPersonales, apellido: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={datosPersonales.email}
                onChange={(e) => setDatosPersonales({...datosPersonales, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={datosPersonales.telefono}
                  onChange={(e) => setDatosPersonales({...datosPersonales, telefono: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RUT
                </label>
                <input
                  type="text"
                  value={datosPersonales.rut}
                  onChange={(e) => setDatosPersonales({...datosPersonales, rut: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Guardando...' : 'Guardar Datos Personales'}
            </button>
          </form>
        </div>

        {/* Cambio de Contraseña */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <LockClosedIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cambiar Contraseña
            </h2>
          </div>

          <form onSubmit={cambiarPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={cambioPassword.password_actual}
                  onChange={(e) => setCambioPassword({...cambioPassword, password_actual: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {mostrarPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPasswordNueva ? "text" : "password"}
                  value={cambioPassword.password_nueva}
                  onChange={(e) => setCambioPassword({...cambioPassword, password_nueva: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarPasswordNueva(!mostrarPasswordNueva)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {mostrarPasswordNueva ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={cambioPassword.password_confirmar}
                onChange={(e) => setCambioPassword({...cambioPassword, password_confirmar: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>

      {/* Dirección de Envío */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPinIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dirección de Envío
          </h2>
        </div>

        <form onSubmit={guardarDireccionEnvio} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calle
              </label>
              <input
                type="text"
                value={direccionEnvio.calle}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, calle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número
              </label>
              <input
                type="text"
                value={direccionEnvio.numero}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, numero: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={direccionEnvio.departamento}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, departamento: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comuna
              </label>
              <input
                type="text"
                value={direccionEnvio.comuna}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, comuna: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                value={direccionEnvio.ciudad}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, ciudad: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                value={direccionEnvio.codigo_postal}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, codigo_postal: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Instrucciones Adicionales
              </label>
              <input
                type="text"
                value={direccionEnvio.instrucciones}
                onChange={(e) => setDireccionEnvio({...direccionEnvio, instrucciones: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Opcional"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? 'Guardando...' : 'Guardar Dirección de Envío'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PaginaPerfil; 