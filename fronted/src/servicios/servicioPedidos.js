import api from './api';

export const servicioPedidos = {
  // Obtener todos los pedidos
  obtenerTodos: async (params = {}) => {
    try {
      const response = await api.get('/pedidos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Obtener pedido por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      throw error;
    }
  },

  // Crear nuevo pedido
  crear: async (data) => {
    try {
      const response = await api.post('/pedidos', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  actualizarEstado: async (id, estado) => {
    try {
      const response = await api.put(`/pedidos/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },

  // Actualizar pedido
  actualizar: async (id, data) => {
    try {
      const response = await api.put(`/pedidos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw error;
    }
  },

  // Eliminar pedido
  eliminar: async (id) => {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  },

  // Obtener estados disponibles
  obtenerEstados: async () => {
    return [
      { value: 'pendiente', label: 'Pendiente', color: 'yellow', descripcion: 'Pedido recibido y en espera de confirmación' },
      { value: 'confirmado', label: 'Confirmado', color: 'blue', descripcion: 'Pedido confirmado y en proceso de preparación' },
      { value: 'en_preparacion', label: 'En Preparación', color: 'orange', descripcion: 'Productos siendo preparados para envío' },
      { value: 'enviado', label: 'Enviado', color: 'indigo', descripcion: 'Pedido enviado y en tránsito' },
      { value: 'entregado', label: 'Entregado', color: 'green', descripcion: 'Pedido entregado exitosamente' },
      { value: 'cancelado', label: 'Cancelado', color: 'red', descripcion: 'Pedido cancelado' },
    ];
  },

  // Obtener métodos de entrega
  obtenerMetodosEntrega: async () => {
    return [
      { value: 'retiro_tienda', label: 'Retiro en Tienda', descripcion: 'Recoger en sucursal' },
      { value: 'despacho_domicilio', label: 'Domicilio', descripcion: 'Envío a domicilio' },
    ];
  },

  // Obtener métodos de pago
  obtenerMetodosPago: async () => {
    return [
      { value: 'efectivo', label: 'Efectivo', descripcion: 'Pago en efectivo' },
      { value: 'transferencia', label: 'Transferencia', descripcion: 'Transferencia bancaria' },
      { value: 'tarjeta', label: 'Tarjeta', descripcion: 'Pago con tarjeta' },
      { value: 'mercadopago', label: 'MercadoPago', descripcion: 'Pago online' },
    ];
  },

  // Obtener estadísticas de pedidos
  obtenerEstadisticas: async () => {
    try {
      const response = await api.get('/pedidos/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // Retornar datos dummy si hay error
      return {
        total: 0,
        pendientes: 0,
        enPreparacion: 0,
        enviados: 0,
        entregados: 0,
        cancelados: 0,
        valorTotal: 0
      };
    }
  },

  // Obtener pedidos por cliente
  obtenerPorCliente: async (clienteId) => {
    try {
      const response = await api.get(`/pedidos/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos del cliente:', error);
      throw error;
    }
  },

  // Obtener pedidos recientes
  obtenerRecientes: async (limite = 5) => {
    try {
      const response = await api.get('/pedidos/recientes', { params: { limite } });
      return response.data;
    } catch (error) {
      console.error('Error al obtener pedidos recientes:', error);
      throw error;
    }
  },

  // Buscar pedidos
  buscar: async (termino) => {
    try {
      const response = await api.get('/pedidos/buscar', { params: { q: termino } });
      return response.data;
    } catch (error) {
      console.error('Error al buscar pedidos:', error);
      throw error;
    }
  },

  // Exportar pedidos
  exportar: async (filtros = {}) => {
    try {
      const response = await api.get('/pedidos/exportar', { 
        params: filtros,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error al exportar pedidos:', error);
      throw error;
    }
  },

  // Obtener historial de estados
  obtenerHistorialEstados: async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error;
    }
  },

  // Agregar comentario al pedido
  agregarComentario: async (pedidoId, comentario) => {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/comentarios`, { comentario });
      return response.data;
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      throw error;
    }
  },

  // Obtener comentarios del pedido
  obtenerComentarios: async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/comentarios`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw error;
    }
  },

  // Generar factura del pedido
  generarFactura: async (pedidoId) => {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/factura`);
      return response.data;
    } catch (error) {
      console.error('Error al generar factura:', error);
      throw error;
    }
  },

  // Obtener factura del pedido
  obtenerFactura: async (pedidoId) => {
    try {
      const response = await api.get(`/pedidos/${pedidoId}/factura`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener factura:', error);
      throw error;
    }
  },

  // Duplicar pedido
  duplicar: async (pedidoId) => {
    try {
      const response = await api.post(`/pedidos/${pedidoId}/duplicar`);
      return response.data;
    } catch (error) {
      console.error('Error al duplicar pedido:', error);
      throw error;
    }
  },

  // Validar stock para pedido
  validarStock: async (productos) => {
    try {
      const response = await api.post('/pedidos/validar-stock', { productos });
      return response.data;
    } catch (error) {
      console.error('Error al validar stock:', error);
      throw error;
    }
  },

  // Calcular costo de envío
  calcularEnvio: async (direccion, metodo) => {
    try {
      const response = await api.post('/pedidos/calcular-envio', { direccion, metodo });
      return response.data;
    } catch (error) {
      console.error('Error al calcular envío:', error);
      throw error;
    }
  }
};