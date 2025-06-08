export const generarID = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  export const slugify = (texto) => {
    return texto
      .toLowerCase()
      .trim()
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  export const capitalizar = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };
  
  export const truncarTexto = (texto, longitud = 100) => {
    if (!texto || texto.length <= longitud) return texto;
    return texto.slice(0, longitud).trim() + '...';
  };
  
  export const obtenerIniciales = (nombre) => {
    if (!nombre) return '';
    return nombre
      .split(' ')
      .map(palabra => palabra.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  export const calcularPorcentaje = (valor, total) => {
    if (total === 0) return 0;
    return (valor / total) * 100;
  };
  
  export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };
  
  export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  export const descargarArchivo = (data, filename, type = 'text/plain') => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  export const copiarAlPortapapeles = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      return false;
    }
  };
  
  export const obtenerParametrosURL = () => {
    return new URLSearchParams(window.location.search);
  };
  
  export const construirURL = (base, parametros = {}) => {
    const url = new URL(base);
    Object.keys(parametros).forEach(key => {
      if (parametros[key] !== null && parametros[key] !== undefined) {
        url.searchParams.append(key, parametros[key]);
      }
    });
    return url.toString();
  };
  