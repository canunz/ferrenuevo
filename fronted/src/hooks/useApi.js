import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

const API_BASE_URL = 'http://localhost:3003/api/v1';

export const useApi = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  const llamarApi = useCallback(async (endpoint, opciones = {}) => {
    setCargando(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...opciones.headers,
        },
        ...opciones,
      };

      // Agregar token de autorización si el usuario está autenticado
      if (usuario) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
      }

      const datos = await respuesta.json();
      return { exito: true, datos };
    } catch (err) {
      setError(err.message);
      return { exito: false, error: err.message };
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  // Métodos específicos para operaciones CRUD
  const obtener = useCallback((endpoint) => {
    return llamarApi(endpoint, { method: 'GET' });
  }, [llamarApi]);

  const crear = useCallback((endpoint, datos) => {
    return llamarApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  }, [llamarApi]);

  const actualizar = useCallback((endpoint, datos) => {
    return llamarApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
  }, [llamarApi]);

  const eliminar = useCallback((endpoint) => {
    return llamarApi(endpoint, { method: 'DELETE' });
  }, [llamarApi]);

  return {
    cargando,
    error,
    llamarApi,
    obtener,
    crear,
    actualizar,
    eliminar,
  };
};