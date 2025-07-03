export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3003';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

export const ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  BODEGUERO: 'bodeguero',
  CONTADOR: 'contador',
  CLIENTE: 'cliente',
};

export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  PREPARANDO: 'preparando',
  LISTO: 'listo',
  ENVIADO: 'enviado',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
};

export const METODOS_PAGO = {
  EFECTIVO: 'efectivo',
  TARJETA: 'tarjeta',
  TRANSFERENCIA: 'transferencia',
  MERCADOPAGO: 'mercadopago',
};

export const METODOS_ENTREGA = {
  RETIRO_TIENDA: 'retiro_tienda',
  DESPACHO_DOMICILIO: 'despacho_domicilio',
};

export const MONEDAS = {
  CLP: 'CLP',
  USD: 'USD',
  EUR: 'EUR',
  ARS: 'ARS',
};

export const TAMAÑOS_PAGINACION = [10, 25, 50, 100];

export const FORMATO_FECHA = 'dd/MM/yyyy';
export const FORMATO_FECHA_HORA = 'dd/MM/yyyy HH:mm';
