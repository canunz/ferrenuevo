import React, { useState, useEffect } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

const UploadImagen = ({ 
  imagenPreview, 
  onImagenChange, 
  onEliminarImagen,
  maxSizeMB = 5,
  tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif']
}) => {
  const [error, setError] = useState(null);
  const [imagenesDisponibles, setImagenesDisponibles] = useState([]);

  useEffect(() => {
    // Cargar la lista de imágenes disponibles
    const cargarImagenes = async () => {
      try {
        const response = await fetch('/api/imagenes/productos');
        const data = await response.json();
        setImagenesDisponibles(data);
      } catch (error) {
        console.error('Error al cargar imágenes:', error);
      }
    };

    cargarImagenes();
  }, []);

  const validarImagen = (archivo) => {
    // Validar tipo de archivo
    if (!tiposPermitidos.includes(archivo.type)) {
      setError('Por favor, selecciona una imagen válida (JPG, PNG o GIF)');
      return false;
    }

    // Validar tamaño
    if (archivo.size > maxSizeMB * 1024 * 1024) {
      setError(`La imagen no debe superar los ${maxSizeMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const manejarCambioImagen = (evento) => {
    const archivo = evento.target.files[0];
    if (archivo && validarImagen(archivo)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImagenChange(archivo, reader.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  const manejarSeleccionImagen = (imagen) => {
    onImagenChange(null, `/assets/imagenes/productos/${imagen}`);
  };

  const manejarDragOver = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
  };

  const manejarDrop = (evento) => {
    evento.preventDefault();
    evento.stopPropagation();
    
    const archivo = evento.dataTransfer.files[0];
    if (archivo && validarImagen(archivo)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImagenChange(archivo, reader.result);
      };
      reader.readAsDataURL(archivo);
    }
  };

  return (
    <div className="space-y-4">
      {/* Vista previa de la imagen seleccionada */}
      {imagenPreview && (
        <div className="relative inline-block">
          <img
            src={imagenPreview}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={onEliminarImagen}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Área de carga de archivo */}
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
        onDragOver={manejarDragOver}
        onDrop={manejarDrop}
      >
        <div className="space-y-1 text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="imagen"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Subir una imagen</span>
              <input
                id="imagen"
                name="imagen"
                type="file"
                accept={tiposPermitidos.join(',')}
                className="sr-only"
                onChange={manejarCambioImagen}
              />
            </label>
            <p className="pl-1">o arrastrar y soltar</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF hasta {maxSizeMB}MB
          </p>
        </div>
      </div>

      {/* Galería de imágenes disponibles */}
      {imagenesDisponibles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Imágenes disponibles</h3>
          <div className="grid grid-cols-4 gap-2">
            {imagenesDisponibles.map((imagen, index) => (
              <div
                key={index}
                className="relative cursor-pointer group"
                onClick={() => manejarSeleccionImagen(imagen)}
              >
                <img
                  src={`/assets/imagenes/productos/${imagen}`}
                  alt={`Imagen ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default UploadImagen; 