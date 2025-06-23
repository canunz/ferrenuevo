// ============================================
// CONTROLADOR USUARIOS - src/controllers/usuarios.controller.js
// ============================================
const { Usuario, Rol } = require('../models');
const bcrypt = require('bcryptjs');

class UsuariosController {
  // Listar usuarios
  async listarUsuarios(req, res) {
    try {
      const { page = 1, limit = 10, rol_id, activo } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (rol_id) whereClause.rol_id = rol_id;
      if (activo !== undefined) whereClause.activo = activo === 'true';

      const usuarios = await Usuario.findAndCountAll({
        where: whereClause,
        include: [{ 
          model: Rol, 
          as: 'rol', 
          attributes: ['id', 'nombre', 'descripcion'] 
        }],
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: usuarios.rows,
        pagination: {
          total: usuarios.count,
          page: parseInt(page),
          pages: Math.ceil(usuarios.count / limit),
          limit: parseInt(limit)
        },
        message: 'Usuarios obtenidos exitosamente'
      });
    } catch (error) {
      console.error('❌ Error listando usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuarios',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Crear nuevo usuario
  async crearUsuario(req, res) {
    try {
      const { 
        nombre, 
        email, 
        password, 
        telefono, 
        direccion, 
        rol_id = 1 
      } = req.body;

      // Verificar que no exista el email
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 12);

      // Crear usuario
      const usuario = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        telefono,
        direccion,
        rol_id,
        activo: true
      });

      // Obtener usuario con rol
      const usuarioCompleto = await Usuario.findByPk(usuario.id, {
        include: [{ 
          model: Rol, 
          as: 'rol', 
          attributes: ['id', 'nombre'] 
        }],
        attributes: { exclude: ['password'] }
      });

      res.status(201).json({
        success: true,
        data: usuarioCompleto,
        message: 'Usuario creado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear usuario',
        details: error.message
      });
    }
  }

  // Obtener usuario por ID
  async obtenerUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        include: [{ 
          model: Rol, 
          as: 'rol', 
          attributes: ['id', 'nombre', 'descripcion'] 
        }],
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario'
      });
    }
  }

  // Actualizar usuario
  async actualizarUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, telefono, direccion, rol_id, activo } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Verificar email único si se está cambiando
      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ 
          where: { email, id: { [require('sequelize').Op.ne]: id } } 
        });
        if (emailExistente) {
          return res.status(400).json({
            success: false,
            error: 'El email ya está en uso'
          });
        }
      }

      await usuario.update({
        nombre: nombre || usuario.nombre,
        email: email || usuario.email,
        telefono: telefono || usuario.telefono,
        direccion: direccion || usuario.direccion,
        rol_id: rol_id || usuario.rol_id,
        activo: activo !== undefined ? activo : usuario.activo
      });

      // Obtener usuario actualizado con rol
      const usuarioActualizado = await Usuario.findByPk(id, {
        include: [{ 
          model: Rol, 
          as: 'rol', 
          attributes: ['id', 'nombre'] 
        }],
        attributes: { exclude: ['password'] }
      });

      res.json({
        success: true,
        data: usuarioActualizado,
        message: 'Usuario actualizado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar usuario'
      });
    }
  }

  // Eliminar (desactivar) usuario
  async eliminarUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      await usuario.update({ activo: false });

      res.json({
        success: true,
        message: 'Usuario desactivado exitosamente'
      });
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar usuario'
      });
    }
  }

  // Cambiar contraseña
  async cambiarPassword(req, res) {
    try {
      const { id } = req.params;
      const { password_actual, password_nuevo } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Verificar contraseña actual
      const passwordValido = await bcrypt.compare(password_actual, usuario.password);
      if (!passwordValido) {
        return res.status(400).json({
          success: false,
          error: 'Contraseña actual incorrecta'
        });
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(password_nuevo, 12);
      await usuario.update({ password: hashedPassword });

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      res.status(500).json({
        success: false,
        error: 'Error al cambiar contraseña'
      });
    }
  }
}

// Exportar una instancia del controlador
module.exports = new UsuariosController();