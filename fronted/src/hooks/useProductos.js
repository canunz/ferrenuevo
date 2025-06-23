// ==========================================
// FRONTEND/SRC/HOOKS/USEPRODUCTOS.JS - COMPLETO
// ==========================================
import { useState, useEffect } from 'react';
import { productosAPI } from '../servicios/api';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos
  const cargarProductos = async (filtros = {}) => {
    setCargando(true);
    setError(null);
    
    try {
      console.log('🔄 Cargando productos...', filtros);
      const response = await productosAPI.obtenerTodos(filtros);
      
      if (response.success && response.data) {
        setProductos(response.data.productos || []);
        console.log('✅ Productos cargados:', (response.data.productos || []).length);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setError(error.message);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // Buscar productos
  const buscarProductos = async (filtros) => {
    await cargarProductos(filtros);
  };

  // Crear producto
  const crearProducto = async (producto) => {
    try {
      const response = await productosAPI.crear(producto);
      if (response.success) {
        setProductos(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Actualizar producto
  const actualizarProducto = async (id, producto) => {
    try {
      const response = await productosAPI.actualizar(id, producto);
      if (response.success) {
        setProductos(prev => 
          prev.map(p => p.id === id ? response.data : p)
        );
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      await productosAPI.eliminar(id);
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      console.log('🔄 Cargando categorías...');
      const response = await productosAPI.obtenerCategorias();
      
      if (response.success && response.data) {
        setCategorias(response.data);
        console.log('✅ Categorías cargadas:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
    }
  };

  // Cargar marcas
  const cargarMarcas = async () => {
    try {
      console.log('🔄 Cargando marcas...');
      const response = await productosAPI.obtenerMarcas();
      
      if (response.success && response.data) {
        setMarcas(response.data);
        console.log('✅ Marcas cargadas:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Error cargando marcas:', error);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🚀 Inicializando useProductos...');
    cargarProductos();
    cargarCategorias();
    cargarMarcas();
  }, []);

  return {
    productos,
    categorias,
    marcas,
    cargando,
    error,
    cargarProductos,
    buscarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    cargarCategorias,
    cargarMarcas,
  };
};