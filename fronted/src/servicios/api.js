// ==========================================
// FRONTEND/SRC/SERVICIOS/API.JS - COMPLETO
// ==========================================
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Función base
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }
    
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
};

// API PRODUCTOS
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
      body: JSON.stringify(producto),
    });
  },

  actualizar: async (id, producto) => {
    return await apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
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

// API DASHBOARD
export const dashboardAPI = {
  obtenerEstadisticas: async () => {
    return await apiRequest('/dashboard/stats');
  },
};

// API SISTEMA
export const sistemaAPI = {
  healthCheck: async () => {
    const response = await fetch('http://localhost:3000/health');
    return await response.json();
  },
  
  test: async () => {
    return await apiRequest('/test');
  },
};

// EXPORTACIÓN DEFAULT
const api = {
  productos: productosAPI,
  dashboard: dashboardAPI,
  sistema: sistemaAPI,
};

export default api;