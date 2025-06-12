import React, { useState } from 'react';
import { useFormulario } from '../../hooks/useFormulario';
import { servicioProductos } from '../../servicios/servicioProductos';
import UploadImagen from '../comun/UploadImagen';

const FormularioProducto = ({ producto, onSubmit, onCancel }) => {
  const [imagenPreview, setImagenPreview] = useState(producto?.imagen || null);
  const [cargando, setCargando] = useState(false);

  const validaciones = {
    nombre: (valor) => !valor ? 'El nombre es requerido' : '',
    precio: (valor) => {
      if (!valor) return 'El precio es requerido';
      if (isNaN(valor) || valor <= 0) return 'El precio debe ser un número positivo';
      return '';
    },
    stock: (valor) => {
      if (!valor) return 'El stock es requerido';
      if (isNaN(valor) || valor < 0) return 'El stock debe ser un número no negativo';
      return '';
    },
    categoria: (valor) => !valor ? 'La categoría es requerida' : '',
    marca: (valor) => !valor ? 'La marca es requerida' : '',
  };

  const { valores, errores, tocados, manejarCambio, manejarBlur, validarFormulario } = useFormulario(
    {
      nombre: producto?.nombre || '',
      descripcion: producto?.descripcion || '',
      precio: producto?.precio || '',
      stock: producto?.stock || '',
      categoria: producto?.categoria?.id || '',
      marca: producto?.marca?.id || '',
      imagen: null,
    },
    validaciones
  );

  const manejarCambioImagen = (archivo, preview) => {
    setImagenPreview(preview);
    manejarCambio({
      target: {
        name: 'imagen',
        value: archivo
      }
    });
  };

  const manejarEliminarImagen = () => {
    setImagenPreview(null);
    manejarCambio({
      target: {
        name: 'imagen',
        value: null
      }
    });
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    try {
      const formData = new FormData();
      Object.keys(valores).forEach(key => {
        if (key === 'imagen' && valores[key]) {
          formData.append('imagen', valores[key]);
        } else {
          formData.append(key, valores[key]);
        }
      });

      if (producto?.id) {
        await servicioProductos.actualizar(producto.id, formData);
      } else {
        await servicioProductos.crear(formData);
      }

      onSubmit();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert('Error al guardar el producto. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-6">
      {/* Campo de imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen del Producto
        </label>
        <UploadImagen
          imagenPreview={imagenPreview}
          onImagenChange={manejarCambioImagen}
          onEliminarImagen={manejarEliminarImagen}
        />
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={valores.nombre}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            tocados.nombre && errores.nombre
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {tocados.nombre && errores.nombre && (
          <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          value={valores.descripcion}
          onChange={manejarCambio}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Precio */}
      <div>
        <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
          Precio
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="precio"
            name="precio"
            value={valores.precio}
            onChange={manejarCambio}
            onBlur={manejarBlur}
            className={`block w-full pl-7 rounded-md shadow-sm ${
              tocados.precio && errores.precio
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </div>
        {tocados.precio && errores.precio && (
          <p className="mt-1 text-sm text-red-600">{errores.precio}</p>
        )}
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
          Stock
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={valores.stock}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            tocados.stock && errores.stock
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {tocados.stock && errores.stock && (
          <p className="mt-1 text-sm text-red-600">{errores.stock}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="categoria"
          name="categoria"
          value={valores.categoria}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            tocados.categoria && errores.categoria
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="">Selecciona una categoría</option>
          {/* Aquí se cargarían las categorías desde el backend */}
        </select>
        {tocados.categoria && errores.categoria && (
          <p className="mt-1 text-sm text-red-600">{errores.categoria}</p>
        )}
      </div>

      {/* Marca */}
      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
          Marca
        </label>
        <select
          id="marca"
          name="marca"
          value={valores.marca}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            tocados.marca && errores.marca
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        >
          <option value="">Selecciona una marca</option>
          {/* Aquí se cargarían las marcas desde el backend */}
        </select>
        {tocados.marca && errores.marca && (
          <p className="mt-1 text-sm text-red-600">{errores.marca}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={cargando}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {cargando ? 'Guardando...' : producto?.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default FormularioProducto;
