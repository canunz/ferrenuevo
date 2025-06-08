import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export const useBusqueda = (datos, camposBusqueda, retraso = 300) => {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState(datos);
  const terminoDebounced = useDebounce(termino, retraso);

  useEffect(() => {
    if (!terminoDebounced.trim()) {
      setResultados(datos);
      return;
    }

    const resultadosFiltrados = datos.filter(item => {
      return camposBusqueda.some(campo => {
        const valor = campo.split('.').reduce((obj, key) => obj?.[key], item);
        return valor?.toString().toLowerCase().includes(terminoDebounced.toLowerCase());
      });
    });

    setResultados(resultadosFiltrados);
  }, [terminoDebounced, datos, camposBusqueda]);

  const limpiarBusqueda = () => {
    setTermino('');
  };

  return {
    termino,
    setTermino,
    resultados,
    limpiarBusqueda,
    sinResultados: resultados.length === 0 && termino.trim() !== ''
  };
};