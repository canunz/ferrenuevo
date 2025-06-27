const { formatearRespuesta, formatearError } = require('../utils/helpers');

class DivisasController {

  // Obtener tipos de cambio del Banco Central
  async obtenerTiposCambio(req, res) {
    try {
      const { fecha } = req.query;
      const fechaConsulta = fecha || new Date().toISOString().split('T')[0];

      // Simular datos del Banco Central de Chile
      const divisas = [
        {
          id: 1,
          codigo: 'USD',
          nombre: 'Dólar Estadounidense',
          simbolo: 'US$',
          valor: 800.50,
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        },
        {
          id: 2,
          codigo: 'EUR',
          nombre: 'Euro',
          simbolo: '€',
          valor: 870.25,
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        },
        {
          id: 3,
          codigo: 'UF',
          nombre: 'Unidad de Fomento',
          simbolo: 'UF',
          valor: 37500.00,
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        }
      ];

      res.json(formatearRespuesta(
        'Tipos de cambio obtenidos exitosamente',
        divisas
      ));
    } catch (error) {
      console.error('Error al obtener tipos de cambio:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Convertir moneda
  async convertirMoneda(req, res) {
    try {
      const { monto, desde, hacia } = req.query;

      if (!monto || !desde || !hacia) {
        return res.status(400).json(formatearError('Parámetros requeridos: monto, desde, hacia'));
      }

      // Tasas de cambio simuladas (CLP como base)
      const tasas = {
        'CLP': 1,
        'USD': 800.50,
        'EUR': 870.25,
        'UF': 37500.00
      };

      const montoNumerico = parseFloat(monto);
      const divisaDesde = desde.toUpperCase();
      const divisaHacia = hacia.toUpperCase();

      if (!tasas[divisaDesde] || !tasas[divisaHacia]) {
        return res.status(404).json(formatearError('Divisa no encontrada'));
      }

      // Convertir a CLP primero, luego a la divisa destino
      const enCLP = divisaDesde === 'CLP' ? montoNumerico : montoNumerico * tasas[divisaDesde];
      const montoConvertido = divisaHacia === 'CLP' ? enCLP : enCLP / tasas[divisaHacia];
      const tasaCambio = tasas[divisaHacia] / tasas[divisaDesde];

      const conversion = {
        monto_original: montoNumerico,
        divisa_origen: divisaDesde,
        monto_convertido: parseFloat(montoConvertido.toFixed(2)),
        divisa_destino: divisaHacia,
        tasa_cambio: parseFloat(tasaCambio.toFixed(4)),
        fecha_actualizacion: new Date().toISOString()
      };

      res.json(formatearRespuesta(
        'Conversión realizada exitosamente',
        conversion
      ));
    } catch (error) {
      console.error('Error al convertir moneda:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Actualizar tasas de cambio
  async actualizarTasas(req, res) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      // Simular actualización
      const actualizacion = {
        fecha_actualizacion: hoy,
        divisas_actualizadas: ['USD', 'EUR', 'UF'],
        fuente: 'Banco Central de Chile',
        timestamp: new Date().toISOString()
      };
      
      res.json(formatearRespuesta(
        'Tasas de cambio actualizadas exitosamente',
        actualizacion
      ));
    } catch (error) {
      console.error('Error al actualizar tasas:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }
}

module.exports = new DivisasController();