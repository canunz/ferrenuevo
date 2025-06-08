class PagosController {

  // Crear preferencia de pago MercadoPago
  async crearPreferencia(req, res) {
    try {
      const { pedido_id } = req.body;

      if (!pedido_id) {
        return res.status(400).json(formatearError('ID del pedido es requerido'));
      }

      // Simular creación de preferencia MercadoPago
      const preferencia = {
        preference_id: `PREF-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=DEMO_${pedido_id}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=DEMO_${pedido_id}`,
        pedido_id: pedido_id,
        created_at: new Date().toISOString()
      };

      res.json(formatearRespuesta(
        'Preferencia de pago creada exitosamente',
        preferencia
      ));
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Webhook de MercadoPago
  async webhook(req, res) {
    try {
      const { type, data } = req.body;

      console.log('Webhook recibido:', { type, data });

      // Simular procesamiento de webhook
      if (type === 'payment') {
        console.log('Procesando pago:', data.id);
        
        // Aquí procesarías el pago real
        // const payment = await mercadopago.payment.findById(data.id);
        
        res.status(200).send('OK');
      } else {
        res.status(200).send('Webhook tipo no manejado');
      }
    } catch (error) {
      console.error('Error en webhook:', error);
      res.status(500).send('Error');
    }
  }

  // Listar pagos
  async listarPagos(req, res) {
    try {
      const { page = 1, limit = 10, estado } = req.query;

      // Simular pagos
      const pagosDemo = [
        {
          id: 1,
          pedido_id: 1,
          monto: 59990.00,
          estado: 'aprobado',
          referencia_externa: 'MP_123456789',
          fecha_pago: new Date().toISOString(),
          metodo_pago: {
            id: 1,
            nombre: 'MercadoPago'
          },
          pedido: {
            numero_pedido: 'PED-1-ABC',
            cliente: {
              nombre: 'Cliente Demo',
              email: 'cliente@test.com'
            }
          }
        }
      ];

      let pagosFiltrados = pagosDemo;
      if (estado) {
        pagosFiltrados = pagosDemo.filter(p => p.estado === estado);
      }

      res.json(formatearRespuesta(
        'Pagos obtenidos exitosamente',
        pagosFiltrados,
        {
          page: parseInt(page),
          limit: parseInt(limit),
          total: pagosFiltrados.length,
          totalPages: Math.ceil(pagosFiltrados.length / limit)
        }
      ));
    } catch (error) {
      console.error('Error al listar pagos:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Consultar estado de pago
  async consultarEstadoPago(req, res) {
    try {
      const { id } = req.params;

      // Simular pago
      const pago = {
        id: parseInt(id),
        pedido_id: 1,
        monto: 59990.00,
        estado: 'aprobado',
        referencia_externa: 'MP_123456789',
        fecha_pago: new Date().toISOString(),
        metodo_pago: {
          id: 1,
          nombre: 'MercadoPago'
        }
      };

      res.json(formatearRespuesta(
        'Estado del pago obtenido exitosamente',
        pago
      ));
    } catch (error) {
      console.error('Error al consultar pago:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }
}

module.exports = new PagosController();