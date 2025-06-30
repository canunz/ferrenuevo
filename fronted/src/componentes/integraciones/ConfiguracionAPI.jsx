import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const ConfiguracionAPI = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [configSeleccionada, setConfigSeleccionada] = useState(null);
  const [mostrarClaves, setMostrarClaves] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    api_key: '',
    api_secret: '',
    base_url: '',
    timeout: 5000,
    retry_attempts: 3,
    webhook_url: '',
    ambiente: 'produccion'
  });

  useEffect(() => {
    cargarConfiguraciones();
  }, []);

  const cargarConfiguraciones = async () => {
    setCargando(true);
    try {
      // Simular carga de configuraciones
      setTimeout(() => {
        setConfiguraciones([
          {
            id: 1,
            nombre: 'MercadoPago API',
            descripcion: 'Configuración para procesamiento de pagos',
            api_key: 'APP_USR_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            api_secret: 'APP_USR_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            base_url: 'https://api.mercadopago.com',
            timeout: 10000,
            retry_attempts: 3,
            webhook_url: 'https://api.ferremas.cl/webhooks/mercadopago',
            ambiente: 'sandbox',
            estado: 'activa',
            ultima_prueba: '2024-06-30 10:30',
            requests_mes: 1245
          },
          {
            id: 2,
            nombre: 'Banco Central API',
            descripcion: 'Configuración para tipos de cambio',
            api_key: 'bcentral_api_key_123',
            api_secret: '',
            base_url: 'https://si3.bcentral.cl',
            timeout: 5000,
            retry_attempts: 3,
            webhook_url: '',
            ambiente: 'produccion',
            estado: 'activa',
            ultima_prueba: '2024-06-30 09:00',
            requests_mes: 456
          },
          {
            id: 3,
            nombre: 'Google Analytics API',
            descripcion: 'Configuración para análisis web',
            api_key: 'ga_api_key_789',
            api_secret: 'ga_api_secret_789',
            base_url: 'https://analytics.google.com',
            timeout: 8000,
            retry_attempts: 2,
            webhook_url: 'https://api.ferremas.cl/webhooks/analytics',
            ambiente: 'produccion',
            estado: 'activa',
            ultima_prueba: '2024-06-29 15:45',
            requests_mes: 2580
          },
          {
            id: 4,
            nombre: 'Mailchimp API',
            descripcion: 'Configuración para email marketing',
            api_key: 'mailchimp_api_key_abc',
            api_secret: 'mailchimp_secret_abc',
            base_url: 'https://api.mailchimp.com',
            timeout: 6000,
            retry_attempts: 3,
            webhook_url: 'https://api.ferremas.cl/webhooks/mailchimp',
            ambiente: 'produccion',
            estado: 'inactiva',
            ultima_prueba: '2024-06-28 12:20',
            requests_mes: 345
          }
        ]);
        setCargando(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
      setCargando(false);
    }
  };

  const probarConexion = async (configId) => {
    // Simular prueba de conexión
    const config = configuraciones.find(c => c.id === configId);
    if (config) {
      // Simular delay de prueba
      setTimeout(() => {
        const configuracionesActualizadas = configuraciones.map(c => 
          c.id === configId 
            ? { ...c, ultima_prueba: new Date().toLocaleString() }
            : c
        );
        setConfiguraciones(configuracionesActualizadas);
      }, 2000);
    }
  };

  const toggleEstado = (configId) => {
    const configuracionesActualizadas = configuraciones.map(c => 
      c.id === configId 
        ? { ...c, estado: c.estado === 'activa' ? 'inactiva' : 'activa' }
        : c
    );
    setConfiguraciones(configuracionesActualizadas);
  };

  const toggleMostrarClave = (configId) => {
    setMostrarClaves(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const abrirModal = (config = null) => {
    if (config) {
      setConfigSeleccionada(config);
      setFormData({
        nombre: config.nombre,
        descripcion: config.descripcion,
        api_key: config.api_key,
        api_secret: config.api_secret,
        base_url: config.base_url,
        timeout: config.timeout,
        retry_attempts: config.retry_attempts,
        webhook_url: config.webhook_url,
        ambiente: config.ambiente
      });
    } else {
      setConfigSeleccionada(null);
      setFormData({
        nombre: '',
        descripcion: '',
        api_key: '',
        api_secret: '',
        base_url: '',
        timeout: 5000,
        retry_attempts: 3,
        webhook_url: '',
        ambiente: 'produccion'
      });
    }
    setModalAbierto(true);
  };

  const guardarConfiguracion = () => {
    if (configSeleccionada) {
      // Actualizar configuración existente
      const configuracionesActualizadas = configuraciones.map(c => 
        c.id === configSeleccionada.id 
          ? { ...c, ...formData }
          : c
      );
      setConfiguraciones(configuracionesActualizadas);
    } else {
      // Crear nueva configuración
      const nuevaConfig = {
        id: Date.now(),
        ...formData,
        estado: 'activa',
        ultima_prueba: 'Nunca',
        requests_mes: 0
      };
      setConfiguraciones([nuevaConfig, ...configuraciones]);
    }
    setModalAbierto(false);
  };

  const eliminarConfiguracion = (configId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta configuración?')) {
      const configuracionesActualizadas = configuraciones.filter(c => c.id !== configId);
      setConfiguraciones(configuracionesActualizadas);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const obtenerColorEstado = (estado) => {
    return estado === 'activa' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <KeyIcon className="w-6 h-6" />
              Configuración API
            </h2>
            <p className="text-indigo-100 mt-1">
              Gestión de claves API y webhooks para integraciones externas
            </p>
          </div>
          <button
            onClick={() => abrirModal()}
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Nueva Configuración
          </button>
        </div>
      </div>

      {/* Lista de Configuraciones */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Configuraciones API ({configuraciones.length})
        </h3>
        
        {cargando ? (
          <div className="text-center py-8">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
            <p className="text-gray-500">Cargando configuraciones...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {configuraciones.map((config) => (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <KeyIcon className="w-5 h-5 text-indigo-600" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {config.nombre}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(config.estado)}`}>
                        {config.estado}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                        {config.ambiente}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {config.descripcion}
                    </p>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">API Key:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono">
                            {mostrarClaves[config.id] 
                              ? config.api_key 
                              : config.api_key.substring(0, 8) + '...'
                            }
                          </span>
                          <button
                            onClick={() => toggleMostrarClave(config.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {mostrarClaves[config.id] ? <EyeSlashIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium">Base URL:</span>
                        <span className="font-mono">{config.base_url}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Última Prueba:</span>
                        <span>{config.ultima_prueba}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">Requests/Mes:</span>
                        <span>{config.requests_mes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => probarConexion(config.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                      title="Probar conexión"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => toggleEstado(config.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        config.estado === 'activa' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      title={config.estado === 'activa' ? 'Desactivar' : 'Activar'}
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => abrirModal(config)}
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => eliminarConfiguracion(config.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Configuración */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {configSeleccionada ? 'Editar Configuración' : 'Nueva Configuración'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Ej: MercadoPago API"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ambiente
                  </label>
                  <select
                    name="ambiente"
                    value={formData.ambiente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="produccion">Producción</option>
                    <option value="sandbox">Sandbox</option>
                    <option value="desarrollo">Desarrollo</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción de la configuración"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    name="api_key"
                    value={formData.api_key}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Clave de API"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Secret
                  </label>
                  <input
                    type="password"
                    name="api_secret"
                    value={formData.api_secret}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Secreto de API"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Base URL
                </label>
                <input
                  type="url"
                  name="base_url"
                  value={formData.base_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://api.ejemplo.com"
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    name="timeout"
                    value={formData.timeout}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="1000"
                    max="30000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Intentos de Reintento
                  </label>
                  <input
                    type="number"
                    name="retry_attempts"
                    value={formData.retry_attempts}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min="1"
                    max="5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    name="webhook_url"
                    value={formData.webhook_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://api.ferremas.cl/webhooks/..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={guardarConfiguracion}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {configSeleccionada ? 'Actualizar' : 'Crear'}
              </button>
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ConfiguracionAPI;
