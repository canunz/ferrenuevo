// ==========================================
// ARCHIVO: frontend/src/componentes/productos/TarjetaProducto.jsx
// ==========================================
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  HeartIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const TarjetaProducto = ({ 
  producto, 
  onAgregarAlCarrito, 
  onToggleFavorito, 
  esFavorito = false,
  mostrarAcciones = true 
}) => {
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const obtenerImagenProducto = (imagen) => {
    if (!imagen) {
      return '/assets/imagenes/productos/placeholder.jpg';
    }
    // CORRECCIÓN DEFINITIVA DE RUTA DE IMAGEN
    return `http://localhost:3000/static/productos/${imagen}`;
  };

  // DEMOSTRACIÓN: Aplicar un descuento visual a un producto específico
  if (producto.nombre.toLowerCase().includes('sierra circular bosch')) {
    producto.precio_oferta = producto.precio * 0.90; // 10% de descuento
  }

  const tieneDescuento = producto.precio_oferta && producto.precio_oferta < producto.precio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={obtenerImagenProducto(producto.imagen)}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Si la imagen falla, mostramos un ícono de producto
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback cuando la imagen no carga */}
        <div 
          className="hidden w-full h-full items-center justify-center bg-gray-200"
          style={{ display: 'none' }}
        >
          <div className="text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
          </div>
        </div>
        
        {/* Badge de descuento */}
        {tieneDescuento && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((producto.precio - producto.precio_oferta) / producto.precio) * 100)}%
          </div>
        )}

        {/* Badge de marca */}
        {producto.marca && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
            {producto.marca.nombre}
          </div>
        )}

        {/* Acciones rápidas */}
        {mostrarAcciones && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onToggleFavorito(producto.id)}
                className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
              >
                {esFavorito ? (
                  <HeartSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <Link
                to={`/producto/${producto.id}`}
                className="bg-white p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
              >
                <EyeIcon className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        {/* Categoría */}
        {producto.categoria && (
          <div className="text-xs text-gray-500 mb-1">
            {producto.categoria.nombre}
          </div>
        )}

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {producto.nombre}
        </h3>

        {/* CÓDIGO SKU */}
        {producto.codigo_sku && (
          <p className="text-xs text-gray-400 mb-2 font-mono">
            SKU: {producto.codigo_sku}
          </p>
        )}

        {/* Descripción */}
        {producto.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        {/* Precios */}
        <div className="mb-3">
          {tieneDescuento ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-600">
                {formatearPrecio(producto.precio_oferta)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatearPrecio(producto.precio)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatearPrecio(producto.precio)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="text-sm text-gray-600 mb-3">
          {/* MUESTRA STOCK NUMÉRICO */}
          {producto.stock_actual > 0 ? (
            <span className="text-green-600 font-semibold">✓ Stock: {producto.stock_actual}</span>
          ) : (
            <span className="text-red-600 font-semibold">✗ Agotado</span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          {mostrarAcciones && producto.stock_actual > 0 && (
            <button
              onClick={() => onAgregarAlCarrito(producto)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Agregar</span>
            </button>
          )}

          {/* BOTÓN "VER DETALLE" AÑADIDO */}
          <Link
            to={`/producto/${producto.id}`}
            className="w-full block text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TarjetaProducto;
