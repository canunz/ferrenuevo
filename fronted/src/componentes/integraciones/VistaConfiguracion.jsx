// ==========================================
// ARCHIVO: frontend/src/componentes/integraciones/VistaConfiguracion.jsx
// ==========================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const VistaConfiguracion = ({ integraciones, configuraciones, onConfigurar }) => {
  const [mostrarCredenciales, setMostrarCredenciales] = useState({});

  const toggleMostrarCredencial = (integracionId, campo) => {
    setMostrarCredenciales(prev => ({
      ...prev,
      [`${integracionId}_${campo}`]: !prev[`${integracionId}_${campo}`]
    }));
  };

  const enmascararCredencial = (valor, visible) => {
    if (!valor) return 'No configurado';
    if (visible) return valor;
    return '*'.repeat(valor.length);
  };

  return (
    <div className="space-y-6">
      {integraciones.map((integracion) => {
        const config = configuraciones[integracion.id] || {};
        
        return (
          <motion.div
            key={integracion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{integracion.icono}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{integracion.nombre}</h3>
                    <p className="text-sm text-gray-600">{integracion.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    integracion.configurada 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {integracion.configurada ? (
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircleIcon className="w-3 h-3 mr-1" />
                    )}
                    {integracion.configurada ? 'Configurada' : 'Pendiente'}
                  </span>
                  <button
                    onClick={() => onConfigurar(integracion)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Configurar
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuración Actual */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Configuración Actual</h4>
                  <div className="space-y-3">
                    {Object.entries(config).map(([campo, valor]) => (
                      <div key={campo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <KeyIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {campo.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-mono">
                            {enmascararCredencial(valor, mostrarCredenciales[`${integracion.id}_${campo}`])}
                          </span>
                          {valor && (
                            <button
                              onClick={() => toggleMostrarCredencial(integracion.id, campo)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {mostrarCredenciales[`${integracion.id}_${campo}`] ? (
                                <EyeSlashIcon className="w-4 h-4" />
                              ) : (
                                <EyeIcon className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Información de la API */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Información de la API</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Versión:</span>
                      <span className="font-medium text-gray-900">{integracion.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Documentación:</span>
                      <a 
                        href={integracion.documentacion}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver docs
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Requiere Auth:</span>
                      <span className={`font-medium ${
                        integracion.requiereAuth ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {integracion.requiereAuth ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Endpoints */}
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Endpoints Disponibles</h5>
                    <div className="space-y-2">
                      {integracion.endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              endpoint.activo ? 'bg-green-400' : 'bg-gray-400'
                            }`}></span>
                            <span className="text-gray-600">{endpoint.nombre}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            endpoint.metodo === 'GET' ? 'bg-blue-100 text-blue-800' :
                            endpoint.metodo === 'POST' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {endpoint.metodo}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas de uso */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Estadísticas de Uso</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{integracion.estadisticas.requests_mes}</p>
                    <p className="text-xs text-gray-600">Requests/Mes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{integracion.estadisticas.errores_mes}</p>
                    <p className="text-xs text-gray-600">Errores/Mes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{integracion.estadisticas.tiempo_respuesta}</p>
                    <p className="text-xs text-gray-600">Tiempo Resp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{integracion.estadisticas.uptime}</p>
                    <p className="text-xs text-gray-600">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};