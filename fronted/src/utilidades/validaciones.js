export const validarEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };
  
  export const validarRUT = (rut) => {
    if (!rut) return false;
    
    const cleaned = rut.replace(/[^\dKk]/g, '');
    
    if (cleaned.length < 8 || cleaned.length > 9) return false;
    
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();
    
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      suma += parseInt(body.charAt(i)) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto < 2 ? resto.toString() : (11 - resto === 10 ? 'K' : (11 - resto).toString());
    
    return dv === dvCalculado;
  };
  
  export const validarTelefono = (telefono) => {
    if (!telefono) return false;
    
    const cleaned = telefono.replace(/\D/g, '');
    
    // Validar formato chileno
    return cleaned.length === 9 || (cleaned.length === 11 && cleaned.startsWith('569'));
  };
  
  export const validarPassword = (password) => {
    if (!password || password.length < 6) return false;
    
    // Al menos una letra y un número
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return hasLetter && hasNumber;
  };
  
  export const validarCodigoPostal = (codigo) => {
    if (!codigo) return false;
    
    // Formato chileno: 7 dígitos
    const cleaned = codigo.replace(/\D/g, '');
    return cleaned.length === 7;
  };
  