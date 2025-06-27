// ============================================
// src/controllers/clientes.controller.js - VERSIÓN MEJORADA
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
    // GESTIÓN DE CLIENTES - VERSIÓN ROBUSTA
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

  module.exports = new ClientesController();