// ==========================================
// src/servicios/api.js - FRONTEND CORREGIDO
// ==========================================

import axios from 'axios';

// Configuración de la API
const API_BASE_URL = 'http://localhost:3003/api/v1';

// Configuración base de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agrega el token a cada petición si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función helper para hacer requests con mejor manejo de errores
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors', // Importante para CORS
    credentials: 'include', // Para enviar cookies si es necesario
    ...options,
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  // Agregar body solo si no es GET
  if (options.body && defaultOptions.method !== 'GET') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  try {
    console.log(`📡 Enviando request a: ${url}`);
    console.log(`🔧 Opciones:`, defaultOptions);
    
    const response = await fetch(url, defaultOptions);
    
    console.log(`📬 Response status: ${response.status}`);
    console.log(`📬 Response headers:`, response.headers);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.log('No se pudo parsear el error como JSON');
      }
      
      throw new Error(errorMessage);
    }

    // Intentar parsear la respuesta como JSON
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      console.log(`✅ API Response exitosa:`, data);
      return data;
    } catch (e) {
      if (text.startsWith('<!DOCTYPE html') || text.startsWith('<html')) {
        throw new Error('La respuesta del servidor es HTML en vez de JSON. Es probable que la ruta de la API esté mal escrita o no exista en el backend.');
      }
      throw new Error('La respuesta del servidor no es JSON válido.');
    }
    
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    
    // Mejorar los mensajes de error para el usuario
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3003');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('La petición tardó demasiado tiempo. Inténtalo de nuevo.');
    }
    
    // Re-lanzar el error original si no es uno conocido
    throw error;
  }
};

// Función para probar conexión con el backend
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Error conectando con el backend:', error);
    throw error;
  }
};

// Función específica para verificar la salud del servidor
const verificarServidor = async () => {
  try {
    console.log('🏥 Verificando salud del servidor...');
    const response = await fetch('http://localhost:3003/', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Servidor funcionando:', data);
      return { funcionando: true, data };
    } else {
      console.log('⚠️ Servidor responde pero con error:', response.status);
      return { funcionando: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ No se puede conectar al servidor:', error);
    return { funcionando: false, error: error.message };
  }
};

// API PRODUCTOS (exportación nombrada)
export const productosAPI = {
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params.append(key, filtros[key]);
    });
    
    const endpoint = `/productos${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  obtenerPorId: async (id) => {
    return await apiRequest(`/productos/${id}`);
  },

  crear: async (producto) => {
    return await apiRequest('/productos', {
      method: 'POST',
      body: producto,
    });
  },

  actualizar: async (id, producto) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: producto,
    });
  },

  eliminar: async (id) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'DELETE',
    });
  },

  obtenerCategorias: async () => {
    return await apiRequest('/productos/categorias');
  },

  obtenerMarcas: async () => {
    return await apiRequest('/productos/marcas');
  },

  actualizarDescuento: async (id, descuento) => {
    return await apiRequest(`/productos/${id}/descuento`, {
      method: 'PUT',
      body: { descuento }
    });
  },

  actualizarDescuentoCategoria: async (categoria_id, descuento) => {
    return await apiRequest('/productos/descuento-categoria', {
      method: 'POST',
      body: { categoria_id, descuento }
    });
  },

  actualizarDescuentoMarca: async (marca_id, descuento) => {
    return await apiRequest('/productos/descuento-marca', {
      method: 'POST',
      body: { marca_id, descuento }
    });
  },

  cargarMasiva: async (archivoCsv) => {
    const formData = new FormData();
    formData.append('archivo', archivoCsv);
    // Usar fetch directamente para enviar multipart/form-data
    const response = await fetch(`${API_BASE_URL}/productos/carga-masiva`, {
      method: 'POST',
      body: formData,
      headers: {
        // No poner Content-Type, el navegador lo setea automáticamente
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error en la carga masiva');
    }
    return await response.json();
  },
};

// API SISTEMA (exportación nombrada)
export const sistemaAPI = {
  healthCheck: async () => {
    const response = await fetch('http://localhost:3003/health');
    return await response.json();
  },
  
  test: async () => {
    return await apiRequest('/test');
  },
  
  verificarServidor: verificarServidor,
};

// API CLIENTES
export const clientesAPI = {
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params.append(key, filtros[key]);
    });
    
    const endpoint = `/clientes${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  obtenerPorId: async (id) => {
    return await apiRequest(`/clientes/${id}`);
  },

  crear: async (cliente) => {
    return await apiRequest('/clientes', {
      method: 'POST',
      body: cliente,
    });
  },

  actualizar: async (id, cliente) => {
    return await apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: cliente,
    });
  },

  eliminar: async (id) => {
    return await apiRequest(`/clientes/${id}`, {
      method: 'DELETE',
    });
  },
};

// API AUTH
export const authAPI = {
  login: async (credenciales) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: credenciales,
    });
  },

  registro: async (datos) => {
    return await apiRequest('/auth/registro', {
      method: 'POST',
      body: datos,
    });
  },

  obtenerPerfil: async () => {
    return await apiRequest('/auth/perfil');
  },

  actualizarPerfil: async (datos) => {
    return await apiRequest('/auth/perfil', {
      method: 'PUT',
      body: datos,
    });
  },
};

// API PEDIDOS
export const pedidosAPI = {
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key]) params.append(key, filtros[key]);
    });
    
    const endpoint = `/pedidos${params.toString() ? `?${params.toString()}` : ''}`;
    return await apiRequest(endpoint);
  },

  obtenerPorId: async (id) => {
    return await apiRequest(`/pedidos/${id}`);
  },

  crear: async (pedido) => {
    return await apiRequest('/pedidos', {
      method: 'POST',
      body: pedido,
    });
  },

  actualizar: async (id, pedido) => {
    return await apiRequest(`/pedidos/${id}`, {
      method: 'PUT',
      body: pedido,
    });
  },

  cambiarEstado: async (id, estado) => {
    return await apiRequest(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: { estado },
    });
  },
};

// Obtener tipos de cambio del Banco Central (sin token)
export const obtenerTiposCambioBancoCentral = async () => {
  const url = `${API_BASE_URL}/divisas/tipos-cambio`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // No enviar credenciales ni token
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener tipos de cambio:', error);
    throw error;
  }
};

// Obtener pagos sin token (si es público)
export const obtenerPagosSinToken = async (filtros = {}) => {
  const params = new URLSearchParams(filtros).toString();
  const url = `${API_BASE_URL}/pagos${params ? `?${params}` : ''}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // No enviar credenciales ni token
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw error;
  }
};

// Obtener clientes sin token (si es público)
export const obtenerClientesSinToken = async () => {
  const url = `${API_BASE_URL}/clientes`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // No enviar credenciales ni token
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

// Exportar axios instance para uso directo
export default api;