import { format, parseISO, isValid, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatearFechaLocal = (fecha, formato = 'dd/MM/yyyy') => {
  if (!fecha) return '';
  
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  
  if (!isValid(fechaObj)) return '';
  
  return format(fechaObj, formato, { locale: es });
};

export const fechaRelativa = (fecha) => {
  if (!fecha) return '';
  
  const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  const ahora = new Date();
  const diffMs = ahora - fechaObj;
  const diffMinutos = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutos < 1) return 'Ahora';
  if (diffMinutos < 60) return `Hace ${diffMinutos} minuto${diffMinutos === 1 ? '' : 's'}`;
  if (diffHoras < 24) return `Hace ${diffHoras} hora${diffHoras === 1 ? '' : 's'}`;
  if (diffDias < 30) return `Hace ${diffDias} día${diffDias === 1 ? '' : 's'}`;
  
  return formatearFechaLocal(fechaObj);
};

export const obtenerRangoSemana = (fecha = new Date()) => {
  return {
    inicio: startOfWeek(fecha, { locale: es }),
    fin: endOfWeek(fecha, { locale: es }),
  };
};

export const obtenerRangoMes = (fecha = new Date()) => {
  return {
    inicio: startOfMonth(fecha),
    fin: endOfMonth(fecha),
  };
};

export const esMismoDia = (fecha1, fecha2) => {
  const f1 = typeof fecha1 === 'string' ? parseISO(fecha1) : fecha1;
  const f2 = typeof fecha2 === 'string' ? parseISO(fecha2) : fecha2;
  
  return f1.toDateString() === f2.toDateString();
};

export const diasEntreFechas = (fechaInicio, fechaFin) => {
  const inicio = typeof fechaInicio === 'string' ? parseISO(fechaInicio) : fechaInicio;
  const fin = typeof fechaFin === 'string' ? parseISO(fechaFin) : fechaFin;
  
  const diffTime = Math.abs(fin - inicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};