import { useState, useMemo } from 'react';

export const usePaginacion = (datos, elementosPorPagina = 10) => {
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(datos.length / elementosPorPagina);

  const datosActuales = useMemo(() => {
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return datos.slice(inicio, fin);
  }, [datos, paginaActual, elementosPorPagina]);

  const irAPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const paginaAnterior = () => {
    irAPagina(paginaActual - 1);
  };

  const paginaSiguiente = () => {
    irAPagina(paginaActual + 1);
  };

  const primeraPagina = () => {
    irAPagina(1);
  };

  const ultimaPagina = () => {
    irAPagina(totalPaginas);
  };

  return {
    paginaActual,
    totalPaginas,
    datosActuales,
    irAPagina,
    paginaAnterior,
    paginaSiguiente,
    primeraPagina,
    ultimaPagina,
    tienePaginaAnterior: paginaActual > 1,
    tienePaginaSiguiente: paginaActual < totalPaginas,
    totalElementos: datos.length,
    elementosPorPagina
  };
};
