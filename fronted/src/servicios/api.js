// ==========================================
// src/servicios/api.js - FRONTEND CORREGIDO
// ==========================================

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api/v1';

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
    const data = await response.json();
    console.log(`✅ API Response exitosa:`, data);
    
    return data;
    
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    
    // Mejorar los mensajes de error para el usuario
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('La petición tardó demasiado tiempo. Inténtalo de nuevo.');
    }
    
    // Re-lanzar el error original si no es uno conocido
    throw error;
  }
};

// Función específica para verificar la salud del servidor
const verificarServidor = async () => {
  try {
    console.log('🏥 Verificando salud del servidor...');
    const response = await fetch('http://localhost:3000/health', {
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
};

// API SISTEMA (exportación nombrada)
export const sistemaAPI = {
  healthCheck: async () => {
    const response = await fetch('http://localhost:3000/health');
    return await response.json();
  },
  
  test: async () => {
    return await apiRequest('/test');
  },
};

// API DASHBOARD (exportación nombrada)
export const dashboardAPI = {
  obtenerEstadisticas: async () => {
    return await apiRequest('/dashboard/stats');
  },
};

// API del cliente para hacer peticiones
const api = {
  // Verificar servidor
  verificarServidor,
  
  // Métodos HTTP básicos
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: data }),
  put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: data }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  
  obtenerTodos: (endpoint) => apiRequest(endpoint),
  obtener: (endpoint, id) => apiRequest(`${endpoint}/${id}`),
  crear: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: data }),
  actualizar: (endpoint, id, data) => apiRequest(`${endpoint}/${id}`, { method: 'PUT', body: data }),
  eliminar: (endpoint, id) => apiRequest(`${endpoint}/${id}`, { method: 'DELETE' }),
  
  // Métodos específicos con mejor manejo de errores
  productos: {
    obtenerTodos: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/productos?${queryString}` : '/productos';
      return apiRequest(endpoint);
    },
    
    obtenerOfertas: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/productos/ofertas?${queryString}` : '/productos/ofertas';
      return apiRequest(endpoint);
    },
    
    obtenerPorId: (id) => apiRequest(`/productos/${id}`),
    
    obtenerCategorias: () => apiRequest('/productos/categorias'),
    
    obtenerMarcas: () => apiRequest('/productos/marcas'),
  },
  
  // Método de diagnóstico completo
  diagnostico: async () => {
    console.log('🔍 Iniciando diagnóstico completo...');
    
    const resultados = {
      servidor: await verificarServidor(),
      productos: null,
      categorias: null,
      marcas: null
    };
    
    if (resultados.servidor.funcionando) {
      try {
        console.log('🛍️ Probando endpoint de productos...');
        resultados.productos = await apiRequest('/productos?limit=1');
        console.log('✅ Productos funcionando');
      } catch (error) {
        console.error('❌ Error en productos:', error.message);
        resultados.productos = { error: error.message };
      }
      
      try {
        console.log('📂 Probando endpoint de categorías...');
        resultados.categorias = await apiRequest('/productos/categorias');
        console.log('✅ Categorías funcionando');
      } catch (error) {
        console.error('❌ Error en categorías:', error.message);
        resultados.categorias = { error: error.message };
      }
      
      try {
        console.log('🏷️ Probando endpoint de marcas...');
        resultados.marcas = await apiRequest('/productos/marcas');
        console.log('✅ Marcas funcionando');
      } catch (error) {
        console.error('❌ Error en marcas:', error.message);
        resultados.marcas = { error: error.message };
      }
    }
    
    console.log('📊 Diagnóstico completo:', resultados);
    return resultados;
  }
};

export default api;