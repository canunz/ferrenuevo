import React, { createContext, useContext, useState, useEffect } from 'react';

const ContextoTema = createContext();

export const useTema = () => {
  const context = useContext(ContextoTema);
  if (!context) {
    throw new Error('useTema debe ser usado dentro de TemaProvider');
  }
  return context;
};

export const TemaProvider = ({ children }) => {
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    // Verificar preferencia guardada
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
      setModoOscuro(temaGuardado === 'oscuro');
    } else {
      // Verificar preferencia del sistema
      setModoOscuro(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al documento
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tema', 'claro');
    }
  }, [modoOscuro]);

  const alternarTema = () => {
    setModoOscuro(!modoOscuro);
  };

  const valor = {
    modoOscuro,
    alternarTema
  };

  return (
    <ContextoTema.Provider value={valor}>
      {children}
    </ContextoTema.Provider>
  );
};