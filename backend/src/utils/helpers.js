// ============================================
// ARCHIVO: src/utils/helpers.js
// ============================================

/**
 * Formatea respuestas exitosas de la API
 * @param {*} data - Datos a devolver
 * @param {string} message - Mensaje descriptivo
 * @param {object} meta - Metadatos adicionales (paginación, etc.)
 * @returns {object} Respuesta formateada
 */
const formatearRespuesta = (data, message = 'Operación exitosa', meta = null) => {
    const respuesta = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  
    if (meta) {
      respuesta.meta = meta;
    }
  
    return respuesta;
  };
  
  /**
   * Formatea respuestas de error de la API
   * @param {string} message - Mensaje de error
   * @param {string} codigo - Código de error específico
   * @param {*} detalles - Detalles adicionales del error
   * @returns {object} Error formateado
   */
  const formatearError = (message = 'Error interno', codigo = null, detalles = null) => {
    const error = {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  
    if (codigo) {
      error.codigo = codigo;
    }
  
    if (detalles) {
      error.detalles = detalles;
    }
  
    return error;
  };
  
  /**
   * Configura la paginación para consultas
   * @param {number} page - Número de página actual
   * @param {number} limit - Elementos por página
   * @returns {object} Configuración de paginación
   */
  const paginar = (page = 1, limit = 10) => {
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit))); // Máximo 100 elementos
    const offset = (pageNumber - 1) * limitNumber;
  
    return {
      limit: limitNumber,
      offset,
      page: pageNumber
    };
  };
  
  /**
   * Formatea información de paginación para respuestas
   * @param {number} page - Página actual
   * @param {number} limit - Elementos por página
   * @param {number} total - Total de elementos
   * @returns {object} Metadatos de paginación
   */
  const formatearPaginacion = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    };
  };
  
  /**
   * Genera un código único para pedidos
   * @param {string} prefijo - Prefijo del código
   * @returns {string} Código único generado
   */
  const generarCodigoPedido = (prefijo = 'PED') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefijo}-${timestamp}-${random}`;
  };
  
  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Valida formato de RUT chileno
   * @param {string} rut - RUT a validar
   * @returns {boolean} True si es válido
   */
  const validarRUT = (rut) => {
    if (!rut || typeof rut !== 'string') return false;
    
    // Remover puntos y guión
    const rutLimpio = rut.replace(/[.-]/g, '');
    
    // Validar formato
    if (!/^\d{7,8}[0-9Kk]$/.test(rutLimpio)) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toLowerCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto < 2 ? resto.toString() : resto === 10 ? 'k' : (11 - resto).toString();
    
    return dv === dvCalculado;
  };
  
  /**
   * Formatea números como moneda chilena
   * @param {number} monto - Monto a formatear
   * @returns {string} Monto formateado
   */
  const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };
  
  /**
   * Calcula distancia entre dos fechas en días
   * @param {Date} fecha1 - Primera fecha
   * @param {Date} fecha2 - Segunda fecha
   * @returns {number} Diferencia en días
   */
  const calcularDiasEntreFechas = (fecha1, fecha2) => {
    const unDia = 24 * 60 * 60 * 1000; // horas * minutos * segundos * milisegundos
    return Math.round(Math.abs((fecha1 - fecha2) / unDia));
  };
  
  /**
   * Sanitiza texto para evitar XSS básico
   * @param {string} texto - Texto a sanitizar
   * @returns {string} Texto sanitizado
   */
  const sanitizarTexto = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    
    return texto
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000); // Limitar longitud
  };
  
  /**
   * Genera hash MD5 simple para cacheo
   * @param {string} texto - Texto a hashear
   * @returns {string} Hash generado
   */
  const generarHashSimple = (texto) => {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(texto).digest('hex');
  };
  
  /**
   * Convierte texto a slug URL-friendly
   * @param {string} texto - Texto a convertir
   * @returns {string} Slug generado
   */
  const generarSlug = (texto) => {
    if (!texto) return '';
    
    return texto
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };
  
  /**
   * Valida que un número esté en un rango específico
   * @param {number} numero - Número a validar
   * @param {number} min - Valor mínimo
   * @param {number} max - Valor máximo
   * @returns {boolean} True si está en rango
   */
  const validarRango = (numero, min, max) => {
    return numero >= min && numero <= max;
  };
  
  /**
   * Redondea número a decimales específicos
   * @param {number} numero - Número a redondear
   * @param {number} decimales - Cantidad de decimales
   * @returns {number} Número redondeado
   */
  const redondear = (numero, decimales = 2) => {
    return Math.round(numero * Math.pow(10, decimales)) / Math.pow(10, decimales);
  };
  
  /**
   * Escapa caracteres especiales para SQL (uso básico)
   * @param {string} texto - Texto a escapar
   * @returns {string} Texto escapado
   */
  const escaparSQL = (texto) => {
    if (!texto || typeof texto !== 'string') return '';
    return texto.replace(/'/g, "''");
  };
  
  module.exports = {
    formatearRespuesta,
    formatearError,
    paginar,
    formatearPaginacion,
    generarCodigoPedido,
    validarEmail,
    validarRUT,
    formatearMoneda,
    calcularDiasEntreFechas,
    sanitizarTexto,
    generarHashSimple,
    generarSlug,
    validarRango,
    redondear,
    escaparSQL
  };