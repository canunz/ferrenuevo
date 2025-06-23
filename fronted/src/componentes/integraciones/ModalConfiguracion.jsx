// ==========================================
// ARCHIVO: frontend/src/componentes/integraciones/ModalConfiguracion.jsx
// ==========================================
const ModalConfiguracion = ({ integracion, configuracion, onGuardar, onCerrar }) => {
    const [formData, setFormData] = useState(configuracion);
    const [mostrarCampos, setMostrarCampos] = useState({});
  
    const handleChange = (campo, valor) => {
      setFormData(prev => ({
        ...prev,
        [campo]: valor
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onGuardar(formData);
    };
  
    const toggleMostrarCampo = (campo) => {
      setMostrarCampos(prev => ({
        ...prev,
        [campo]: !prev[campo]
      }));
    };
  
    const renderCampoConfiguracion = (campo, valor, tipo = 'text') => {
      const esPassword = campo.includes('token') || campo.includes('key') || campo.includes('secret');
      const tipoInput = esPassword && !mostrarCampos[campo] ? 'password' : tipo;
  
      return (
        <div key={campo} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {campo.replace(/_/g, ' ')}
          </label>
          <div className="relative">
            <input
              type={tipoInput}
              value={valor || ''}
              onChange={(e) => handleChange(campo, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Ingresa ${campo.replace(/_/g, ' ')}`}
            />
            {esPassword && (
              <button
                type="button"
                onClick={() => toggleMostrarCampo(campo)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarCampos[campo] ? (
                  <EyeSlashIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      );
    };
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{integracion.icono}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Configurar {integracion.nombre}
                </h3>
                <p className="text-sm text-gray-600">{integracion.descripcion}</p>
              </div>
            </div>
            <button
              onClick={onCerrar}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="p-6">
            {/* Campos específicos por integración */}
            {integracion.id === 'mercadopago' && (
              <>
                {renderCampoConfiguracion('public_key', formData.public_key)}
                {renderCampoConfiguracion('access_token', formData.access_token)}
                {renderCampoConfiguracion('webhook_url', formData.webhook_url, 'url')}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.sandbox || false}
                      onChange={(e) => handleChange('sandbox', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Modo Sandbox (Pruebas)</span>
                  </label>
                </div>
              </>
            )}
  
            {integracion.id === 'banco_central' && (
              <>
                {renderCampoConfiguracion('api_key', formData.api_key)}
                {renderCampoConfiguracion('base_url', formData.base_url, 'url')}
                {renderCampoConfiguracion('cache_duration', formData.cache_duration, 'number')}
              </>
            )}
  
            {integracion.id === 'sii' && (
              <>
                {renderCampoConfiguracion('rut_empresa', formData.rut_empresa)}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ambiente
                  </label>
                  <select
                    value={formData.ambiente || 'certificacion'}
                    onChange={(e) => handleChange('ambiente', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="certificacion">Certificación</option>
                    <option value="produccion">Producción</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificado Digital
                  </label>
                  <input
                    type="file"
                    accept=".p12,.pfx"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </>
            )}
  
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };
  
  export { VistaConfiguracion, VistaLogs, VistaWebhooks, ModalConfiguracion };