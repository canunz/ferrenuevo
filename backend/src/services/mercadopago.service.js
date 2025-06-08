// src/services/mercadopago.service.js
const mercadopago = require('mercadopago');

class MercadoPagoService {
  constructor() {
    mercadopago.configure({
      access_token: process.env.MP_ACCESS_TOKEN
    });
  }

  // Crear preferencia de pago
  async crearPreferencia(pedidoData) {
    try {
      const preference = {
        items: pedidoData.items.map(item => ({
          title: item.nombre,
          unit_price: parseFloat(item.precio),
          quantity: parseInt(item.cantidad),
          currency_id: 'CLP'
        })),
        payer: {
          name: pedidoData.cliente.nombre,
          surname: pedidoData.cliente.apellido,
          email: pedidoData.cliente.email
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/pago/exito`,
          failure: `${process.env.FRONTEND_URL}/pago/error`,
          pending: `${process.env.FRONTEND_URL}/pago/pendiente`
        },
        auto_return: 'approved',
        external_reference: pedidoData.numero_pedido,
        notification_url: `${process.env.API_URL}/api/v1/pagos/mercadopago/webhook`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      const response = await mercadopago.preferences.create(preference);
      return response.body;
    } catch (error) {
      console.error('Error creando preferencia MercadoPago:', error);
      throw new Error('Error al crear preferencia de pago');
    }
  }

  // Obtener información de pago
  async obtenerPago(paymentId) {
    try {
      const response = await mercadopago.payment.findById(paymentId);
      return response.body;
    } catch (error) {
      console.error('Error obteniendo pago MercadoPago:', error);
      throw new Error('Error al obtener información del pago');
    }
  }

  // Procesar webhook de MercadoPago
  async procesarWebhook(data) {
    try {
      if (data.type === 'payment') {
        const paymentInfo = await this.obtenerPago(data.data.id);
        
        return {
          payment_id: paymentInfo.id,
          status: paymentInfo.status,
          status_detail: paymentInfo.status_detail,
          external_reference: paymentInfo.external_reference,
          transaction_amount: paymentInfo.transaction_amount,
          date_approved: paymentInfo.date_approved,
          payment_method_id: paymentInfo.payment_method_id
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error procesando webhook MercadoPago:', error);
      throw new Error('Error al procesar notificación de pago');
    }
  }
}

module.exports = new MercadoPagoService();