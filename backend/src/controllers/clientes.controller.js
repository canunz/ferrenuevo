// ============================================
<<<<<<< HEAD
// src/controllers/clientes.controller.js
=======
// src/controllers/clientes.controller.js - VERSIÓN MEJORADA
>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
// ============================================
const { 
    Usuario, 
    DireccionEnvio, 
    HistorialCompras, 
    PreferenciasCliente,
<<<<<<< HEAD
=======
    SegmentacionClientes,
>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
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
<<<<<<< HEAD
    // GESTIÓN DE CLIENTES
    // =====================
  
/* 
  
    // Listar clientes con filtros y búsqueda
    async listarClientes(req, res) {
      try {
=======
    // GESTIÓN DE CLIENTES - VERSIÓN ROBUSTA
    // =====================

    // Listar clientes con manejo de errores mejorado
    async listarClientes(req, res) {
      try {
        console.log('🔄 Iniciando listarClientes...');
        
>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
        const { 
          page = 1, 
          limit = 10, 
          busqueda, 
          segmento, 
          tipo_cliente,
          orden = 'nombre',
          direccion = 'ASC' 
        } = req.query;
<<<<<<< HEAD
  
        const { offset, limit: limitNum } = paginar(page, limit);
  
        // Construir condiciones de búsqueda
        const where = {};
        
        // Solo clientes (rol)
        const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
        if (rolCliente) {
          where.rol_id = rolCliente.id;
        }
  
        // Búsqueda por texto
        if (busqueda) {
          where[Op.or] = [
            { nombre: { [Op.like]: `%${busqueda}%` } },
            { email: { [Op.like]: `%${busqueda}%` } },
            { telefono: { [Op.like]: `%${busqueda}%` } },
            { rut: { [Op.like]: `%${busqueda}%` } }
          ];
        }
  
        // Filtros específicos
        if (segmento) where.segmento = segmento;
        if (tipo_cliente) where.tipo_cliente = tipo_cliente;
  
        // Consulta con includes
        const { count, rows: clientes } = await Usuario.findAndCountAll({
          where,
          include: [
            {
              model: DireccionEnvio,
              as: 'direcciones',
              where: { activo: true },
              required: false
            },
            {
              model: PreferenciasCliente,
              as: 'preferencias',
              required: false
            },
            {
              model: SegmentacionClientes,
              as: 'segmentos',
              through: { attributes: [] },
              required: false
            }
          ],
          order: [[orden, direccion]],
          limit: limitNum,
          offset,
          distinct: true
        });
  
        // Agregar estadísticas básicas para cada cliente
        const clientesConEstadisticas = await Promise.all(
          clientes.map(async (cliente) => {
            const estadisticas = await this.obtenerEstadisticasCliente(cliente.id);
            return {
              ...cliente.toJSON(),
              estadisticas
            };
          })
        );
  
        res.json(formatearRespuesta(
          'Clientes obtenidos exitosamente',
          clientesConEstadisticas,
          formatearPaginacion(page, limitNum, count)
        ));
  
      } catch (error) {
        console.error('Error al listar clientes:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    } 

    */
/*
    
    async listarClientes(req, res) {
      try {
        console.log('1. Iniciando listarClientes simple');
        
        // Solo buscar usuarios sin includes
        const usuarios = await Usuario.findAll({
          limit: 10
        });
        
        console.log('2. Usuarios encontrados:', usuarios.length);
    
        res.json({
          success: true,
          message: 'Clientes obtenidos exitosamente (versión simple)',
          data: usuarios,
          timestamp: new Date().toISOString()
        });
    
      } catch (error) {
        console.error('Error completo:', error);
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
          details: error.message,
          timestamp: new Date().toISOString()
=======

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
            { email: { [Op.like]: `%${busqueda.trim()}%` } },
            { telefono: { [Op.like]: `%${busqueda.trim()}%` } },
            { rut: { [Op.like]: `%${busqueda.trim()}%` } }
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

        // Intentar diferentes niveles de includes según disponibilidad
        let includeConfig = [];
        
        // Nivel 1: Solo direcciones (más básico)
        try {
          console.log('🏠 Intentando incluir direcciones...');
          includeConfig.push({
            model: DireccionEnvio,
            as: 'direcciones',
            where: { activo: true },
            required: false,
            attributes: ['id', 'alias', 'direccion', 'comuna', 'ciudad', 'es_principal']
          });
        } catch (dirError) {
          console.warn('⚠️ No se pueden incluir direcciones:', dirError.message);
        }

        // Nivel 2: Preferencias (si están disponibles)
        try {
          console.log('⚙️ Intentando incluir preferencias...');
          includeConfig.push({
            model: PreferenciasCliente,
            as: 'preferencias',
            required: false,
            attributes: ['id', 'acepta_promociones', 'acepta_email_marketing', 'metodo_pago_preferido']
          });
        } catch (prefError) {
          console.warn('⚠️ No se pueden incluir preferencias:', prefError.message);
        }

        console.log(`📋 Configuración de includes (${includeConfig.length} elementos):`, 
                   includeConfig.map(inc => inc.as));

        // Ejecutar consulta principal
        const { count, rows: clientes } = await Usuario.findAndCountAll({
          where,
          include: includeConfig,
          order: [[orden, direccion.toUpperCase()]],
          limit: limitNum,
          offset,
          distinct: true,
          // Agregar manejo de errores en la consulta
          logging: (sql) => console.log('🗄️ SQL:', sql)
        });

        console.log(`✅ Consulta exitosa: ${clientes.length} clientes encontrados de ${count} total`);

        // Procesar resultados de forma segura
        const clientesConEstadisticas = await Promise.all(
          clientes.map(async (cliente) => {
            try {
              // Obtener estadísticas básicas de forma segura
              const estadisticas = await this.obtenerEstadisticasBasicas(cliente.id);
              
              const clienteData = cliente.toJSON();
              
              // Asegurar que las relaciones existan aunque estén vacías
              clienteData.direcciones = clienteData.direcciones || [];
              clienteData.preferencias = clienteData.preferencias || null;
              
              return {
                ...clienteData,
                estadisticas
              };
            } catch (clienteError) {
              console.warn(`⚠️ Error al procesar cliente ${cliente.id}:`, clienteError.message);
              // Retornar cliente sin estadísticas en caso de error
              const clienteData = cliente.toJSON();
              clienteData.direcciones = clienteData.direcciones || [];
              clienteData.preferencias = clienteData.preferencias || null;
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
>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
        });
      }
    }

<<<<<<< HEAD

*/

/*
async listarClientes(req, res) {
  try {
    console.log('1. Probando con DireccionEnvio');
    
    const usuarios = await Usuario.findAll({
      include: [
        {
          model: DireccionEnvio,
          as: 'direcciones',
          required: false,
          attributes: ['id', 'alias', 'direccion', 'comuna', 'ciudad']
        }
      ],
      limit: 10
    });
    
    console.log('2. Usuarios con direcciones:', usuarios.length);

    res.json({
      success: true,
      message: 'Clientes con direcciones',
      data: usuarios,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error con direcciones:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

*/

async listarClientes(req, res) {
  try {
    const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
    const where = { rol_id: rolCliente ? rolCliente.id : 3 };

    // Filtro de búsqueda
    if (req.query.busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${req.query.busqueda}%` } },
        { email: { [Op.like]: `%${req.query.busqueda}%` } },
        { telefono: { [Op.like]: `%${req.query.busqueda}%` } },
        { rut: { [Op.like]: `%${req.query.busqueda}%` } }
      ];
    }
    // Filtro de tipo_cliente
    if (req.query.tipo_cliente) {
      where.tipo_cliente = req.query.tipo_cliente;
    }

    const usuarios = await Usuario.findAll({
      where,
      include: [
        {
          model: DireccionEnvio,
          as: 'direcciones',
          required: false
        }
      ]
    });

    res.json({
      success: true,
      message: 'Clientes obtenidos exitosamente',
      data: usuarios,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}




  
    // Obtener detalle de un cliente
    async obtenerCliente(req, res) {
      try {
        const { id } = req.params;
  
        const cliente = await Usuario.findOne({
          where: { id },
          include: [
            {
              model: DireccionEnvio,
              as: 'direcciones',
              where: { activo: true },
              required: false
            },
            {
              model: HistorialCompras,
              as: 'historialCompras',
              order: [['fecha_compra', 'DESC']],
              limit: 10,
              required: false
            },
            {
              model: PreferenciasCliente,
              as: 'preferencias',
              include: [
                { model: Categoria, as: 'categoria_preferida' },
                { model: Marca, as: 'marca_preferida', attributes: ['id', 'nombre', 'descripcion', 'activo', 'created_at', 'updated_at'] }
              ],
              required: false
            },
            {
              model: ComunicacionesCliente,
              as: 'comunicaciones',
              order: [['fecha_envio', 'DESC']],
              limit: 5,
              required: false
            }
          ]
        });
  
        if (!cliente) {
          return res.status(404).json(formatearError('Cliente no encontrado'));
        }
  
        // Obtener estadísticas completas
        const estadisticas = await ClientesController.prototype.obtenerEstadisticasCompletas(cliente.id);
  
        res.json(formatearRespuesta(
          {
            ...cliente.toJSON(),
            estadisticas
          },
          'Cliente obtenido exitosamente'
        ));
  
      } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // Crear nuevo cliente
    async crearCliente(req, res) {
      const t = await sequelize.transaction();
      
      try {
        const {
          // Datos básicos
          nombre, email, password, telefono, rut,
          tipo_cliente, razon_social, giro,
          fecha_nacimiento, genero,
          // Datos comerciales
          segmento, credito_disponible, descuento_personalizado,
          notas,
          // Dirección principal
          direccion_principal,
          // Preferencias
          preferencias
        } = req.body;
  
        // Obtener rol de cliente
        const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
        if (!rolCliente) {
          throw new Error('Rol de cliente no encontrado');
        }
  
        // Crear usuario
        const cliente = await Usuario.create({
          nombre,
          email,
          password, // Debe venir ya hasheado
          telefono,
          rut,
          tipo_cliente,
          razon_social,
          giro,
          fecha_nacimiento,
          genero,
          segmento: segmento || 'retail',
          credito_disponible: credito_disponible || 0,
          descuento_personalizado: descuento_personalizado || 0,
          notas,
          rol_id: rolCliente.id,
          activo: true
        }, { transaction: t });
  
        // Crear dirección principal si se proporciona
        if (direccion_principal) {
          await DireccionEnvio.create({
            usuario_id: cliente.id,
            ...direccion_principal,
            es_principal: true,
            activo: true
          }, { transaction: t });
        }
  
        // Crear preferencias si se proporcionan
        if (preferencias) {
          await PreferenciasCliente.create({
            usuario_id: cliente.id,
            ...preferencias
          }, { transaction: t });
        }
  
        await t.commit();
  
        // Recuperar cliente con relaciones
        const clienteCompleto = await Usuario.findByPk(cliente.id, {
          include: [
            { model: DireccionEnvio, as: 'direcciones' },
            { model: PreferenciasCliente, as: 'preferencias' }
          ]
        });
  
        res.status(201).json(formatearRespuesta(
          'Cliente creado exitosamente',
          clienteCompleto
        ));
  
      } catch (error) {
        await t.rollback();
        console.error('Error al crear cliente:', error);
        res.status(500).json(formatearError('Error al crear cliente'));
      }
    }
  
    // Actualizar cliente
    async actualizarCliente(req, res) {
      try {
        const { id } = req.params;
        const datosActualizacion = req.body;
  
        const cliente = await Usuario.findByPk(id);
        if (!cliente) {
          return res.status(404).json(formatearError('Cliente no encontrado'));
        }
  
        await cliente.update(datosActualizacion);
  
        res.json(formatearRespuesta(
          'Cliente actualizado exitosamente',
          cliente
        ));
  
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // =====================
    // DIRECCIONES DE ENVÍO
    // =====================
  
    // Listar direcciones de un cliente
    async listarDirecciones(req, res) {
      try {
        const { clienteId } = req.params;
  
        const direcciones = await DireccionEnvio.findAll({
          where: { 
            usuario_id: clienteId,
            activo: true 
          },
          order: [['es_principal', 'DESC'], ['created_at', 'DESC']]
        });
  
        res.json(formatearRespuesta(
          'Direcciones obtenidas exitosamente',
          direcciones
        ));
  
      } catch (error) {
        console.error('Error al listar direcciones:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // Crear dirección
    async crearDireccion(req, res) {
      const t = await sequelize.transaction();
  
      try {
        const { clienteId } = req.params;
        const datosDireccion = req.body;
  
        // Si es principal, quitar principal a las demás
        if (datosDireccion.es_principal) {
          await DireccionEnvio.update(
            { es_principal: false },
            { where: { usuario_id: clienteId }, transaction: t }
          );
        }
  
        const direccion = await DireccionEnvio.create({
          usuario_id: clienteId,
          ...datosDireccion,
          activo: true
        }, { transaction: t });
  
        await t.commit();
  
        res.status(201).json(formatearRespuesta(
          'Dirección creada exitosamente',
          direccion
        ));
  
      } catch (error) {
        await t.rollback();
        console.error('Error al crear dirección:', error);
        res.status(500).json(formatearError('Error al crear dirección'));
      }
    }
  
    // Actualizar dirección
    async actualizarDireccion(req, res) {
      const t = await sequelize.transaction();
  
      try {
        const { clienteId, direccionId } = req.params;
        const datosActualizacion = req.body;
  
        const direccion = await DireccionEnvio.findOne({
          where: { 
            id: direccionId,
            usuario_id: clienteId 
          }
        });
  
        if (!direccion) {
          return res.status(404).json(formatearError('Dirección no encontrada'));
        }
  
        // Si se marca como principal, quitar principal a las demás
        if (datosActualizacion.es_principal && !direccion.es_principal) {
          await DireccionEnvio.update(
            { es_principal: false },
            { where: { usuario_id: clienteId }, transaction: t }
          );
        }
  
        await direccion.update(datosActualizacion, { transaction: t });
  
        await t.commit();
  
        res.json(formatearRespuesta(
          'Dirección actualizada exitosamente',
          direccion
        ));
  
      } catch (error) {
        await t.rollback();
        console.error('Error al actualizar dirección:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // Eliminar dirección (soft delete)
    async eliminarDireccion(req, res) {
      try {
        const { clienteId, direccionId } = req.params;
  
        const direccion = await DireccionEnvio.findOne({
          where: { 
            id: direccionId,
            usuario_id: clienteId 
          }
        });
  
        if (!direccion) {
          return res.status(404).json(formatearError('Dirección no encontrada'));
        }
  
        await direccion.update({ activo: false });
  
        res.json(formatearRespuesta('Dirección eliminada exitosamente'));
  
      } catch (error) {
        console.error('Error al eliminar dirección:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // =====================
    // HISTORIAL DE COMPRAS
    // =====================
  
    // Obtener historial de compras
    async obtenerHistorialCompras(req, res) {
      try {
        const { clienteId } = req.params;
        const { 
          page = 1, 
          limit = 10,
          fecha_inicio,
          fecha_fin,
          monto_minimo,
          monto_maximo
        } = req.query;
  
        const { offset, limit: limitNum } = paginar(page, limit);
  
        // Construir filtros
        const where = { usuario_id: clienteId };
  
        if (fecha_inicio || fecha_fin) {
          where.fecha_compra = {};
          if (fecha_inicio) where.fecha_compra[Op.gte] = fecha_inicio;
          if (fecha_fin) where.fecha_compra[Op.lte] = fecha_fin;
        }
  
        if (monto_minimo || monto_maximo) {
          where.monto_total = {};
          if (monto_minimo) where.monto_total[Op.gte] = monto_minimo;
          if (monto_maximo) where.monto_total[Op.lte] = monto_maximo;
        }
  
        const { count, rows: historial } = await HistorialCompras.findAndCountAll({
          where,
          include: [
            {
              model: Pedido,
              as: 'pedido',
              include: [
                {
                  model: DetallePedido,
                  as: 'detalles',
                  include: [
                    { model: Producto, as: 'producto' }
                  ]
                }
              ]
            }
          ],
          order: [['fecha_compra', 'DESC']],
          limit: limitNum,
          offset
        });
  
        // Calcular resumen
        const resumen = await HistorialCompras.findOne({
=======
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

        // Construir includes de forma progresiva
        let includeConfig = [];

        // Include básico: direcciones
        try {
          includeConfig.push({
            model: DireccionEnvio,
            as: 'direcciones',
            where: { activo: true },
            required: false
          });
        } catch (e) {
          console.warn('No se puede incluir direcciones:', e.message);
        }

        // Include avanzado: preferencias
        try {
          includeConfig.push({
            model: PreferenciasCliente,
            as: 'preferencias',
            include: [
              { 
                model: Categoria, 
                as: 'categoria_preferida', 
                required: false,
                attributes: ['id', 'nombre']
              },
              { 
                model: Marca, 
                as: 'marca_preferida', 
                required: false,
                attributes: ['id', 'nombre']
              }
            ],
            required: false
          });
        } catch (e) {
          console.warn('No se pueden incluir preferencias completas:', e.message);
        }

        // Include complejo: historial (limitado)
        try {
          includeConfig.push({
            model: HistorialCompras,
            as: 'historial_compras',
            order: [['fecha_compra', 'DESC']],
            limit: 5,
            required: false,
            attributes: ['id', 'fecha_compra', 'monto_total', 'estado']
          });
        } catch (e) {
          console.warn('No se puede incluir historial:', e.message);
        }

        const cliente = await Usuario.findOne({
          where: { id },
          include: includeConfig
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
        
        // Asegurar estructura consistente
        clienteObj.direcciones = clienteObj.direcciones || [];
        clienteObj.historial_compras = clienteObj.historial_compras || [];
        clienteObj.preferencias = clienteObj.preferencias || null;

        // Obtener estadísticas completas de forma segura
        let estadisticas = null;
        try {
          estadisticas = await this.obtenerEstadisticasCompletas(cliente.id);
        } catch (statsError) {
          console.warn(`⚠️ Error al obtener estadísticas para cliente ${id}:`, statsError.message);
          estadisticas = { error: 'Estadísticas no disponibles' };
        }

        const respuesta = {
          success: true,
          message: 'Cliente obtenido exitosamente',
          data: {
            ...clienteObj,
            estadisticas
          },
          timestamp: new Date().toISOString()
        };

        console.log(`✅ Cliente ${id} obtenido exitosamente`);
        res.json(respuesta);

      } catch (error) {
        console.error('❌ Error al obtener cliente:', {
          clienteId: req.params.id,
          message: error.message,
          stack: error.stack
        });
        
        res.status(500).json({
          success: false,
          error: 'Error interno del servidor al obtener cliente',
          details: process.env.NODE_ENV === 'development' ? error.message : 'Contacta al administrador',
          timestamp: new Date().toISOString()
        });
      }
    }

    // =====================
    // MÉTODOS DE UTILIDAD MEJORADOS
    // =====================

    // Obtener estadísticas básicas con manejo de errores
    async obtenerEstadisticasBasicas(clienteId) {
      try {
        const estadisticas = await HistorialCompras.findOne({
>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
          where: { usuario_id: clienteId },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'total_compras'],
            [sequelize.fn('SUM', sequelize.col('monto_total')), 'monto_total'],
            [sequelize.fn('AVG', sequelize.col('monto_total')), 'ticket_promedio'],
            [sequelize.fn('MAX', sequelize.col('fecha_compra')), 'ultima_compra']
          ],
          raw: true
        });
<<<<<<< HEAD
  
        res.json(formatearRespuesta(
          'Historial de compras obtenido exitosamente',
          {
            historial,
            resumen
          },
          formatearPaginacion(page, limitNum, count)
        ));
  
      } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // =====================
    // PREFERENCIAS
    // =====================
  
    // Obtener preferencias
    async obtenerPreferencias(req, res) {
      try {
        const { clienteId } = req.params;
  
        const preferencias = await PreferenciasCliente.findOne({
          where: { usuario_id: clienteId },
          include: [
            { model: Categoria, as: 'categoria_preferida' },
            { model: Marca, as: 'marca_preferida' }
          ]
        });
  
        if (!preferencias) {
          // Crear preferencias por defecto
          const nuevasPreferencias = await PreferenciasCliente.create({
            usuario_id: clienteId
          });
          return res.json(formatearRespuesta(
            'Preferencias creadas por defecto',
            nuevasPreferencias
          ));
        }
  
        res.json(formatearRespuesta(
          'Preferencias obtenidas exitosamente',
          preferencias
        ));
  
      } catch (error) {
        console.error('Error al obtener preferencias:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // Actualizar preferencias
    async actualizarPreferencias(req, res) {
      try {
        const { clienteId } = req.params;
        const datosPreferencias = req.body;
  
        const [preferencias, created] = await PreferenciasCliente.findOrCreate({
          where: { usuario_id: clienteId },
          defaults: datosPreferencias
        });
  
        if (!created) {
          await preferencias.update(datosPreferencias);
        }
  
        res.json(formatearRespuesta(
          created ? 'Preferencias creadas exitosamente' : 'Preferencias actualizadas exitosamente',
          preferencias
        ));
  
      } catch (error) {
        console.error('Error al actualizar preferencias:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // =====================
    // COMUNICACIONES
    // =====================
  
    // Enviar comunicación
    async enviarComunicacion(req, res) {
      try {
        const { clienteId } = req.params;
        const { tipo, asunto, mensaje, campaign_id } = req.body;
  
        const comunicacion = await ComunicacionesCliente.create({
          usuario_id: clienteId,
          tipo,
          asunto,
          mensaje,
          campaign_id,
          estado: 'enviado',
          fecha_envio: new Date()
        });
  
        // Aquí se integraría con servicios de envío reales
        // Por ejemplo: SendGrid para email, Twilio para SMS, etc.
  
        res.status(201).json(formatearRespuesta(
          'Comunicación enviada exitosamente',
          comunicacion
        ));
  
      } catch (error) {
        console.error('Error al enviar comunicación:', error);
        res.status(500).json(formatearError('Error al enviar comunicación'));
      }
    }
  
    // =====================
    // BÚSQUEDA Y FILTROS
    // =====================
  
    // Búsqueda avanzada
    async busquedaAvanzada(req, res) {
      try {
        const {
          // Datos básicos
          nombre, email, telefono, rut,
          // Segmentación
          segmento, tipo_cliente,
          // Compras
          monto_minimo_total, monto_maximo_total,
          compras_minimas, compras_maximas,
          ultima_compra_desde, ultima_compra_hasta,
          // Ubicación
          comuna, ciudad, region,
          // Marketing
          acepta_promociones, acepta_email_marketing,
          // Paginación
          page = 1, limit = 10
        } = req.query;
  
        const { offset, limit: limitNum } = paginar(page, limit);
  
        // Construir query compleja
        const whereCliente = {};
        const whereHistorial = {};
        const whereDireccion = {};
        const wherePreferencias = {};
  
        // Filtros de cliente
        if (nombre) whereCliente.nombre = { [Op.like]: `%${nombre}%` };
        if (email) whereCliente.email = { [Op.like]: `%${email}%` };
        if (telefono) whereCliente.telefono = { [Op.like]: `%${telefono}%` };
        if (rut) whereCliente.rut = rut;
        if (segmento) whereCliente.segmento = segmento;
        if (tipo_cliente) whereCliente.tipo_cliente = tipo_cliente;
  
        // Filtros de dirección
        if (comuna) whereDireccion.comuna = comuna;
        if (ciudad) whereDireccion.ciudad = ciudad;
        if (region) whereDireccion.region = region;
  
        // Filtros de preferencias
        if (acepta_promociones !== undefined) wherePreferencias.acepta_promociones = acepta_promociones;
        if (acepta_email_marketing !== undefined) wherePreferencias.acepta_email_marketing = acepta_email_marketing;
  
        // Búsqueda con subqueries para filtros de compras
        let query = `
          SELECT DISTINCT u.*
          FROM usuarios u
          LEFT JOIN direcciones_envio de ON u.id = de.usuario_id
          LEFT JOIN preferencias_cliente pc ON u.id = pc.usuario_id
          LEFT JOIN (
            SELECT 
              usuario_id,
              COUNT(*) as total_compras,
              SUM(monto_total) as monto_total,
              MAX(fecha_compra) as ultima_compra
            FROM historial_compras
            GROUP BY usuario_id
          ) hc ON u.id = hc.usuario_id
          WHERE u.rol_id = (SELECT id FROM roles WHERE nombre = 'cliente')
        `;
  
        // Agregar condiciones dinámicamente
        const conditions = [];
        const replacements = {};
  
        // ... construcción dinámica de query ...
  
        // Ejecutar query
        const clientes = await sequelize.query(query, {
          replacements,
          type: sequelize.QueryTypes.SELECT
        });
  
        res.json(formatearRespuesta(
          'Búsqueda realizada exitosamente',
          clientes,
          formatearPaginacion(page, limitNum, clientes.length)
        ));
  
      } catch (error) {
        console.error('Error en búsqueda avanzada:', error);
        res.status(500).json(formatearError('Error interno del servidor'));
      }
    }
  
    // =====================
    // UTILIDADES PRIVADAS
    // =====================
  
    // Obtener estadísticas básicas de un cliente
    async obtenerEstadisticasCliente(clienteId) {
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
        total_compras: estadisticas.total_compras || 0,
        monto_total: estadisticas.monto_total || 0,
        ticket_promedio: estadisticas.ticket_promedio || 0,
        ultima_compra: estadisticas.ultima_compra || null
      };
    }
  
    // Obtener estadísticas completas
    async obtenerEstadisticasCompletas(clienteId) {
      // Estadísticas generales
      const general = await this.obtenerEstadisticasCliente(clienteId);
  
      // Compras últimos 3 meses
      const tresMesesAtras = new Date();
      tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
  
      const comprasRecientes = await HistorialCompras.count({
        where: {
          usuario_id: clienteId,
          fecha_compra: { [Op.gte]: tresMesesAtras }
        }
      });
  
      // Días sin comprar
      const diasSinComprar = general.ultima_compra
        ? Math.floor((new Date() - new Date(general.ultima_compra)) / (1000 * 60 * 60 * 24))
        : null;
  
      // Productos favoritos
      const productosFavoritos = await sequelize.query(`
        SELECT 
          p.id, p.nombre, p.codigo_sku,
          COUNT(*) as veces_comprado,
          SUM(dp.cantidad) as cantidad_total
        FROM detalle_pedidos dp
        JOIN productos p ON dp.producto_id = p.id
        JOIN pedidos ped ON dp.pedido_id = ped.id
        WHERE ped.usuario_id = :clienteId
        GROUP BY p.id
        ORDER BY veces_comprado DESC
        LIMIT 5
      `, {
        replacements: { clienteId },
        type: sequelize.QueryTypes.SELECT
      });
  
      // Categorías preferidas
      const categoriasPreferidas = await sequelize.query(`
        SELECT 
          c.id, c.nombre,
          COUNT(DISTINCT dp.id) as compras,
          SUM(dp.subtotal) as monto_total
        FROM detalle_pedidos dp
        JOIN productos p ON dp.producto_id = p.id
        JOIN categorias c ON p.categoria_id = c.id
        JOIN pedidos ped ON dp.pedido_id = ped.id
        WHERE ped.usuario_id = :clienteId
        GROUP BY c.id
        ORDER BY compras DESC
        LIMIT 3
      `, {
        replacements: { clienteId },
        type: sequelize.QueryTypes.SELECT
      });
  
      return {
        compras: {
          ...general,
          ultimos_3_meses: comprasRecientes,
          dias_sin_comprar: diasSinComprar
        },
        productos_favoritos: productosFavoritos,
        categorias_preferidas: categoriasPreferidas
      };
    }

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
  }
  
=======

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
        const general = await this.obtenerEstadisticasBasicas(clienteId);

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

    // Continúan los demás métodos del controlador original...
    // (crearCliente, actualizarCliente, etc.)
  }

>>>>>>> 9d1cb57039ff9154445ae91d9f0712e751f2fd1f
  module.exports = new ClientesController();