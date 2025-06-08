import { useState, useEffect } from 'react';

export const useLocalStorage = (clave, valorInicial) => {
  const [valor, setValor] = useState(() => {
    try {
      const item = window.localStorage.getItem(clave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (error) {
      console.error(`Error al leer localStorage key "${clave}":`, error);
      return valorInicial;
    }
  });

  const setValorGuardado = (valorNuevo) => {
    try {
      setValor(valorNuevo);
      window.localStorage.setItem(clave, JSON.stringify(valorNuevo));
    } catch (error) {
      console.error(`Error al guardar en localStorage key "${clave}":`, error);
    }
  };

  return [valor, setValorGuardado];
};

