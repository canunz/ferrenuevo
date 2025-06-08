import api from './api';

export const servicioAuth = {
  // Iniciar sesión
  iniciarSesion: async (credenciales) => {
    const response = await api.post('/auth/login', credenciales);
    return response.data;
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
    localStorage.removeItem('auth_token');
    window.location.href = '/iniciar-sesion';
  },
};
