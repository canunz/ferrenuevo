// ============================================
const { 
    Usuario, 
    DireccionEnvio, 
    HistorialCompras, 
    PreferenciasCliente,
    SegmentacionClientes,
    ComunicacionesCliente,
    Pedido,
    DetallePedido,
    Producto,
    Rol,
    Categoria,
    Marca
  } = require('../models');
  const { Op } = require('sequelize');
  const { formatearRespuesta, formatearError, paginar, formatearPaginacion } = require('../utils/helpers');
  const { sequelize } = require('../models');
  
  class ClientesController {
    // =====================
    // GESTIÓN DE CLIENTES
    // =====================
  
    // Listar clientes con manejo de errores mejorado
    async listarClientes(req, res) {
      try {
        console.log('🔄 Iniciando listarClientes...');
        
        const { 
          page = 1, 
          limit = 10, 
          busqueda, 
          segmento, 
          tipo_cliente,
          orden = 'nombre',
          direccion = 'ASC' 
        } = req.query;

        const { offset, limit: limitNum } = paginar(page, limit);
        console.log(`📄 Paginación: página ${page}, límite ${limitNum}, offset ${offset}`);

        // Construir condiciones de búsqueda de forma segura
        const where = {};
        
        // Obtener rol de cliente de forma segura
        let rolClienteId = null;
        try {
          const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
          rolClienteId = rolCliente ? rolCliente.id : 3; // fallback al ID 3
          console.log(`👥 Rol cliente ID: ${rolClienteId}`);
        } catch (rolError) {
          console.warn('⚠️ Error al obtener rol cliente, usando ID por defecto:', rolError.message);
          rolClienteId = 3; // ID por defecto para clientes
        }
        
        where.rol_id = rolClienteId;

        // Búsqueda por texto (solo si se proporciona)
        if (busqueda && busqueda.trim()) {
          where[Op.or] = [
            { nombre: { [Op.like]: `%${busqueda.trim()}%` } },
            { email: { [Op.like]: `%${busqueda.trim()}%` } }
          ];
          console.log(`🔍 Búsqueda aplicada: ${busqueda}`);
        }

        // Filtros específicos
        if (segmento) {
          where.segmento = segmento;
          console.log(`🎯 Filtro segmento: ${segmento}`);
        }
        if (tipo_cliente) {
          where.tipo_cliente = tipo_cliente;
          console.log(`🏢 Filtro tipo cliente: ${tipo_cliente}`);
        }

        console.log('🔧 Condiciones WHERE:', JSON.stringify(where, null, 2));

        // Consulta simplificada sin includes problemáticos
        const { count, rows: clientes } = await Usuario.findAndCountAll({
          where,
          include: [
            { model: Rol, as: 'rol', required: false }
          ],
          order: [[orden, direccion.toUpperCase()]],
          limit: limitNum,
          offset,
          distinct: true
        });

        console.log(`✅ Consulta exitosa: ${clientes.length} clientes encontrados de ${count} total`);

        // Procesar resultados de forma segura
        const clientesConEstadisticas = await Promise.all(
          clientes.map(async (cliente) => {
            try {
              // Obtener estadísticas básicas de forma segura
              const estadisticas = await ClientesController.prototype.obtenerEstadisticasBasicas(cliente.id);
              
              const clienteData = cliente.toJSON();
              
              return {
                ...clienteData,
                estadisticas
              };
            } catch (clienteError) {
              console.warn(`⚠️ Error al procesar cliente ${cliente.id}:`, clienteError.message);
              // Retornar cliente sin estadísticas en caso de error
              const clienteData = cliente.toJSON();
              clienteData.estadisticas = { error: 'No disponible' };
              return clienteData;
            }
          })
        );

        const respuesta = {
          success: true,
          message: `Clientes obtenidos exitosamente (${clientesConEstadisticas.length} de ${count})`,
          data: clientesConEstadisticas,
          pagination: formatearPaginacion(page, limitNum, count),
          filtros_aplicados: {
            busqueda: busqueda || null,
            segmento: segmento || null,
            tipo_cliente: tipo_cliente || null,
            orden: `${orden} ${direccion}`
          },
          timestamp: new Date().toISOString()
        };

        console.log('🎉 Respuesta preparada exitosamente');
        res.json(respuesta);

      } catch (error) {
        console.error('❌ Error crítico en listarClientes:', {
          message: error.message,
          stack: error.stack,
          sql: error.sql || 'No SQL disponible'
        });
        
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor al listar clientes',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
          timestamp: new Date().toISOString(),
          debug: process.env.NODE_ENV === 'development' ? {
            type: error.name,
            sql: error.sql
          } : undefined
        });
      }
    }

    // Obtener detalle de un cliente con manejo robusto
    async obtenerCliente(req, res) {
      try {
        const { id } = req.params;
        console.log(`🔍 Obteniendo cliente ID: ${id}`);

        if (!id || isNaN(parseInt(id))) {
          return res.status(400).json({
            success: false,
            error: 'ID de cliente inválido',
            timestamp: new Date().toISOString()
          });
        }

        // Consulta básica del cliente
        const cliente = await Usuario.findOne({
          where: { id },
          include: [
            { model: Rol, as: 'rol', required: false }
          ]
        });

        if (!cliente) {
          return res.status(404).json({
            success: false,
            error: 'Cliente no encontrado',
            timestamp: new Date().toISOString()
          });
        }

        // Procesar datos de forma segura
        const clienteObj = cliente.toJSON();

        // Dirección de envío principal
        let direccionEnvio = null;
        try {
          direccionEnvio = await DireccionEnvio.findOne({ where: { usuario_id: id }, order: [['id', 'DESC']] });
        } catch (e) {
          direccionEnvio = null;
        }

        // Estadísticas de compras
        let estadisticas = {
          total_compras: 0,
          monto_total: 0,
          ticket_promedio: 0,
          ultima_compra: null,
          ultimos_3_meses: 0,
          dias_sin_comprar: null,
          error: 'Estadísticas no disponibles'
        };
        try {
          const statsResult = await ClientesController.prototype.obtenerEstadisticasCompletas(cliente.id);
          if (statsResult && !statsResult.error) {
            estadisticas = statsResult;
          }
        } catch (e) {}

        // Últimos 5 pedidos con productos y detalle
        let pedidos = [];
        try {
          pedidos = await Pedido.findAll({
            where: { usuario_id: id },
            order: [['created_at', 'DESC']],
            limit: 5,
            include: [
              {
                model: DetallePedido,
                as: 'detalle_pedidos',
                include: [{ model: Producto, as: 'Producto' }]
              }
            ]
          });
        } catch (e) {
          pedidos = [];
        }

        res.json({
          success: true,
          data: {
            ...clienteObj,
            direccionEnvio,
            estadisticas,
            pedidos
          }
        });
      } catch (error) {
        console.error('❌ Error en obtenerCliente:', error);
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor al obtener cliente',
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Crear nuevo cliente
    async crearCliente(req, res) {
      const t = await sequelize.transaction();
      
      try {
        console.log('📥 Datos recibidos para crear cliente:', req.body);
        
        const {
          nombre, 
          email, 
          password
        } = req.body;

        console.log('🔍 Campos extraídos:', { nombre, email, password: password ? '***' : 'undefined' });

        // Validar campos requeridos
        if (!nombre || !email || !password) {
          console.log('❌ Validación fallida:', { 
            nombre: !!nombre, 
            email: !!email, 
            password: !!password 
          });
          return res.status(400).json(formatearError('Nombre, email y password son requeridos'));
        }

        // Verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
          return res.status(400).json(formatearError('El email ya está registrado'));
        }

        // Obtener rol de cliente
        const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
        if (!rolCliente) {
          throw new Error('Rol de cliente no encontrado');
        }

        // Hash de la contraseña
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear usuario con campos básicos
        const cliente = await Usuario.create({
          nombre,
          email,
          password: passwordHash,
          rol_id: rolCliente.id,
          activo: true
        }, { transaction: t });

        await t.commit();

        // Recuperar cliente con rol
        const clienteCompleto = await Usuario.findByPk(cliente.id, {
          include: [
            { model: Rol, as: 'rol', required: false }
          ]
        });

        console.log('✅ Cliente creado exitosamente:', clienteCompleto.id);

        res.status(201).json(formatearRespuesta(
          'Cliente creado exitosamente',
          clienteCompleto
        ));

      } catch (error) {
        await t.rollback();
        console.error('Error al crear cliente:', error);
        res.status(500).json(formatearError('Error al crear cliente: ' + error.message));
      }
    }

    // Actualizar cliente
    async actualizarCliente(req, res) {
      try {
        const { id } = req.params;
        const datosActualizacion = req.body;
        console.log('Datos recibidos para actualizar cliente:', datosActualizacion);
  
        const cliente = await Usuario.findByPk(id);
        if (!cliente) {
          return res.status(404).json(formatearError('Cliente no encontrado'));
        }

        // Si se está actualizando el email, verificar que no esté en uso por otro usuario
        if (datosActualizacion.email && datosActualizacion.email !== cliente.email) {
          const emailExistente = await Usuario.findOne({
            where: {
              email: datosActualizacion.email,
              id: { [Op.ne]: id } // Excluir el usuario actual
            }
          });
          
          if (emailExistente) {
            return res.status(400).json(formatearError('El email ya está en uso por otro usuario'));
          }
        }
  
        await cliente.update(datosActualizacion);
  
        res.json(formatearRespuesta(
          'Cliente actualizado exitosamente',
          cliente
        ));
  
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
        
        // Manejar errores específicos de Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json(formatearError('El email ya está en uso'));
        }
        
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }

    // Eliminar cliente
    async eliminarCliente(req, res) {
      try {
        const { id } = req.params;
        const cliente = await Usuario.findByPk(id);
        if (!cliente) {
          return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }
        await cliente.destroy();
        res.json({ success: true, message: 'Cliente eliminado exitosamente' });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Error al eliminar cliente' });
      }
    }

    // =====================
    // MÉTODOS DE UTILIDAD MEJORADOS
    // =====================

    // Obtener estadísticas básicas con manejo de errores
    async obtenerEstadisticasBasicas(clienteId) {
      try {
        // Verificar si la tabla historial_compras existe
        const [results] = await sequelize.query("SHOW TABLES LIKE 'historial_compras'");
        if (results.length === 0) {
          // Si la tabla no existe, devolver estadísticas por defecto
          return {
            total_compras: 0,
            monto_total: 0,
            ticket_promedio: 0,
            ultima_compra: null,
            tabla_no_existe: true
          };
        }

        const estadisticas = await HistorialCompras.findOne({
          where: { usuario_id: clienteId },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'total_compras'],
            [sequelize.fn('SUM', sequelize.col('monto_total')), 'monto_total'],
            [sequelize.fn('AVG', sequelize.col('monto_total')), 'ticket_promedio'],
            [sequelize.fn('MAX', sequelize.col('fecha_compra')), 'ultima_compra']
          ],
          raw: true
        });

        return {
          total_compras: parseInt(estadisticas?.total_compras) || 0,
          monto_total: parseFloat(estadisticas?.monto_total) || 0,
          ticket_promedio: parseFloat(estadisticas?.ticket_promedio) || 0,
          ultima_compra: estadisticas?.ultima_compra || null
        };
      } catch (error) {
        console.warn(`⚠️ Error al obtener estadísticas básicas para cliente ${clienteId}:`, error.message);
        return {
          total_compras: 0,
          monto_total: 0,
          ticket_promedio: 0,
          ultima_compra: null,
          error: 'Estadísticas no disponibles'
        };
      }
    }

    // Obtener estadísticas completas con manejo robusto
    async obtenerEstadisticasCompletas(clienteId) {
      try {
        // Estadísticas generales
        const general = await ClientesController.prototype.obtenerEstadisticasBasicas(clienteId);

        // Compras últimos 3 meses
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);

        let comprasRecientes = 0;
        try {
          comprasRecientes = await HistorialCompras.count({
            where: {
              usuario_id: clienteId,
              fecha_compra: { [Op.gte]: tresMesesAtras }
            }
          });
        } catch (e) {
          console.warn('Error al obtener compras recientes:', e.message);
        }

        // Días sin comprar
        const diasSinComprar = general.ultima_compra
          ? Math.floor((new Date() - new Date(general.ultima_compra)) / (1000 * 60 * 60 * 24))
          : null;

        return {
          compras: {
            ...general,
            ultimos_3_meses: comprasRecientes,
            dias_sin_comprar: diasSinComprar
          }
        };
      } catch (error) {
        console.warn(`⚠️ Error al obtener estadísticas completas para cliente ${clienteId}:`, error.message);
        return {
          compras: {
            total_compras: 0,
            monto_total: 0,
            ticket_promedio: 0,
            ultima_compra: null,
            ultimos_3_meses: 0,
            dias_sin_comprar: null
          },
          error: 'Estadísticas no disponibles'
        };
      }
    }

    // Método de diagnóstico para debugging
    async diagnosticarConexiones(req, res) {
      try {
        const diagnostico = {
          timestamp: new Date().toISOString(),
          base_datos: {},
          modelos: {},
          relaciones: {}
        };

        // Probar conexión a base de datos
        try {
          await sequelize.authenticate();
          diagnostico.base_datos.conexion = 'OK';
        } catch (error) {
          diagnostico.base_datos.conexion = 'ERROR: ' + error.message;
        }

        // Probar modelos principales
        const modelosPrueba = [
          { nombre: 'Usuario', modelo: Usuario },
          { nombre: 'Rol', modelo: Rol },
          { nombre: 'DireccionEnvio', modelo: DireccionEnvio },
          { nombre: 'HistorialCompras', modelo: HistorialCompras }
        ];

        for (const { nombre, modelo } of modelosPrueba) {
          try {
            const count = await modelo.count();
            diagnostico.modelos[nombre] = `OK (${count} registros)`;
          } catch (error) {
            diagnostico.modelos[nombre] = 'ERROR: ' + error.message;
          }
        }

        // Probar relaciones
        try {
          const usuarioConRol = await Usuario.findOne({
            include: [{ model: Rol, as: 'rol' }],
            limit: 1
          });
          diagnostico.relaciones.usuario_rol = usuarioConRol ? 'OK' : 'Sin datos';
        } catch (error) {
          diagnostico.relaciones.usuario_rol = 'ERROR: ' + error.message;
        }

        res.json({
          success: true,
          message: 'Diagnóstico completado',
          data: diagnostico
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Error en diagnóstico',
          details: error.message
        });
      }
    }

    // Obtener dirección de envío de un cliente
    async obtenerDireccionEnvio(req, res) {
      try {
        const { id } = req.params;
        const cliente = await Usuario.findByPk(id);
        if (!cliente) {
          return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }
        const direccion = await DireccionEnvio.findOne({ where: { usuario_id: id } });
        // Cambiado: si no hay dirección, devolver success: true y data: null
        if (!direccion) {
          return res.json({ success: true, data: null });
        }
        res.json({ success: true, data: direccion });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener dirección de envío', details: error.message });
      }
    }

    // Crear o actualizar dirección de envío de un cliente
    async actualizarDireccionEnvio(req, res) {
      try {
        const { id } = req.params;
        const cliente = await Usuario.findByPk(id);
        if (!cliente) {
          return res.status(404).json({ success: false, error: 'Cliente no encontrado' });
        }
        const datosDireccion = req.body;
        let direccion = await DireccionEnvio.findOne({ where: { usuario_id: id } });
        if (direccion) {
          await direccion.update(datosDireccion);
        } else {
          direccion = await DireccionEnvio.create({ ...datosDireccion, usuario_id: id });
        }
        res.json({ success: true, data: direccion });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Error al actualizar dirección de envío', details: error.message });
      }
    }

    // Obtener historial de compras de un cliente (con productos)
    async obtenerHistorialCompras(req, res) {
      try {
        const { id } = req.params;
        const historial = await HistorialCompras.findAll({
          where: { usuario_id: id },
          order: [['fecha_compra', 'DESC']]
        });

        // Para cada compra, buscar los productos asociados al pedido
        const { DetallePedido, Producto } = require('../models');
        const historialConProductos = await Promise.all(historial.map(async (compra) => {
          let productos = [];
          if (compra.pedido_id) {
            productos = await DetallePedido.findAll({
              where: { pedido_id: compra.pedido_id },
              include: [{ model: Producto, as: 'Producto', attributes: ['id', 'nombre'] }]
            });
          }
          return {
            ...compra.toJSON(),
            productos: productos.map(p => ({
              id: p.Producto?.id,
              nombre: p.Producto?.nombre,
              cantidad: p.cantidad,
              precio_unitario: p.precio_unitario
            }))
          };
        }));

        res.json(historialConProductos);
      } catch (error) {
        console.error('Error en obtenerHistorialCompras:', error, error?.message, error?.stack);
        res.status(500).json({ success: false, error: 'Error al obtener historial de compras', details: error.message });
      }
    }
  }

  module.exports = new ClientesController();