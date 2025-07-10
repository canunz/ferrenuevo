// ==========================================
// ARCHIVO: frontend/src/componentes/integraciones/IntegracionesExternas.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cog6ToothIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  KeyIcon,
  GlobeAltIcon,
  CreditCardIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  EyeSlashIcon,
  CloudIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const IntegracionesExternas = () => {
  const { exito, error, advertencia } = useNotificacion();
  const [integraciones, setIntegraciones] = useState([]);
  const [configuraciones, setConfiguraciones] = useState({});
  const [cargando, setCargando] = useState(true);
  const [modalConfig, setModalConfig] = useState({ abierto: false, integracion: null });
  const [pruebasAPI, setPruebasAPI] = useState({});
  const [logs, setLogs] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('general'); // general, configuracion, logs, webhooks

  useEffect(() => {
    cargarIntegraciones();
    cargarLogs();
  }, []);

  const cargarIntegraciones = async () => {
    setCargando(true);
    try {
      // Simular carga de integraciones
      setTimeout(() => {
        setIntegraciones([
          {
            id: 'mercadopago',
            nombre: 'MercadoPago',
            descripcion: 'Procesamiento de pagos online',
            categoria: 'pagos',
            icono: '💳',
            estado: 'activa',
            version: '2.7.0',
            ultimaSync: '2024-06-06 14:30',
            configurada: true,
            requiereAuth: true,
            documentacion: 'https://www.mercadopago.com.ar/developers',
            endpoints: [
              { nombre: 'Crear Preferencia', url: '/payments/preferences', metodo: 'POST', activo: true },
              { nombre: 'Consultar Pago', url: '/payments/{id}', metodo: 'GET', activo: true },
              { nombre: 'Webhook', url: '/notifications', metodo: 'POST', activo: true }
            ],
            estadisticas: {
              requests_mes: 1245,
              errores_mes: 12,
              tiempo_respuesta: '245ms',
              uptime: '99.8%'
            }
          },
          {
            id: 'banco_central',
            nombre: 'Banco Central de Chile',
            descripcion: 'Tipos de cambio y valores UF',
            categoria: 'divisas',
            icono: '🏦',
            estado: 'activa',
            version: '1.0',
            ultimaSync: '2024-06-06 09:00',
            configurada: true,
            requiereAuth: false,
            documentacion: 'https://si3.bcentral.cl',
            endpoints: [
              { nombre: 'Dólar USD', url: '/series/F073.TCO.PRE.Z.D', metodo: 'GET', activo: true },
              { nombre: 'Euro EUR', url: '/series/F072.CLP.EUR.N.O.D', metodo: 'GET', activo: true },
              { nombre: 'UF', url: '/series/F073.UF.M.M.CLP.C', metodo: 'GET', activo: true }
            ],
            estadisticas: {
              requests_mes: 456,
              errores_mes: 3,
              tiempo_respuesta: '890ms',
              uptime: '99.9%'
            }
          },
          {
            id: 'sii',
            nombre: 'Servicio de Impuestos Internos',
            descripcion: 'Facturación electrónica y DTE',
            categoria: 'facturacion',
            icono: '📄',
            estado: 'configurando',
            version: '1.5',
            ultimaSync: null,
            configurada: false,
            requiereAuth: true,
            documentacion: 'https://www.sii.cl/factura_electronica',
            endpoints: [
              { nombre: 'Enviar DTE', url: '/dte/envio', metodo: 'POST', activo: false },
              { nombre: 'Consultar Estado', url: '/dte/estado', metodo: 'GET', activo: false },
              { nombre: 'Obtener PDF', url: '/dte/pdf', metodo: 'GET', activo: false }
            ],
            estadisticas: {
              requests_mes: 0,
              errores_mes: 0,
              tiempo_respuesta: '-',
              uptime: '-'
            }
          },
          {
            id: 'correos_chile',
            nombre: 'Correos de Chile',
            descripcion: 'Seguimiento de envíos y tracking',
            categoria: 'logistica',
            icono: '📦',
            estado: 'inactiva',
            version: '2.1',
            ultimaSync: '2024-06-05 16:20',
            configurada: true,
            requiereAuth: true,
            documentacion: 'https://www.correos.cl/api',
            endpoints: [
              { nombre: 'Crear Envío', url: '/envios', metodo: 'POST', activo: false },
              { nombre: 'Rastrear Paquete', url: '/tracking/{codigo}', metodo: 'GET', activo: false },
              { nombre: 'Calcular Costo', url: '/cotizar', metodo: 'POST', activo: false }
            ],
            estadisticas: {
              requests_mes: 89,
              errores_mes: 5,
              tiempo_respuesta: '1.2s',
              uptime: '98.5%'
            }
          },
          {
            id: 'google_analytics',
            nombre: 'Google Analytics',
            descripcion: 'Análisis de tráfico web',
            categoria: 'analytics',
            icono: '📊',
            estado: 'activa',
            version: 'GA4',
            ultimaSync: '2024-06-06 15:00',
            configurada: true,
            requiereAuth: true,
            documentacion: 'https://developers.google.com/analytics',
            endpoints: [
              { nombre: 'Eventos', url: '/events', metodo: 'POST', activo: true },
              { nombre: 'Conversiones', url: '/conversions', metodo: 'GET', activo: true }
            ],
            estadisticas: {
              requests_mes: 2580,
              errores_mes: 8,
              tiempo_respuesta: '156ms',
              uptime: '99.9%'
            }
          },
          {
            id: 'mailchimp',
            nombre: 'Mailchimp',
            descripcion: 'Email marketing y newsletters',
            categoria: 'marketing',
            icono: '📧',
            estado: 'activa',
            version: '3.0',
            ultimaSync: '2024-06-06 12:00',
            configurada: true,
            requiereAuth: true,
            documentacion: 'https://mailchimp.com/developer',
            endpoints: [
              { nombre: 'Agregar Contacto', url: '/lists/{list_id}/members', metodo: 'POST', activo: true },
              { nombre: 'Enviar Campaña', url: '/campaigns', metodo: 'POST', activo: true }
            ],
            estadisticas: {
              requests_mes: 345,
              errores_mes: 2,
              tiempo_respuesta: '298ms',
              uptime: '99.7%'
            }
          }
        ]);

        setConfiguraciones({
          mercadopago: {
            public_key: 'APP_USR_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            access_token: 'APP_USR_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            webhook_url: 'https://api.ferremas.cl/webhooks/mercadopago',
            sandbox: true
          },
          banco_central: {
            api_key: 'bcentral_api_key_123',
            base_url: 'https://si3.bcentral.cl',
            timeout: 5000,
            retry_attempts: 3
          },
          sii: {
            rut_empresa: '12345678-9',
            certificado_digital: 'certificado.p12',
            password_certificado: '********',
            ambiente: 'certificacion'
          },
          correos_chile: {
            api_key: 'correos_api_key_456',
            usuario: 'ferremas',
            password: '********',
            sucursal_origen: 'Santiago Centro'
          },
          google_analytics: {
            measurement_id: 'G-XXXXXXXXXX',
            api_secret: 'ga_api_secret_789',
            property_id: '123456789'
          },
          mailchimp: {
            api_key: 'mailchimp_api_key_abc',
            server_prefix: 'us1',
            audience_id: 'audience_123456'
          }
        });
        setCargando(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar integraciones:', error);
      setCargando(false);
    }
  };

  const cargarLogs = () => {
    setLogs([
      {
        id: 1,
        timestamp: '2024-06-06 14:30:15',
        integracion: 'MercadoPago',
        accion: 'Crear Preferencia',
        estado: 'exitoso',
        tiempo_respuesta: '245ms',
        detalles: 'Preferencia creada para pedido #1234'
      },
      {
        id: 2,
        timestamp: '2024-06-06 14:25:08',
        integracion: 'Banco Central',
        accion: 'Consultar USD',
        estado: 'exitoso',
        tiempo_respuesta: '890ms',
        detalles: 'Tipo de cambio USD: $850.50'
      },
      {
        id: 3,
        timestamp: '2024-06-06 14:20:33',
        integracion: 'MercadoPago',
        accion: 'Webhook',
        estado: 'error',
        tiempo_respuesta: '5000ms',
        detalles: 'Timeout en webhook de pago'
      },
      {
        id: 4,
        timestamp: '2024-06-06 13:45:12',
        integracion: 'Google Analytics',
        accion: 'Evento Compra',
        estado: 'exitoso',
        tiempo_respuesta: '156ms',
        detalles: 'Evento de conversión registrado'
      }
    ]);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'inactiva':
        return 'bg-red-100 text-red-800';
      case 'configurando':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'activa':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'inactiva':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'configurando':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const probarConexion = async (integracionId) => {
    setPruebasAPI(prev => ({ ...prev, [integracionId]: 'probando' }));
    
    try {
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
              const exito = true; // Simular éxito real
      
      if (exito) {
        setPruebasAPI(prev => ({ ...prev, [integracionId]: 'exitoso' }));
        exito('Conexión exitosa');
      } else {
        setPruebasAPI(prev => ({ ...prev, [integracionId]: 'error' }));
        error('Error en la conexión');
      }
      
      // Limpiar estado después de 3 segundos
      setTimeout(() => {
        setPruebasAPI(prev => ({ ...prev, [integracionId]: null }));
      }, 3000);
    } catch (err) {
      setPruebasAPI(prev => ({ ...prev, [integracionId]: 'error' }));
      error('Error al probar conexión');
    }
  };

  const toggleIntegracion = (integracionId) => {
    setIntegraciones(prev => prev.map(int => 
      int.id === integracionId 
        ? { 
            ...int, 
            estado: int.estado === 'activa' ? 'inactiva' : 'activa' 
          }
        : int
    ));
    exito('Estado de integración actualizado');
  };

  const abrirConfiguracion = (integracion) => {
    setModalConfig({ abierto: true, integracion });
  };

  const guardarConfiguracion = (nuevaConfig) => {
    setConfiguraciones(prev => ({
      ...prev,
      [modalConfig.integracion.id]: nuevaConfig
    }));
    setModalConfig({ abierto: false, integracion: null });
    exito('Configuración guardada exitosamente');
  };

  if (cargando) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando integraciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integraciones Externas</h1>
          <p className="text-gray-600">Conecta con APIs y servicios externos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={cargarIntegraciones}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Actualizar
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <LinkIcon className="h-5 w-5 mr-2" />
            Nueva Integración
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CloudIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{integraciones.length}</p>
              <p className="text-gray-600">Total Integraciones</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {integraciones.filter(i => i.estado === 'activa').length}
              </p>
              <p className="text-gray-600">Activas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <GlobeAltIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {integraciones.reduce((total, i) => total + i.estadisticas.requests_mes, 0)}
              </p>
              <p className="text-gray-600">Requests/Mes</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">99.2%</p>
              <p className="text-gray-600">Uptime Promedio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'general', nombre: 'General', icono: GlobeAltIcon },
              { id: 'configuracion', nombre: 'Configuración', icono: Cog6ToothIcon },
              { id: 'logs', nombre: 'Logs de API', icono: DocumentTextIcon },
              { id: 'webhooks', nombre: 'Webhooks', icono: LinkIcon }
            ].map((tab) => {
              const Icono = tab.icono;
              return (
                <button
                  key={tab.id}
                  onClick={() => setVistaActiva(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    vistaActiva === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icono className="w-5 h-5" />
                  <span>{tab.nombre}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {vistaActiva === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaGeneral
                  integraciones={integraciones}
                  pruebasAPI={pruebasAPI}
                  onProbarConexion={probarConexion}
                  onToggleIntegracion={toggleIntegracion}
                  onConfigurar={abrirConfiguracion}
                  obtenerColorEstado={obtenerColorEstado}
                  obtenerIconoEstado={obtenerIconoEstado}
                />
              </motion.div>
            )}

            {vistaActiva === 'configuracion' && (
              <motion.div
                key="configuracion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaConfiguracion
                  integraciones={integraciones}
                  configuraciones={configuraciones}
                  onConfigurar={abrirConfiguracion}
                />
              </motion.div>
            )}

            {vistaActiva === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaLogs logs={logs} />
              </motion.div>
            )}

            {vistaActiva === 'webhooks' && (
              <motion.div
                key="webhooks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaWebhooks integraciones={integraciones} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de configuración */}
      <AnimatePresence>
        {modalConfig.abierto && (
          <ModalConfiguracion
            integracion={modalConfig.integracion}
            configuracion={configuraciones[modalConfig.integracion?.id] || {}}
            onGuardar={guardarConfiguracion}
            onCerrar={() => setModalConfig({ abierto: false, integracion: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Vista General
const VistaGeneral = ({ 
  integraciones, 
  pruebasAPI, 
  onProbarConexion, 
  onToggleIntegracion, 
  onConfigurar,
  obtenerColorEstado,
  obtenerIconoEstado 
}) => {
  const categorias = {
    pagos: { nombre: 'Pagos', color: 'bg-green-50 border-green-200' },
    divisas: { nombre: 'Divisas', color: 'bg-blue-50 border-blue-200' },
    facturacion: { nombre: 'Facturación', color: 'bg-purple-50 border-purple-200' },
    logistica: { nombre: 'Logística', color: 'bg-orange-50 border-orange-200' },
    analytics: { nombre: 'Analytics', color: 'bg-indigo-50 border-indigo-200' },
    marketing: { nombre: 'Marketing', color: 'bg-pink-50 border-pink-200' }
  };

  return (
    <div className="space-y-6">
      {Object.entries(categorias).map(([categoriaId, categoria]) => {
        const integracionesCategoria = integraciones.filter(i => i.categoria === categoriaId);
        
        if (integracionesCategoria.length === 0) return null;

        return (
          <div key={categoriaId} className={`rounded-lg border p-6 ${categoria.color}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{categoria.nombre}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integracionesCategoria.map((integracion) => (
                <div
                  key={integracion.id}
                  className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{integracion.icono}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{integracion.nombre}</h4>
                        <p className="text-sm text-gray-600">{integracion.descripcion}</p>
                      </div>
                    </div>
                    {obtenerIconoEstado(integracion.estado)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(integracion.estado)}`}>
                        {integracion.estado}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Versión:</span>
                      <span className="font-medium">{integracion.version}</span>
                    </div>
                    {integracion.ultimaSync && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Última sync:</span>
                        <span className="font-medium">{integracion.ultimaSync}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Requests/mes:</span>
                      <span className="font-medium">{integracion.estadisticas.requests_mes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium text-green-600">{integracion.estadisticas.uptime}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onProbarConexion(integracion.id)}
                      disabled={pruebasAPI[integracion.id] === 'probando'}
                      className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      {pruebasAPI[integracion.id] === 'probando' ? (
                        <div className="flex items-center justify-center">
                          <ArrowPathIcon className="w-4 h-4 animate-spin mr-1" />
                          Probando...
                        </div>
                      ) : pruebasAPI[integracion.id] === 'exitoso' ? (
                        <div className="flex items-center justify-center text-green-600">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Exitoso
                        </div>
                      ) : pruebasAPI[integracion.id] === 'error' ? (
                        <div className="flex items-center justify-center text-red-600">
                          <XCircleIcon className="w-4 h-4 mr-1" />
                          Error
                        </div>
                      ) : (
                        'Probar'
                      )}
                    </button>
                    <button
                      onClick={() => onConfigurar(integracion)}
                      className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Config
                    </button>
                    <button
                      onClick={() => onToggleIntegracion(integracion.id)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        integracion.estado === 'activa'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      title={integracion.estado === 'activa' ? 'Desactivar' : 'Activar'}
                    >
                      {integracion.estado === 'activa' ? (
                        <PauseIcon className="w-4 h-4" />
                      ) : (
                        <PlayIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Vista Configuración
const VistaConfiguracion = ({ integraciones, configuraciones, onConfigurar }) => (
  <div className="space-y-4">
    {integraciones.map((integracion) => (
      <div key={integracion.id} className="bg-gray-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{integracion.icono}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{integracion.nombre}</h3>
              <p className="text-sm text-gray-600">{integracion.descripcion}</p>
            </div>
          </div>
          <button
            onClick={() => onConfigurar(integracion)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Configurar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Endpoints</h4>
            <div className="space-y-2">
              {integracion.endpoints.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{endpoint.nombre}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.metodo}
                    </span>
                    <span className="text-gray-500">{endpoint.url}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Configuración Actual</h4>
            <div className="space-y-2">
              {configuraciones[integracion.id] ? (
                Object.entries(configuraciones[integracion.id]).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-mono text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay configuración guardada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Vista Logs
const VistaLogs = ({ logs }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Logs de API</h3>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
          Exportar
        </button>
        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
          Limpiar
        </button>
      </div>
    </div>

    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Integración
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiempo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Detalles
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.timestamp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{log.integracion}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.accion}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  log.estado === 'exitoso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {log.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.tiempo_respuesta}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {log.detalles}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Vista Webhooks
const VistaWebhooks = ({ integraciones }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Webhooks Configurados</h3>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Agregar Webhook
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integraciones
        .filter(i => i.endpoints.some(e => e.nombre === 'Webhook'))
        .map((integracion) => (
          <div key={integracion.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{integracion.icono}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{integracion.nombre}</h4>
                  <p className="text-sm text-gray-600">Webhook de notificaciones</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                integracion.endpoints.find(e => e.nombre === 'Webhook')?.activo
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integracion.endpoints.find(e => e.nombre === 'Webhook')?.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">URL:</span>
                <span className="font-mono text-gray-900">
                  {integracion.endpoints.find(e => e.nombre === 'Webhook')?.url}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Método:</span>
                <span className="font-medium">{integracion.endpoints.find(e => e.nombre === 'Webhook')?.metodo}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Último evento:</span>
                <span className="font-medium">{integracion.ultimaSync || 'Nunca'}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Probar
              </button>
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Ver Logs
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">
                <EyeIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
    </div>
  </div>
);

// Modal de Configuración
const ModalConfiguracion = ({ integracion, configuracion, onGuardar, onCerrar }) => {
  const [formData, setFormData] = useState(configuracion);
  const [mostrarClave, setMostrarClave] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-2xl w-full"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Configurar {integracion.nombre}</h2>
            <button onClick={onCerrar}>
              <XCircleIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {integracion.requiereAuth && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={mostrarClave ? 'text' : 'password'}
                    value={formData.api_key || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, api_key: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingrese su API Key"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {mostrarClave ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <input
                  type="password"
                  value={formData.access_token || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, access_token: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese su Access Token"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Base
            </label>
            <input
              type="text"
              value={formData.base_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, base_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://api.ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL
            </label>
            <input
              type="text"
              value={formData.webhook_url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://api.ferremas.cl/webhooks"
            />
          </div>

          {integracion.id === 'mercadopago' && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sandbox"
                checked={formData.sandbox || false}
                onChange={(e) => setFormData(prev => ({ ...prev, sandbox: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sandbox" className="ml-2 block text-sm text-gray-900">
                Modo Sandbox
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default IntegracionesExternas;