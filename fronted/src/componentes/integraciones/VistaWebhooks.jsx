// ==========================================
// ARCHIVO: frontend/src/componentes/integraciones/VistaWebhooks.jsx
// ==========================================
const VistaWebhooks = ({ integraciones }) => {
    const [webhookActivo, setWebhookActivo] = useState({});
  
    const webhooksData = [
      {
        id: 'mercadopago_webhook',
        nombre: 'MercadoPago Notifications',
        url: 'https://api.ferremas.cl/webhooks/mercadopago',
        eventos: ['payment.created', 'payment.updated'],
        estado: 'activo',
        ultimaActividad: '2024-06-06 14:30:15'
      },
      {
        id: 'sii_webhook',
        nombre: 'SII Facturación',
        url: 'https://api.ferremas.cl/webhooks/sii',
        eventos: ['dte.accepted', 'dte.rejected'],
        estado: 'inactivo',
        ultimaActividad: null
      }
    ];
  
    const toggleWebhook = (id) => {
      setWebhookActivo(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    };
  
    return (
      <div className="space-y-6">
        {/* Configuración de Webhooks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Webhooks Configurados</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Nuevo Webhook
              </button>
            </div>
          </div>
  
          <div className="p-6">
            <div className="space-y-4">
              {webhooksData.map((webhook) => (
                <div key={webhook.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{webhook.nombre}</h4>
                      <p className="text-sm text-gray-600 font-mono">{webhook.url}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        webhook.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {webhook.estado}
                      </span>
                      <button
                        onClick={() => toggleWebhook(webhook.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          webhook.estado === 'activo'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {webhook.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Eventos:</span>
                      <div className="mt-1">
                        {webhook.eventos.map(evento => (
                          <span key={evento} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {evento}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Última actividad:</span>
                      <p className="text-gray-900 mt-1">
                        {webhook.ultimaActividad || 'Sin actividad'}
                      </p>
                    </div>
                  </div>
  
                  <div className="mt-4 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Probar Webhook
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Ver Logs
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Guía de configuración */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-blue-900 mb-3">Configuración de Webhooks</h4>
          <div className="space-y-3 text-sm text-blue-800">
            <p>
              <strong>1. URL del Webhook:</strong> Debe ser una URL HTTPS válida que pueda recibir requests POST.
            </p>
            <p>
              <strong>2. Autenticación:</strong> Recomendamos usar un token secreto para verificar la autenticidad de los webhooks.
            </p>
            <p>
              <strong>3. Reintentos:</strong> El sistema reintentará enviar el webhook hasta 3 veces en caso de error.
            </p>
            <p>
              <strong>4. Timeout:</strong> Los webhooks tienen un timeout de 30 segundos.
            </p>
          </div>
        </div>
      </div>
    );
  };