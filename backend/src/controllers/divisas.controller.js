const { formatearRespuesta, formatearError } = require('../utils/helpers');
const bancoCentralService = require('../services/bancoCentral.service');

class DivisasController {

  // Obtener tipos de cambio del Banco Central
  async obtenerTiposCambio(req, res) {
    try {
      console.log('🔄 Endpoint /tipos-cambio llamado');
      const { fecha } = req.query;
      const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
      console.log('📅 Fecha consulta:', fechaConsulta);

      // Obtener valores reales del Banco Central
      const valorDolar = await bancoCentralService.obtenerValorDolar();
      const valorEuro = await bancoCentralService.obtenerValorEuro();
      
      console.log('💵 Valor USD obtenido:', valorDolar);
      console.log('💶 Valor EUR obtenido:', valorEuro);

      const divisas = [
        {
          id: 1,
          codigo: 'USD',
          nombre: 'Dólar Estadounidense',
          simbolo: 'US$',
          valor: valorDolar,
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        },
        {
          id: 2,
          codigo: 'EUR',
          nombre: 'Euro',
          simbolo: '€',
          valor: valorEuro,
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        },
        {
          id: 3,
          codigo: 'UF',
          nombre: 'Unidad de Fomento',
          simbolo: 'UF',
          valor: 37500.00, // Valor fijo de UF
          fecha: fechaConsulta,
          fuente: 'Banco Central de Chile'
        }
      ];

      console.log('✅ Divisas obtenidas del Banco Central:', divisas);
      const respuesta = formatearRespuesta(
        divisas,
        'Tipos de cambio obtenidos exitosamente del Banco Central'
      );
      console.log('📤 Respuesta enviada:', respuesta);
      res.json(respuesta);
    } catch (error) {
      console.error('❌ Error al obtener tipos de cambio:', error);
      res.status(500).json(formatearError('Error al obtener tipos de cambio del Banco Central'));
    }
  }

  // Convertir moneda usando el servicio del Banco Central
  async convertirMoneda(req, res) {
    try {
      const { monto, desde, hacia } = req.query;

      if (!monto || !desde || !hacia) {
        return res.status(400).json(formatearError('Parámetros requeridos: monto, desde, hacia'));
      }

      const montoNumerico = parseFloat(monto);
      const divisaDesde = desde.toUpperCase();
      const divisaHacia = hacia.toUpperCase();

      // Usar el servicio del Banco Central para la conversión
      const montoConvertido = await bancoCentralService.convertirMoneda(
        montoNumerico, 
        divisaDesde, 
        divisaHacia
      );

      // Obtener tasas actuales para mostrar la tasa de cambio
      let tasaCambio = 1;
      if (divisaDesde !== divisaHacia) {
        const valorDesde = divisaDesde === 'CLP' ? 1 : 
          divisaDesde === 'USD' ? await bancoCentralService.obtenerValorDolar() :
          divisaDesde === 'EUR' ? await bancoCentralService.obtenerValorEuro() : 1;
        
        const valorHacia = divisaHacia === 'CLP' ? 1 :
          divisaHacia === 'USD' ? await bancoCentralService.obtenerValorDolar() :
          divisaHacia === 'EUR' ? await bancoCentralService.obtenerValorEuro() : 1;
        
        tasaCambio = valorHacia / valorDesde;
      }

      const conversion = {
        monto_original: montoNumerico,
        divisa_origen: divisaDesde,
        monto_convertido: parseFloat(montoConvertido.toFixed(2)),
        divisa_destino: divisaHacia,
        tasa_cambio: parseFloat(tasaCambio.toFixed(4)),
        fecha_actualizacion: new Date().toISOString(),
        fuente: 'Banco Central de Chile'
      };

      res.json(formatearRespuesta(
        'Conversión realizada exitosamente usando datos del Banco Central',
        conversion
      ));
    } catch (error) {
      console.error('Error al convertir moneda:', error);
      res.status(500).json(formatearError('Error al convertir moneda usando el Banco Central'));
    }
  }

  // Actualizar tasas de cambio
  async actualizarTasas(req, res) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      // Obtener valores actuales del Banco Central
      const valorDolar = await bancoCentralService.obtenerValorDolar();
      const valorEuro = await bancoCentralService.obtenerValorEuro();
      
      const actualizacion = {
        fecha_actualizacion: hoy,
        divisas_actualizadas: ['USD', 'EUR', 'UF'],
        fuente: 'Banco Central de Chile',
        valores_actuales: {
          USD: valorDolar,
          EUR: valorEuro,
          UF: 37500.00
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(formatearRespuesta(
        'Tasas de cambio actualizadas exitosamente desde el Banco Central',
        actualizacion
      ));
    } catch (error) {
      console.error('Error al actualizar tasas:', error);
      res.status(500).json(formatearError('Error al actualizar tasas desde el Banco Central'));
    }
  }
}

module.exports = new DivisasController();