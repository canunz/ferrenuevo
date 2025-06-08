import { useState, useEffect } from 'react';

export const useDebounce = (valor, retraso) => {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValorDebounced(valor);
    }, retraso);

    return () => {
      clearTimeout(handler);
    };
  }, [valor, retraso]);

  return valorDebounced;
};