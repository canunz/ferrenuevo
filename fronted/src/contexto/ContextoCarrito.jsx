// ==========================================
// ARCHIVO: frontend/src/contexto/ContextoCarrito.jsx
// ==========================================
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Crear el contexto
const ContextoCarrito = createContext();

// Tipos de acciones para el reducer
const TIPOS_ACCION = {
  AGREGAR_PRODUCTO: 'AGREGAR_PRODUCTO',
  ELIMINAR_PRODUCTO: 'ELIMINAR_PRODUCTO',
  ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
  LIMPIAR_CARRITO: 'LIMPIAR_CARRITO',
  CARGAR_CARRITO: 'CARGAR_CARRITO'
};

// Estado inicial del carrito
const estadoInicial = {
  items: [],
  total: 0,
  cantidadTotal: 0
};

// Reducer para manejar las acciones del carrito
const carritoReducer = (estado, accion) => {
  switch (accion.type) {
    case TIPOS_ACCION.AGREGAR_PRODUCTO: {
      const productoExistente = estado.items.find(item => item.id === accion.payload.id);
      
      let nuevosItems;
      if (productoExistente) {
        // Si el producto ya existe, incrementar la cantidad
        nuevosItems = estado.items.map(item =>
          item.id === accion.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si es un producto nuevo, agregarlo con cantidad 1
        nuevosItems = [...estado.items, { ...accion.payload, cantidad: 1 }];
      }

      return {
        ...estado,
        items: nuevosItems,
        total: calcularTotal(nuevosItems),
        cantidadTotal: calcularCantidadTotal(nuevosItems)
      };
    }

    case TIPOS_ACCION.ELIMINAR_PRODUCTO: {
      const nuevosItems = estado.items.filter(item => item.id !== accion.payload);
      return {
        ...estado,
        items: nuevosItems,
        total: calcularTotal(nuevosItems),
        cantidadTotal: calcularCantidadTotal(nuevosItems)
      };
    }

    case TIPOS_ACCION.ACTUALIZAR_CANTIDAD: {
      if (accion.payload.cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el producto
        const nuevosItems = estado.items.filter(item => item.id !== accion.payload.id);
        return {
          ...estado,
          items: nuevosItems,
          total: calcularTotal(nuevosItems),
          cantidadTotal: calcularCantidadTotal(nuevosItems)
        };
      }

      const nuevosItems = estado.items.map(item =>
        item.id === accion.payload.id
          ? { ...item, cantidad: accion.payload.cantidad }
          : item
      );

      return {
        ...estado,
        items: nuevosItems,
        total: calcularTotal(nuevosItems),
        cantidadTotal: calcularCantidadTotal(nuevosItems)
      };
    }

    case TIPOS_ACCION.LIMPIAR_CARRITO: {
      return {
        ...estadoInicial
      };
    }

    case TIPOS_ACCION.CARGAR_CARRITO: {
      const items = accion.payload || [];
      return {
        ...estado,
        items,
        total: calcularTotal(items),
        cantidadTotal: calcularCantidadTotal(items)
      };
    }

    default:
      return estado;
  }
};

// Funciones auxiliares para cálculos
const calcularTotal = (items) => {
  return items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
};

const calcularCantidadTotal = (items) => {
  return items.reduce((total, item) => total + item.cantidad, 0);
};

// Proveedor del contexto
export const CarritoProvider = ({ children }) => {
  const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carritoFerremas');
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        dispatch({ type: TIPOS_ACCION.CARGAR_CARRITO, payload: items });
      } catch (error) {
        console.error('Error al cargar carrito desde localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('carritoFerremas', JSON.stringify(estado.items));
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [estado.items]);

  // Funciones del carrito
  const agregarAlCarrito = (producto) => {
    dispatch({ 
      type: TIPOS_ACCION.AGREGAR_PRODUCTO, 
      payload: producto 
    });
  };

  const eliminarDelCarrito = (productoId) => {
    dispatch({ 
      type: TIPOS_ACCION.ELIMINAR_PRODUCTO, 
      payload: productoId 
    });
  };

  const actualizarCantidad = (productoId, cantidad) => {
    dispatch({ 
      type: TIPOS_ACCION.ACTUALIZAR_CANTIDAD, 
      payload: { id: productoId, cantidad } 
    });
  };

  const limpiarCarrito = () => {
    dispatch({ type: TIPOS_ACCION.LIMPIAR_CARRITO });
  };

  const obtenerTotal = () => {
    return estado.total;
  };

  const obtenerCantidadTotal = () => {
    return estado.cantidadTotal;
  };

  const obtenerProducto = (productoId) => {
    return estado.items.find(item => item.id === productoId);
  };

  const estaEnCarrito = (productoId) => {
    return estado.items.some(item => item.id === productoId);
  };

  const obtenerCantidadProducto = (productoId) => {
    const producto = estado.items.find(item => item.id === productoId);
    return producto ? producto.cantidad : 0;
  };

  // Valor del contexto
  const valorContexto = {
    // Estado
    carrito: estado.items,
    total: estado.total,
    cantidadTotal: estado.cantidadTotal,
    
    // Funciones
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
    obtenerTotal,
    obtenerCantidadTotal,
    obtenerProducto,
    estaEnCarrito,
    obtenerCantidadProducto
  };

  return (
    <ContextoCarrito.Provider value={valorContexto}>
      {children}
    </ContextoCarrito.Provider>
  );
};

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
  const contexto = useContext(ContextoCarrito);
  
  if (!contexto) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  
  return contexto;
};

export default ContextoCarrito;