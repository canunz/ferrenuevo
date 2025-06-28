const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Acceso denegado',
        message: 'No se proporcionó token de autenticación',
        timestamp: new Date().toISOString()
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ferremas_secret_key');
    
    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        message: 'Usuario no encontrado o inactivo',
        timestamp: new Date().toISOString()
      });
    }

    // Buscar rol
    const rol = await Rol.findByPk(usuario.rol_id);
    
    // Agregar datos del usuario a la request
    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
      rol: rol ? rol.nombre : 'sin_rol'
    };

    next();
  } catch (error) {
    console.error('Error en middleware de auth:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: 'Error al verificar token',
      timestamp: new Date().toISOString()
    });
  }
};

// Middleware para verificar roles específicos
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
        message: 'Se requiere autenticación',
        timestamp: new Date().toISOString()
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        message: `Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

// Middleware para verificar si es administrador
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'No autenticado',
      message: 'Se requiere autenticación',
      timestamp: new Date().toISOString()
    });
  }

  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      error: 'Acceso denegado',
      message: 'Se requiere rol de administrador',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

module.exports = {
  verificarToken,
  verificarRol,
  adminOnly
};
