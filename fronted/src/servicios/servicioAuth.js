import api from './api';

export const servicioAuth = {
  // Iniciar sesión
  iniciarSesion: async (credenciales) => {
    console.log('🚀 Enviando petición de login a:', '/auth/login');
    console.log('📤 Credenciales enviadas:', { email: credenciales.email, password: '***' });
    
    try {
      const response = await api.post('/auth/login', credenciales);
      console.log('📥 Respuesta HTTP recibida:', response);
      console.log('📋 Status:', response.status);
      console.log('📄 Data:', response.data);
      console.log('📄 Data type:', typeof response.data);
      console.log('📄 Data keys:', Object.keys(response.data || {}));
      console.log('📄 Data stringified:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.success) {
        console.log('🔑 Token recibido, guardando...');
        localStorage.setItem('token', response.data.data.token);
      } else if (response.data && response.data.token) {
        // Estructura actual del backend
        console.log('🔑 Token recibido (estructura actual), guardando...');
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.log('💥 Error en petición HTTP:', error);
      console.log('📊 Error response:', error.response);
      throw error;
    }
  },

  // Registrarse
  registrarse: async (datosUsuario) => {
    const response = await api.post('/auth/registro', datosUsuario);
    return response.data;
  },

  // Verificar token
  verificarToken: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  // Obtener perfil
  obtenerPerfil: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  // Actualizar perfil
  actualizarPerfil: async (datosPerfil) => {
    const response = await api.put('/auth/perfil', datosPerfil);
    return response.data;
  },

  // Cambiar contraseña
  cambiarPassword: async (passwords) => {
    const response = await api.put('/auth/cambiar-password', passwords);
    return response.data;
  },

  // Cerrar sesión (lógica local)
  cerrarSesion: () => {
    localStorage.removeItem('token');
    window.location.href = '/iniciar-sesion';
  },
};
