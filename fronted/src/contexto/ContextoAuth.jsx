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
      console.log('🔐 Iniciando proceso de login con credenciales:', credenciales);
      const res = await servicioAuth.iniciarSesion(credenciales);
      console.log('📬 Respuesta completa del backend:', res);
      console.log('✅ Success:', res.success);
      console.log('📊 Data:', res.data);
      console.log('🔑 Token:', res.token);
      console.log('👤 Usuario:', res.usuario);
      
      // Manejar tanto la estructura nueva {success, data} como la actual {token, usuario}
      if (res.success && res.data) {
        // Estructura nueva
        console.log('🎉 Login exitoso (estructura nueva), guardando datos...');
        setUsuario(res.data.usuario);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        localStorage.setItem('token', res.data.token);
        console.log('💾 Datos guardados en localStorage');
        return { exito: true };
      } else if (res.token && res.usuario) {
        // Estructura actual del backend
        console.log('🎉 Login exitoso (estructura actual), guardando datos...');
        setUsuario(res.usuario);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token);
        console.log('💾 Datos guardados en localStorage');
        return { exito: true };
      } else {
        console.log('❌ Login fallido:', res.error || res.message);
        return { exito: false, mensaje: res.error || res.message || 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.log('💥 Error en el proceso de login:', error);
      return { exito: false, mensaje: 'Error en el servidor' };
    } finally {
      setCargando(false);
    }
  };

  const registrarse = async (datosRegistro) => {
    setCargando(true);
    try {
      const res = await servicioAuth.registrarse(datosRegistro);
      console.log('Respuesta registro backend:', res);
      if (res.success) {
        setUsuario({
          id: res.data.id,
          nombre: res.data.nombre,
          email: res.data.email,
          rol: res.data.rol
        });
        localStorage.setItem('usuario', JSON.stringify({
          id: res.data.id,
          nombre: res.data.nombre,
          email: res.data.email,
          rol: res.data.rol
        }));
        localStorage.setItem('token', res.data.token || '');
        return { exito: true };
      } else {
        return { exito: false, mensaje: res.error || res.message || 'Error en el registro' };
      }
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