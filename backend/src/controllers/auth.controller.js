const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol, DireccionEnvio } = require('../models');

const formatearError = (mensaje) => ({
  success: false,
  error: mensaje,
  timestamp: new Date().toISOString()
});

const formatearRespuesta = (mensaje, datos = null) => ({
  success: true,
  message: mensaje,
  ...(datos && { data: datos }),
  timestamp: new Date().toISOString()
});

class AuthController {
  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      console.log(`🔍 Intentando login para: ${email}`);

      // Buscar usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      console.log(`👤 Usuario encontrado: ${usuario ? 'Sí' : 'No'}`);

      if (!usuario) {
        return res.status(400).json(formatearError('Credenciales inválidas'));
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(400).json(formatearError('Credenciales inválidas'));
      }

      // Buscar rol por separado
      const rol = await Rol.findByPk(usuario.rol_id);

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          rol_id: usuario.rol_id 
        },
        process.env.JWT_SECRET || 'ferremas_secret_key',
        { expiresIn: '30d' } // Extender a 30 días para desarrollo
      );

      console.log(`✅ Login exitoso para: ${email} Rol: ${rol ? rol.nombre : 'sin_rol'}`);

      res.json(formatearRespuesta(
        'Login exitoso',
        {
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: rol ? rol.nombre : 'sin_rol'
          }
        }
      ));

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Registro
  async registro(req, res) {
    try {
      const { nombre, email, password } = req.body;

      // Verificar si el email ya existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json(formatearError('El email ya está registrado'));
      }

      // Buscar rol de cliente
      const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
      if (!rolCliente) {
        return res.status(500).json(formatearError('Error de configuración: rol cliente no encontrado'));
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Crear usuario
      const usuario = await Usuario.create({
        nombre,
        email,
        password: passwordHash,
        rol_id: rolCliente.id,
        activo: true
      });

      // Crear dirección de envío vacía (permitiendo nulos en campos requeridos)
      try {
        await DireccionEnvio.create({
          usuario_id: usuario.id,
          alias: 'Principal',
          nombre_receptor: null,
          telefono_receptor: null,
          direccion: null,
          numero: null,
          depto_oficina: null,
          comuna: null,
          ciudad: null,
          region: null,
          codigo_postal: null,
          instrucciones_entrega: null,
          es_principal: true,
          activo: true
        });
      } catch (direccionError) {
        // Si falla la creación de dirección, eliminar el usuario creado
        await usuario.destroy();
        return res.status(500).json(formatearError('Error al crear dirección de envío para el usuario'));
      }

      res.status(201).json(formatearRespuesta(
        'Usuario registrado exitosamente',
        {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: 'cliente'
        }
      ));

    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Obtener perfil
  async obtenerPerfil(req, res) {
    try {
      const usuario_id = req.user.id;
      
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json(formatearError('Usuario no encontrado'));
      }

      // Buscar rol por separado
      const rol = await Rol.findByPk(usuario.rol_id);

      res.json(formatearRespuesta(
        'Perfil obtenido exitosamente',
        {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: rol ? rol.nombre : 'sin_rol',
          activo: usuario.activo
        }
      ));

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Actualizar perfil
  async actualizarPerfil(req, res) {
    try {
      const { nombre, email } = req.body;
      const usuario_id = req.user.id;

      // Verificar si el nuevo email ya existe
      if (email) {
        const { Op } = require('sequelize');
        const emailExistente = await Usuario.findOne({
          where: { 
            email,
            id: { [Op.ne]: usuario_id }
          }
        });

        if (emailExistente) {
          return res.status(400).json(formatearError('El email ya está en uso'));
        }
      }

      // Actualizar usuario
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json(formatearError('Usuario no encontrado'));
      }

      await usuario.update({
        ...(nombre && { nombre }),
        ...(email && { email })
      });

      // Buscar rol por separado
      const rol = await Rol.findByPk(usuario.rol_id);

      res.json(formatearRespuesta(
        'Perfil actualizado exitosamente',
        {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: rol ? rol.nombre : 'sin_rol',
          activo: usuario.activo
        }
      ));
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Cambiar contraseña
  async cambiarPassword(req, res) {
    try {
      const { password_actual, password_nueva } = req.body;
      const usuario_id = req.user.id;

      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) {
        return res.status(404).json(formatearError('Usuario no encontrado'));
      }

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(password_actual, usuario.password);
      if (!passwordValida) {
        return res.status(400).json(formatearError('Contraseña actual incorrecta'));
      }

      // Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password_nueva, salt);

      await usuario.update({ password: passwordHash });

      res.json(formatearRespuesta('Contraseña cambiada exitosamente'));
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }
}

module.exports = new AuthController();