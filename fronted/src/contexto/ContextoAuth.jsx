import React, { createContext, useContext, useState, useEffect } from 'react';
import { servicioAuth } from '../servicios/servicioAuth';

const ContextoAuth = createContext();

export const useAuth = () => {
  const context = useContext(ContextoAuth);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    
    setCargando(false);
  }, []);

  const iniciarSesion = async (credenciales) => {
    setCargando(true);
    
    try {
      const response = await servicioAuth.iniciarSesion(credenciales);
      const data = response.data;
      if (data && data.token && data.usuario) {
        setUsuario(data.usuario);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);
        return { exito: true };
      } else {
        return { exito: false, mensaje: response?.message || 'Credenciales incorrectas' };
      }
    } catch (error) {
      return { exito: false, mensaje: error?.response?.data?.mensaje || 'Error en el servidor' };
    } finally {
      setCargando(false);
    }
  };

  const registrarse = async (datosRegistro) => {
    setCargando(true);
    
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usuarioData = {
        id: Date.now(),
        nombre: datosRegistro.nombre,
        email: datosRegistro.email,
        rol: 'cliente',
        avatar: null
      };
      
      setUsuario(usuarioData);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      localStorage.setItem('token', 'fake-jwt-token');
      
      return { exito: true };
    } catch (error) {
      return { exito: false, mensaje: 'Error en el registro' };
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    registrarse,
    cerrarSesion
  };

  return (
    <ContextoAuth.Provider value={valor}>
      {children}
    </ContextoAuth.Provider>
  );
};