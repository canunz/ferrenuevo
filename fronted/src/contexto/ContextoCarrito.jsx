// ==========================================
// ARCHIVO: frontend/src/contexto/ContextoCarrito.jsx
// ==========================================
import React, { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
    }
    return context;
};

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarItem = (producto, cantidad = 1) => {
        setCarrito(prevCarrito => {
            const itemExistente = prevCarrito.find(item => item.id === producto.id);
            if (itemExistente) {
                return prevCarrito.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad }];
        });
    };

    const actualizarCantidad = (id, cantidad) => {
        if (cantidad < 1) return;
        setCarrito(prevCarrito =>
            prevCarrito.map(item =>
                item.id === id ? { ...item, cantidad } : item
            )
        );
    };

    const eliminarItem = (id) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    };

    const limpiarCarrito = () => {
        setCarrito([]);
    };

    const obtenerTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const obtenerCantidadTotal = () => {
        return carrito.reduce((total, item) => total + (item.cantidad || 1), 0);
    };

    const value = {
        carrito,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        limpiarCarrito,
        obtenerTotal,
        obtenerCantidadTotal
    };

    return (
        <CarritoContext.Provider value={value}>
            {children}
        </CarritoContext.Provider>
    );
};

export default CarritoContext;