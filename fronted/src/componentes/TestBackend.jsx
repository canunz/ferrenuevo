import { useState, useEffect } from 'react';
import { testBackendConnection } from '../servicios/api';

const TestBackend = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    success: false,
    data: null,
    error: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testBackendConnection();
        setConnectionStatus({
          loading: false,
          success: result.success,
          data: result.data,
          error: result.error
        });
      } catch (error) {
        setConnectionStatus({
          loading: false,
          success: false,
          data: null,
          error: error.message
        });
      }
    };

    checkConnection();
  }, []);

  if (connectionStatus.loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Verificando conexión con el backend...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Estado de la Conexión con el Backend</h2>
      
      {connectionStatus.success ? (
        <div className="text-green-600">
          <p className="font-semibold">✅ Conexión exitosa</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify(connectionStatus.data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-red-600">
          <p className="font-semibold">❌ Error de conexión</p>
          <p className="mt-2">{connectionStatus.error}</p>
        </div>
      )}
    </div>
  );
};

export default TestBackend; 