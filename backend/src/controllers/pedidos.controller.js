// ============================================
// src/controllers/pedidos.controller.js - ESTRUCTURA EXACTA DE TU DB
// ============================================
const { Pedido, DetallePedido, Producto, Usuario, Rol } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

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

class PedidosController {
  // Crear nuevo pedido - USANDO TU ESTRUCTURA EXACTA
  async crearPedido(req, res) {
    try {
      const { productos, metodo_entrega, direccion_entrega, observaciones, descuento_cupon = 0, cliente_id } = req.body;
      let usuario_id = req.user.id;
      const rol = req.user.rol;
      // Si es admin o vendedor y se envía cliente_id, usarlo
      if ((rol === 'administrador' || rol === 'vendedor') && cliente_id) {
        usuario_id = cliente_id;
      }

      console.log('📦 Creando pedido para usuario:', usuario_id);
      console.log('🟢 Body recibido en crearPedido:', req.body);

      // Validar que tenga productos
      if (!productos || productos.length === 0) {
        return res.status(400).json(formatearError('Debe incluir al menos un producto'));
      }

      // Calcular totales del pedido
      let subtotal = 0;
      const productosValidos = [];

      for (const item of productos) {
        const producto = await Producto.findByPk(item.producto_id);
        if (!producto || !producto.activo) {
          return res.status(400).json(formatearError(`Producto ${item.producto_id} no encontrado o inactivo`));
        }

        const subtotalItem = item.cantidad * item.precio_unitario;
        subtotal += subtotalItem;

        productosValidos.push({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: subtotalItem,
          producto_nombre: producto.nombre
        });
      }

      // Calcular totales con IVA y descuentos
      const iva = subtotal * 0.19; // 19% IVA
      const costoEnvio = metodo_entrega === 'despacho_domicilio' ? 5990 : 0;
      const descuento = descuento_cupon || 0;
      const total = subtotal + iva + costoEnvio - descuento;

      console.log('💰 Subtotal:', subtotal, 'IVA:', iva, 'Envío:', costoEnvio, 'Descuento:', descuento, 'Total:', total);

      // Generar número de pedido único
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const numero_pedido = `PED-${timestamp.slice(-6)}-${random}`;

      console.log('🔢 Número de pedido:', numero_pedido);

      // Mapear método de entrega a valores válidos de tu ENUM
      const metodosEntregaValidos = {
        'domicilio': 'despacho_domicilio',
        'retiro_tienda': 'retiro_tienda',
        'retiro': 'retiro_tienda',
        'despacho_domicilio': 'despacho_domicilio',
        'delivery': 'despacho_domicilio'
      };

      const metodoEntregaDB = metodosEntregaValidos[metodo_entrega] || 'retiro_tienda';
      console.log('🚚 Método de entrega:', metodo_entrega, '→', metodoEntregaDB);

      // Insertar pedido con tu estructura EXACTA
      try {
        const { QueryTypes } = require('sequelize');
        const { sequelize } = require('../models');
        
        console.log('🎯 Insertando con estructura exacta de tu DB...');
        
        const resultadoSQL = await sequelize.query(
          `INSERT INTO pedidos 
           (numero_pedido, usuario_id, estado, subtotal, iva, descuento, costo_envio, total, metodo_entrega, direccion_entrega, observaciones, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          {
            replacements: [
              numero_pedido,
              usuario_id,
              'pendiente', // Estado válido de tu ENUM
              subtotal,
              iva,
              descuento,
              costoEnvio,
              total,
              metodoEntregaDB, // Método válido de tu ENUM
              direccion_entrega || null,
              observaciones || null
            ],
            type: QueryTypes.INSERT
          }
        );

        const pedidoId = resultadoSQL[0];
        console.log('✅ Pedido creado con ID:', pedidoId);

        // Crear detalles del pedido
        console.log('📝 Creando detalles...');
        for (const item of productosValidos) {
          await sequelize.query(
            'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            {
              replacements: [pedidoId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal],
              type: QueryTypes.INSERT
            }
          );
        }

        console.log('✅ Detalles creados exitosamente');

        // Después de crear el pedido y los detalles:
        // Crear pago pendiente si el método de pago es 'efectivo'
        const { metodo_pago } = req.body;
        if (metodo_pago && metodo_pago.toLowerCase() === 'efectivo') {
          const { MetodoPago, Pago } = require('../models');
          const metodo = await MetodoPago.findOne({ where: { nombre: 'efectivo' } });
          if (metodo) {
            await Pago.create({
              pedido_id: pedidoId,
              metodo_pago_id: metodo.id,
              monto: total,
              estado: 'pendiente',
              referencia_externa: null,
              fecha_pago: null
            });
            console.log('💸 Pago pendiente en efectivo creado para el pedido', pedidoId);
          } else {
            console.warn('⚠️ No se encontró el método de pago "efectivo" en la base de datos.');
          }
        }

        // Al devolver el pedido:
        const usuario = await Usuario.findByPk(usuario_id);
        return res.status(201).json(formatearRespuesta(
          '🎉 Pedido creado exitosamente',
          {
            pedido: {
              id: pedidoId,
              numero_pedido: numero_pedido,
              subtotal: subtotal,
              total: total,
              estado: 'pendiente',
              metodo_entrega: metodoEntregaDB,
              direccion_entrega: direccion_entrega,
              observaciones: observaciones,
              fecha_creacion: new Date().toISOString(),
              cliente_nombre: usuario ? usuario.nombre : '',
              cliente_email: usuario ? usuario.email : '',
              cliente_telefono: usuario ? usuario.telefono : '',
              productos: productosValidos.map(p => ({
                nombre: p.producto_nombre,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario,
                subtotal: p.subtotal
              }))
            }
          }
        ));

      } catch (errorSQL) {
        console.error('❌ Error SQL:', errorSQL);
        throw errorSQL;
      }

    } catch (error) {
      console.error('❌ Error al crear pedido:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Listar pedidos
  async listarPedidos(req, res) {
    try {
      const { page = 1, limit = 10, estado } = req.query;
      const usuario_id = req.user.id;
      const rol = req.user.rol;

      const offset = (page - 1) * limit;
      let whereClause = {};

      // Si no es admin, solo ve sus propios pedidos
      if (rol !== 'administrador' && rol !== 'vendedor') {
        whereClause.usuario_id = usuario_id;
      }

      // Filtro por estado
      if (estado) {
        whereClause.estado = estado;
      }

      const { count, rows: pedidos } = await Pedido.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      const pedidosFormateados = await Promise.all(
        pedidos.map(async (pedido) => {
          const usuario = await Usuario.findByPk(pedido.usuario_id);
          const detalles = await DetallePedido.findAll({
            where: { pedido_id: pedido.id }
          });

          const productos = await Promise.all(
            detalles.map(async (detalle) => {
              const producto = await Producto.findByPk(detalle.producto_id);
              return {
                producto_id: detalle.producto_id,
                producto_nombre: producto ? producto.nombre : 'Producto no encontrado',
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                subtotal: detalle.subtotal
              };
            })
          );

          return {
            id: pedido.id,
            numero_pedido: pedido.numero_pedido,
            usuario: usuario ? usuario.nombre : 'Usuario no encontrado',
            usuario_email: usuario ? usuario.email : '',
            usuario_telefono: usuario ? usuario.telefono : '',
            usuario_rut: usuario ? usuario.rut : '',
            subtotal: pedido.subtotal,
            total: pedido.total,
            estado: pedido.estado,
            metodo_entrega: pedido.metodo_entrega,
            direccion_entrega: pedido.direccion_entrega,
            observaciones: pedido.observaciones,
            fecha_creacion: pedido.created_at ? pedido.created_at.toISOString() : null,
            fecha_actualizacion: pedido.updated_at ? pedido.updated_at.toISOString() : null,
            productos: productos
          };
        })
      );

      res.json(formatearRespuesta(
        'Pedidos obtenidos exitosamente',
        {
          pedidos: pedidosFormateados,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(count / limit),
            total_items: count,
            items_per_page: parseInt(limit)
          }
        }
      ));

    } catch (error) {
      console.error('Error al listar pedidos:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Obtener pedido específico
  async obtenerPedido(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const rol = req.user.rol;

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Verificar permisos
      if (pedido.usuario_id !== usuario_id && rol !== 'administrador' && rol !== 'vendedor') {
        return res.status(403).json(formatearError('No tienes permisos para ver este pedido'));
      }

      const usuario = await Usuario.findByPk(pedido.usuario_id);
      console.log('🔍 Usuario encontrado:', usuario ? {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        rut: usuario.rut
      } : 'Usuario no encontrado');
      
      const detalles = await DetallePedido.findAll({
        where: { pedido_id: pedido.id }
      });

      const productos = await Promise.all(
        detalles.map(async (detalle) => {
          const producto = await Producto.findByPk(detalle.producto_id);
          return {
            producto_id: detalle.producto_id,
            producto_nombre: producto ? producto.nombre : 'Producto no encontrado',
            producto_imagen: producto ? producto.imagen_url : null,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal
          };
        })
      );

      console.log('📅 Fechas del pedido:', {
        created_at: pedido.created_at,
        updated_at: pedido.updated_at,
        created_at_iso: pedido.created_at ? pedido.created_at.toISOString() : null,
        updated_at_iso: pedido.updated_at ? pedido.updated_at.toISOString() : null
      });

      const pedidoCompleto = {
        id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        usuario: usuario ? usuario.nombre : 'Usuario no encontrado',
        usuario_email: usuario ? usuario.email : '',
        usuario_telefono: usuario ? usuario.telefono : '',
        usuario_rut: usuario ? usuario.rut : '',
        subtotal: pedido.subtotal,
        total: pedido.total,
        estado: pedido.estado,
        metodo_entrega: pedido.metodo_entrega,
        direccion_entrega: pedido.direccion_entrega,
        observaciones: pedido.observaciones,
        fecha_creacion: pedido.created_at ? pedido.created_at.toISOString() : null,
        fecha_actualizacion: pedido.updated_at ? pedido.updated_at.toISOString() : null,
        productos: productos
      };

      res.json(formatearRespuesta(
        'Pedido obtenido exitosamente',
        pedidoCompleto
      ));

    } catch (error) {
      console.error('Error al obtener pedido:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Cambiar estado del pedido
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado, observaciones } = req.body;
      const rol = req.user.rol;

      if (rol !== 'administrador' && rol !== 'vendedor') {
        return res.status(403).json(formatearError('No tienes permisos para cambiar el estado del pedido'));
      }

      // Estados válidos según tu ENUM
      const estadosValidos = [
        'pendiente', 'aprobado', 'rechazado', 'preparando', 
        'listo', 'enviado', 'entregado', 'cancelado'
      ];

      if (!estadosValidos.includes(estado)) {
        return res.status(400).json(formatearError(`Estado inválido. Estados válidos: ${estadosValidos.join(', ')}`));
      }

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      const estadoAnterior = pedido.estado;

      await pedido.update({
        estado: estado,
        ...(observaciones && { 
          observaciones: `${pedido.observaciones || ''}\n[${new Date().toLocaleString()}] ${observaciones}` 
        })
      });

      res.json(formatearRespuesta(
        'Estado del pedido actualizado exitosamente',
        {
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          estado_anterior: estadoAnterior,
          estado_nuevo: estado,
          fecha_actualizacion: new Date().toISOString()
        }
      ));

    } catch (error) {
      console.error('Error al cambiar estado del pedido:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Obtener historial de estados de un pedido
  async obtenerHistorialEstados(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const rol = req.user.rol;

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Verificar permisos
      if (pedido.usuario_id !== usuario_id && rol !== 'administrador' && rol !== 'vendedor') {
        return res.status(403).json(formatearError('No tienes permisos para ver este pedido'));
      }

      // Estados posibles con fechas reales
      const estados = [
        { 
          id: 'pendiente', 
          nombre: 'Pendiente', 
          descripcion: 'Pedido recibido y en espera de confirmación',
          fecha: pedido.created_at,
          completado: true
        }
      ];

      // Agregar estados adicionales basados en el estado actual
      if (['confirmado', 'en_preparacion', 'enviado', 'entregado'].includes(pedido.estado)) {
        estados.push({
          id: 'confirmado',
          nombre: 'Confirmado',
          descripcion: 'Pedido confirmado y en proceso de preparación',
          fecha: pedido.updated_at,
          completado: true
        });
      }

      if (['en_preparacion', 'enviado', 'entregado'].includes(pedido.estado)) {
        estados.push({
          id: 'en_preparacion',
          nombre: 'En Preparación',
          descripcion: 'Productos siendo preparados para envío',
          fecha: pedido.updated_at,
          completado: true
        });
      }

      if (['enviado', 'entregado'].includes(pedido.estado)) {
        estados.push({
          id: 'enviado',
          nombre: 'Enviado',
          descripcion: 'Pedido enviado y en tránsito',
          fecha: pedido.updated_at,
          completado: true
        });
      }

      if (pedido.estado === 'entregado') {
        estados.push({
          id: 'entregado',
          nombre: 'Entregado',
          descripcion: 'Pedido entregado exitosamente',
          fecha: pedido.updated_at,
          completado: true
        });
      }

      // Agregar estados futuros no completados
      if (!['entregado', 'cancelado'].includes(pedido.estado)) {
        if (!['enviado', 'entregado'].includes(pedido.estado)) {
          estados.push({
            id: 'enviado',
            nombre: 'Enviado',
            descripcion: 'Pedido enviado y en tránsito',
            fecha: null,
            completado: false
          });
        }

        if (pedido.estado !== 'entregado') {
          estados.push({
            id: 'entregado',
            nombre: 'Entregado',
            descripcion: 'Pedido entregado exitosamente',
            fecha: null,
            completado: false
          });
        }
      }

      res.json(formatearRespuesta(
        'Historial de estados obtenido exitosamente',
        estados
      ));

    } catch (error) {
      console.error('Error al obtener historial de estados:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  async ventasHoy(req, res) {
    try {
      const total = await Pedido.sum('total', {
        where: literal('DATE(created_at) = CURDATE()')
      });
      res.json({ success: true, total: total || 0 });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Actualizar pedido
  async actualizarPedido(req, res) {
    try {
      const { id } = req.params;
      const { metodo_entrega, direccion_entrega, observaciones } = req.body;
      const rol = req.user.rol;

      if (rol !== 'administrador' && rol !== 'vendedor') {
        return res.status(403).json(formatearError('No tienes permisos para actualizar pedidos'));
      }

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Validar método de entrega
      const metodosEntregaValidos = {
        'domicilio': 'despacho_domicilio',
        'retiro_tienda': 'retiro_tienda',
        'retiro': 'retiro_tienda',
        'despacho_domicilio': 'despacho_domicilio',
        'delivery': 'despacho_domicilio'
      };

      const metodoEntregaDB = metodosEntregaValidos[metodo_entrega] || pedido.metodo_entrega;

      await pedido.update({
        metodo_entrega: metodoEntregaDB,
        direccion_entrega: direccion_entrega || pedido.direccion_entrega,
        observaciones: observaciones || pedido.observaciones
      });

      res.json(formatearRespuesta(
        'Pedido actualizado exitosamente',
        {
          id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          metodo_entrega: pedido.metodo_entrega,
          direccion_entrega: pedido.direccion_entrega,
          observaciones: pedido.observaciones,
          fecha_actualizacion: new Date().toISOString()
        }
      ));

    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }

  // Eliminar pedido
  async eliminarPedido(req, res) {
    try {
      const { id } = req.params;
      const rol = req.user.rol;

      if (rol !== 'administrador') {
        return res.status(403).json(formatearError('Solo los administradores pueden eliminar pedidos'));
      }

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json(formatearError('Pedido no encontrado'));
      }

      // Solo permitir eliminar pedidos en estado pendiente o cancelado
      if (!['pendiente', 'cancelado'].includes(pedido.estado)) {
        return res.status(400).json(formatearError('Solo se pueden eliminar pedidos pendientes o cancelados'));
      }

      // Eliminar detalles del pedido primero
      await DetallePedido.destroy({
        where: { pedido_id: id }
      });

      // Eliminar el pedido
      await pedido.destroy();

      res.json(formatearRespuesta(
        'Pedido eliminado exitosamente',
        {
          id: pedido.id,
          numero_pedido: pedido.numero_pedido
        }
      ));

    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      res.status(500).json(formatearError('Error interno del servidor'));
    }
  }
}

// Exportar una instancia del controlador
module.exports = new PedidosController();