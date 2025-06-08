// src/services/bancoCentral.service.js
const axios = require('axios');

class BancoCentralService {
  constructor() {
    this.baseURL = 'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx';
    this.timeout = 10000; // 10 segundos
  }

  // Obtener valor del dólar
  async obtenerValorDolar() {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          user: process.env.BC_USER || 'demo',
          pass: process.env.BC_PASS || 'demo',
          function: 'GetSeries',
          timeseries: 'F073.TCO.PRE.Z.D',
          firstdate: this.formatearFecha(new Date()),
          lastdate: this.formatearFecha(new Date())
        },
        timeout: this.timeout
      });

      if (response.data && response.data.Series && response.data.Series.length > 0) {
        const serie = response.data.Series[0];
        if (serie.Obs && serie.Obs.length > 0) {
          return parseFloat(serie.Obs[0].value);
        }
      }
      
      throw new Error('No se pudo obtener el valor del dólar');
    } catch (error) {
      console.error('Error al obtener valor del dólar:', error.message);
      // Valor de respaldo en caso de error
      return 850.00;
    }
  }

  // Obtener valor del euro
  async obtenerValorEuro() {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          user: process.env.BC_USER || 'demo',
          pass: process.env.BC_PASS || 'demo',
          function: 'GetSeries',
          timeseries: 'F072.CLP.EUR.N.O.D',
          firstdate: this.formatearFecha(new Date()),
          lastdate: this.formatearFecha(new Date())
        },
        timeout: this.timeout
      });

      if (response.data && response.data.Series && response.data.Series.length > 0) {
        const serie = response.data.Series[0];
        if (serie.Obs && serie.Obs.length > 0) {
          return parseFloat(serie.Obs[0].value);
        }
      }
      
      throw new Error('No se pudo obtener el valor del euro');
    } catch (error) {
      console.error('Error al obtener valor del euro:', error.message);
      // Valor de respaldo en caso de error
      return 920.00;
    }
  }

  // Formatear fecha para la API del Banco Central
  formatearFecha(fecha) {
    return fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  // Convertir moneda
  async convertirMoneda(monto, monedaOrigen, monedaDestino) {
    try {
      if (monedaOrigen === monedaDestino) {
        return monto;
      }

      let valorEnCLP = monto;
      let valorFinal = monto;

      // Convertir a CLP si no es CLP
      if (monedaOrigen !== 'CLP') {
        let tasaOrigen;
        switch (monedaOrigen) {
          case 'USD':
            tasaOrigen = await this.obtenerValorDolar();
            break;
          case 'EUR':
            tasaOrigen = await this.obtenerValorEuro();
            break;
          default:
            throw new Error(`Moneda no soportada: ${monedaOrigen}`);
        }
        valorEnCLP = monto * tasaOrigen;
      }

      // Convertir de CLP a moneda destino
      if (monedaDestino !== 'CLP') {
        let tasaDestino;
        switch (monedaDestino) {
          case 'USD':
            tasaDestino = await this.obtenerValorDolar();
            break;
          case 'EUR':
            tasaDestino = await this.obtenerValorEuro();
            break;
          default:
            throw new Error(`Moneda no soportada: ${monedaDestino}`);
        }
        valorFinal = valorEnCLP / tasaDestino;
      } else {
        valorFinal = valorEnCLP;
      }

      return Math.round(valorFinal * 100) / 100; // Redondear a 2 decimales
    } catch (error) {
      throw new Error(`Error en conversión de moneda: ${error.message}`);
    }
  }
}

module.exports = new BancoCentralService();