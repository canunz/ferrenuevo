export const formatearMoneda = (valor, moneda = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0,
    }).format(valor);
  };
  
  export const formatearNumero = (valor) => {
    return new Intl.NumberFormat('es-CL').format(valor);
  };
  
  export const formatearPorcentaje = (valor, decimales = 1) => {
    return `${valor.toFixed(decimales)}%`;
  };
  
  export const formatearFecha = (fecha, formato = 'dd/MM/yyyy') => {
    if (!fecha) return '';
    
    const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
    
    if (formato === 'dd/MM/yyyy') {
      return fechaObj.toLocaleDateString('es-CL');
    } else if (formato === 'dd/MM/yyyy HH:mm') {
      return fechaObj.toLocaleString('es-CL');
    }
    
    return fechaObj.toLocaleDateString('es-CL');
  };
  
  export const formatearTelefono = (telefono) => {
    if (!telefono) return '';
    
    // Formato chileno: +56 9 1234 5678
    const cleaned = telefono.replace(/\D/g, '');
    
    if (cleaned.length === 9) {
      return `+56 9 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('569')) {
      return `+56 9 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
    }
    
    return telefono;
  };
  
  export const formatearRUT = (rut) => {
    if (!rut) return '';
    
    // Limpiar el RUT
    const cleaned = rut.replace(/[^\dKk]/g, '');
    
    if (cleaned.length < 2) return cleaned;
    
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    // Agregar puntos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedBody}-${dv}`;
  };
  