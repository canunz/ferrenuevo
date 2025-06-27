import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon, 
  CalculatorIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const BancoCentral = () => {
  const [tiposCambio, setTiposCambio] = useState([]);
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    monto: '',
    desde: 'CLP',
    hacia: 'USD'
  });

  // Obtener tipos de cambio
  const obtenerTiposCambio = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/divisas/tipos-cambio');
      const data = await response.json();
      
      if (data.success) {
        setTiposCambio(data.data);
      } else {
        setError('Error al obtener tipos de cambio');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convertir moneda
  const convertirMoneda = async () => {
    if (!formData.monto || formData.monto <= 0) {
      setError('Por favor ingrese un monto válido');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        monto: formData.monto,
        desde: formData.desde,
        hacia: formData.hacia
      });

      const response = await fetch(`http://localhost:3000/api/v1/divisas/convertir?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setConversion(data.data);
      } else {
        setError('Error al convertir moneda');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar tasas
  const actualizarTasas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/v1/divisas/actualizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Recargar tipos de cambio
        await obtenerTiposCambio();
      } else {
        setError('Error al actualizar tasas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTiposCambio();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    convertirMoneda();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6" />
              Banco Central de Chile
            </h2>
            <p className="text-blue-100 mt-1">
              Tipos de cambio en tiempo real y conversor de monedas
            </p>
          </div>
          <button
            onClick={actualizarTasas}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-lg disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tipos de Cambio */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tipos de Cambio Actuales
          </h3>
          
          {loading && tiposCambio.length === 0 ? (
            <div className="text-center py-8">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-500">Cargando tipos de cambio...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tiposCambio.map((divisa) => (
                <div
                  key={divisa.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-semibold">
                        {divisa.codigo}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {divisa.nombre}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {divisa.fecha}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${divisa.valor.toLocaleString('es-CL')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CLP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversor de Monedas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5" />
            Conversor de Monedas
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleInputChange}
                placeholder="Ingrese el monto"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                step="0.01"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Desde
                </label>
                <select
                  name="desde"
                  value={formData.desde}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="UF">UF - Unidad de Fomento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hacia
                </label>
                <select
                  name="hacia"
                  value={formData.hacia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="UF">UF - Unidad de Fomento</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Convirtiendo...
                </span>
              ) : (
                'Convertir'
              )}
            </button>
          </form>

          {/* Resultado de la conversión */}
          {conversion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Conversión Realizada
                </h4>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monto original:</span>
                  <span className="font-medium">
                    {conversion.monto_original.toLocaleString('es-CL')} {conversion.divisa_origen}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monto convertido:</span>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    {conversion.monto_convertido.toLocaleString('es-CL')} {conversion.divisa_destino}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tasa de cambio:</span>
                  <span className="font-medium">
                    1 {conversion.divisa_origen} = {conversion.tasa_cambio} {conversion.divisa_destino}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Información del Banco Central
        </h4>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Los tipos de cambio se obtienen directamente del Banco Central de Chile y se actualizan 
          automáticamente. La información incluye el Dólar Estadounidense (USD), Euro (EUR) y 
          Unidad de Fomento (UF) en relación al Peso Chileno (CLP).
        </p>
      </div>
    </motion.div>
  );
};

export default BancoCentral;
