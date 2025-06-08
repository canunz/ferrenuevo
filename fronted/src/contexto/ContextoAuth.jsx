import React, { createContext, useContext, useState, useEffect } from 'react';

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
      // Simular autenticación (aquí conectarías con tu backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Credenciales de ejemplo
      if (credenciales.email === 'admin@ferremas.cl' && credenciales.password === 'password123') {
        const usuarioData = {
          id: 1,
          nombre: 'Administrador FERREMAS',
          email: 'admin@ferremas.cl',
          rol: 'administrador',
          avatar: null
        };
        
        setUsuario(usuarioData);
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        localStorage.setItem('token', 'fake-jwt-token');
        
        return { exito: true };
      } else {
        return { exito: false, mensaje: 'Credenciales incorrectas' };
      }
    } catch (error) {
      return { exito: false, mensaje: 'Error en el servidor' };
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