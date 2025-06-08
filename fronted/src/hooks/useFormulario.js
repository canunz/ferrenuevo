import { useState, useCallback } from 'react';

export const useFormulario = (valoresIniciales, validaciones = {}) => {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});

  const manejarCambio = useCallback((evento) => {
    const { name, value, type, checked } = evento.target;
    const valorFinal = type === 'checkbox' ? checked : value;

    setValores(prev => ({
      ...prev,
      [name]: valorFinal
    }));

    // Limpiar error del campo cuando se modifica
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errores]);

  const manejarBlur = useCallback((evento) => {
    const { name } = evento.target;
    setTocados(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar campo al perder el foco
    if (validaciones[name]) {
      const error = validaciones[name](valores[name]);
      setErrores(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [valores, validaciones]);

  const validarFormulario = useCallback(() => {
    const nuevosErrores = {};
    
    Object.keys(validaciones).forEach(campo => {
      const error = validaciones[campo](valores[campo]);
      if (error) {
        nuevosErrores[campo] = error;
      }
    });

    setErrores(nuevosErrores);
    setTocados(Object.keys(validaciones).reduce((acc, campo) => {
      acc[campo] = true;
      return acc;
    }, {}));

    return Object.keys(nuevosErrores).length === 0;
  }, [valores, validaciones]);

  const reiniciarFormulario = useCallback(() => {
    setValores(valoresIniciales);
    setErrores({});
    setTocados({});
  }, [valoresIniciales]);

  const esValido = Object.keys(errores).length === 0;

  return {
    valores,
    errores,
    tocados,
    manejarCambio,
    manejarBlur,
    validarFormulario,
    reiniciarFormulario,
    esValido,
    setValores,
    setErrores
  };
};

