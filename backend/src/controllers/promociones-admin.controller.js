// ==========================================
// src/controllers/promociones-admin.controller.js - COMPLETO
// ==========================================

const mysql = require('mysql2/promise');
const pool = require('../config/database');

class PromocionesAdminController {

  // ==========================================
  // GESTIÓN DE PROMOCIONES
  // ==========================================

  // Listar todas las promociones (admin)
  async listarPromociones(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        tipo_descuento, 
        activo, 
        vigente,
        buscar 
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      let whereConditions = [];
      let queryParams = [];

      // Filtros
      if (tipo_descuento) {
        whereConditions.push('tipo_descuento = ?');
        queryParams.push(tipo_descuento);
      }

      if (activo !== undefined) {
        whereConditions.push('activo = ?');
        queryParams.push(parseInt(activo));
      }

      if (vigente === 'true') {
        whereConditions.push('fecha_inicio <= NOW() AND fecha_fin >= NOW()');
      }

      if (buscar) {
        whereConditions.push('(nombre LIKE ? OR descripcion LIKE ? OR codigo_cupon LIKE ?)');
        const searchTerm = `%${buscar}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }

      const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

      // Consulta principal con estadísticas
      const query = `
        SELECT 
          p.*,
          CASE 
            WHEN NOW() < p.fecha_inicio THEN 'programada'
            WHEN NOW() > p.fecha_fin THEN 'expirada'
            WHEN p.activo = 0 THEN 'inactiva'
            ELSE 'activa'
          END as estado,
          COALESCE(pu.total_usos, 0) as total_usos_real,
          COALESCE(pu.descuento_total, 0) as descuento_total_aplicado,
          -- Calcular días restantes
          CASE 
            WHEN NOW() < p.fecha_inicio THEN DATEDIFF(p.fecha_inicio, NOW())
            WHEN NOW() <= p.fecha_fin THEN DATEDIFF(p.fecha_fin, NOW())
            ELSE 0
          END as dias_restantes
        FROM promociones p
        LEFT JOIN (
          SELECT 
            promocion_id,
            COUNT(*) as total_usos,
            SUM(descuento_aplicado) as descuento_total
          FROM promociones_usadas 
          GROUP BY promocion_id
        ) pu ON p.id = pu.promocion_id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `;

      queryParams.push(parseInt(limit), offset);

      const [promociones] = await pool.execute(query, queryParams);

      // Contar total para paginación
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM promociones p 
        ${whereClause}
      `;
      
      const [countResult] = await pool.execute(
        countQuery, 
        queryParams.slice(0, -2) // Remove limit and offset
      );

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / parseInt(limit));

      // Obtener estadísticas generales
      const [estadisticas] = await pool.execute(`
        SELECT 
          COUNT(*) as total_promociones,
          SUM(CASE WHEN activo = 1 AND NOW() BETWEEN fecha_inicio AND fecha_fin THEN 1 ELSE 0 END) as activas,
          SUM(CASE WHEN NOW() > fecha_fin THEN 1 ELSE 0 END) as expiradas,
          SUM(CASE WHEN NOW() < fecha_inicio THEN 1 ELSE 0 END) as programadas,
          SUM(CASE WHEN activo = 0 THEN 1 ELSE 0 END) as inactivas
        FROM promociones
      `);

      // Agregar información de categorías/marcas/productos asociados
      for (let promocion of promociones) {
        // Categorías asociadas
        const [categorias] = await pool.execute(`
          SELECT c.id, c.nombre 
          FROM promocion_categorias pc
          JOIN categorias c ON pc.categoria_id = c.id
          WHERE pc.promocion_id = ?
        `, [promocion.id]);

        // Marcas asociadas
        const [marcas] = await pool.execute(`
          SELECT m.id, m.nombre 
          FROM promocion_marcas pm
          JOIN marcas m ON pm.marca_id = m.id
          WHERE pm.promocion_id = ?
        `, [promocion.id]);

        // Productos específicos
        const [productos] = await pool.execute(`
          SELECT p.id, p.nombre, p.codigo_sku
          FROM promocion_productos pp
          JOIN productos p ON pp.producto_id = p.id
          WHERE pp.promocion_id = ?
        `, [promocion.id]);

        promocion.categorias_asociadas = categorias;
        promocion.marcas_asociadas = marcas;
        promocion.productos_asociados = productos;
        promocion.aplicacion_tipo = categorias.length > 0 ? 'categorias' : 
                                   marcas.length > 0 ? 'marcas' : 
                                   productos.length > 0 ? 'productos' : 'general';
      }

      res.json({
        success: true,
        data: {
          promociones,
          paginacion: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          },
          estadisticas: estadisticas[0]
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al listar promociones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las promociones',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Crear nueva promoción
  async crearPromocion(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        nombre,
        descripcion,
        tipo_descuento,
        valor_descuento,
        fecha_inicio,
        fecha_fin,
        codigo_cupon,
        minimo_compra = 0,
        maximo_descuento,
        limite_usos,
        activo = 1,
        // Aplicación específica
        categoria_ids = [],
        marca_ids = [],
        producto_ids = []
      } = req.body;

      // Validaciones
      if (!nombre || !tipo_descuento || !valor_descuento || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          success: false,
          error: 'Datos faltantes',
          message: 'Nombre, tipo de descuento, valor, fecha inicio y fin son obligatorios',
          timestamp: new Date().toISOString()
        });
      }

      if (tipo_descuento === 'porcentaje' && valor_descuento > 100) {
        return res.status(400).json({
          success: false,
          error: 'Valor inválido',
          message: 'El porcentaje no puede ser mayor a 100%',
          timestamp: new Date().toISOString()
        });
      }

      if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        return res.status(400).json({
          success: false,
          error: 'Fechas inválidas',
          message: 'La fecha de inicio debe ser anterior a la fecha de fin',
          timestamp: new Date().toISOString()
        });
      }

      // Verificar que el código de cupón no exista si se proporciona
      if (codigo_cupon) {
        const [existeCupon] = await connection.execute(
          'SELECT id FROM promociones WHERE codigo_cupon = ? AND id != ?',
          [codigo_cupon, 0]
        );

        if (existeCupon.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Código duplicado',
            message: 'Ya existe una promoción con ese código de cupón',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Insertar promoción
      const [result] = await connection.execute(`
        INSERT INTO promociones (
          nombre, descripcion, tipo_descuento, valor_descuento,
          fecha_inicio, fecha_fin, codigo_cupon, minimo_compra,
          maximo_descuento, limite_usos, activo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        nombre, descripcion, tipo_descuento, valor_descuento,
        fecha_inicio, fecha_fin, codigo_cupon, minimo_compra,
        maximo_descuento, limite_usos, activo
      ]);

      const promocionId = result.insertId;

      // Insertar relaciones con categorías
      if (categoria_ids && categoria_ids.length > 0) {
        for (const categoriaId of categoria_ids) {
          await connection.execute(
            'INSERT INTO promocion_categorias (promocion_id, categoria_id) VALUES (?, ?)',
            [promocionId, categoriaId]
          );
        }
      }

      // Insertar relaciones con marcas
      if (marca_ids && marca_ids.length > 0) {
        for (const marcaId of marca_ids) {
          await connection.execute(
            'INSERT INTO promocion_marcas (promocion_id, marca_id) VALUES (?, ?)',
            [promocionId, marcaId]
          );
        }
      }

      // Insertar relaciones con productos específicos
      if (producto_ids && producto_ids.length > 0) {
        for (const productoId of producto_ids) {
          await connection.execute(
            'INSERT INTO promocion_productos (promocion_id, producto_id) VALUES (?, ?)',
            [promocionId, productoId]
          );
        }
      }

      await connection.commit();

      // Obtener la promoción creada con sus relaciones
      const [promocionCreada] = await pool.execute(`
        SELECT p.*, 
          CASE 
            WHEN NOW() < p.fecha_inicio THEN 'programada'
            WHEN NOW() > p.fecha_fin THEN 'expirada'
            WHEN p.activo = 0 THEN 'inactiva'
            ELSE 'activa'
          END as estado
        FROM promociones p 
        WHERE p.id = ?
      `, [promocionId]);

      res.status(201).json({
        success: true,
        message: 'Promoción creada exitosamente',
        data: promocionCreada[0],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al crear promoción:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo crear la promoción',
        timestamp: new Date().toISOString()
      });
    } finally {
      connection.release();
    }
  }

  // Actualizar promoción existente
  async actualizarPromocion(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const {
        nombre,
        descripcion,
        tipo_descuento,
        valor_descuento,
        fecha_inicio,
        fecha_fin,
        codigo_cupon,
        minimo_compra,
        maximo_descuento,
        limite_usos,
        activo,
        categoria_ids = [],
        marca_ids = [],
        producto_ids = []
      } = req.body;

      // Verificar que la promoción existe
      const [promocionExiste] = await connection.execute(
        'SELECT id FROM promociones WHERE id = ?',
        [id]
      );

      if (promocionExiste.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Promoción no encontrada',
          message: 'La promoción especificada no existe',
          timestamp: new Date().toISOString()
        });
      }

      // Verificar código de cupón único si se cambia
      if (codigo_cupon) {
        const [existeCupon] = await connection.execute(
          'SELECT id FROM promociones WHERE codigo_cupon = ? AND id != ?',
          [codigo_cupon, id]
        );

        if (existeCupon.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Código duplicado',
            message: 'Ya existe otra promoción con ese código de cupón',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Actualizar promoción
      await connection.execute(`
        UPDATE promociones SET
          nombre = ?, descripcion = ?, tipo_descuento = ?, valor_descuento = ?,
          fecha_inicio = ?, fecha_fin = ?, codigo_cupon = ?, minimo_compra = ?,
          maximo_descuento = ?, limite_usos = ?, activo = ?, updated_at = NOW()
        WHERE id = ?
      `, [
        nombre, descripcion, tipo_descuento, valor_descuento,
        fecha_inicio, fecha_fin, codigo_cupon, minimo_compra,
        maximo_descuento, limite_usos, activo, id
      ]);

      // Eliminar relaciones existentes
      await connection.execute('DELETE FROM promocion_categorias WHERE promocion_id = ?', [id]);
      await connection.execute('DELETE FROM promocion_marcas WHERE promocion_id = ?', [id]);
      await connection.execute('DELETE FROM promocion_productos WHERE promocion_id = ?', [id]);

      // Insertar nuevas relaciones
      if (categoria_ids.length > 0) {
        for (const categoriaId of categoria_ids) {
          await connection.execute(
            'INSERT INTO promocion_categorias (promocion_id, categoria_id) VALUES (?, ?)',
            [id, categoriaId]
          );
        }
      }

      if (marca_ids.length > 0) {
        for (const marcaId of marca_ids) {
          await connection.execute(
            'INSERT INTO promocion_marcas (promocion_id, marca_id) VALUES (?, ?)',
            [id, marcaId]
          );
        }
      }

      if (producto_ids.length > 0) {
        for (const productoId of producto_ids) {
          await connection.execute(
            'INSERT INTO promocion_productos (promocion_id, producto_id) VALUES (?, ?)',
            [id, productoId]
          );
        }
      }

      await connection.commit();

      res.json({
        success: true,
        message: 'Promoción actualizada exitosamente',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al actualizar promoción:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo actualizar la promoción',
        timestamp: new Date().toISOString()
      });
    } finally {
      connection.release();
    }
  }

  // Eliminar promoción
  async eliminarPromocion(req, res) {
    try {
      const { id } = req.params;

      // Verificar que la promoción existe
      const [promocionExiste] = await pool.execute(
        'SELECT id, nombre FROM promociones WHERE id = ?',
        [id]
      );

      if (promocionExiste.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Promoción no encontrada',
          message: 'La promoción especificada no existe',
          timestamp: new Date().toISOString()
        });
      }

      // Verificar si tiene usos registrados
      const [tieneUsos] = await pool.execute(
        'SELECT COUNT(*) as total FROM promociones_usadas WHERE promocion_id = ?',
        [id]
      );

      if (tieneUsos[0].total > 0) {
        // Si tiene usos, solo desactivar en lugar de eliminar
        await pool.execute(
          'UPDATE promociones SET activo = 0, updated_at = NOW() WHERE id = ?',
          [id]
        );

        return res.json({
          success: true,
          message: 'Promoción desactivada (tenía usos registrados)',
          data: { desactivada: true },
          timestamp: new Date().toISOString()
        });
      }

      // Si no tiene usos, eliminar completamente
      await pool.execute('DELETE FROM promociones WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Promoción eliminada exitosamente',
        data: { eliminada: true },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al eliminar promoción:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo eliminar la promoción',
        timestamp: new Date().toISOString()
      });
    }
  }

  // ==========================================
  // APLICACIÓN Y VALIDACIÓN DE PROMOCIONES
  // ==========================================

  // Validar cupón de descuento
  async validarCupon(req, res) {
    try {
      const { codigo_cupon, total_compra, usuario_id, productos = [] } = req.body;

      if (!codigo_cupon || !total_compra) {
        return res.status(400).json({
          success: false,
          error: 'Datos faltantes',
          message: 'Código de cupón y total de compra son requeridos',
          timestamp: new Date().toISOString()
        });
      }

      // Buscar promoción activa con ese código
      const [promociones] = await pool.execute(`
        SELECT * FROM promociones 
        WHERE codigo_cupon = ? 
        AND activo = 1 
        AND fecha_inicio <= NOW() 
        AND fecha_fin >= NOW()
      `, [codigo_cupon]);

      if (promociones.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Cupón inválido',
          message: 'El cupón no existe, está inactivo o ha expirado',
          valido: false,
          timestamp: new Date().toISOString()
        });
      }

      const promocion = promociones[0];

      // Verificar límite de usos
      if (promocion.limite_usos && promocion.usos_actuales >= promocion.limite_usos) {
        return res.status(400).json({
          success: false,
          error: 'Cupón agotado',
          message: 'Este cupón ha alcanzado su límite de usos',
          valido: false,
          timestamp: new Date().toISOString()
        });
      }

      // Verificar monto mínimo
      if (promocion.minimo_compra && total_compra < promocion.minimo_compra) {
        return res.status(400).json({
          success: false,
          error: 'Monto insuficiente',
          message: `El monto mínimo para este cupón es ${promocion.minimo_compra.toLocaleString()}`,
          valido: false,
          minimo_requerido: promocion.minimo_compra,
          timestamp: new Date().toISOString()
        });
      }

      // Verificar si el usuario ya usó este cupón (si es de un solo uso por usuario)
      if (usuario_id) {
        const [yaUsado] = await pool.execute(`
          SELECT COUNT(*) as usos 
          FROM promociones_usadas 
          WHERE promocion_id = ? AND usuario_id = ?
        `, [promocion.id, usuario_id]);

        // Para ciertos tipos de cupones (NUEVO2025, PRIMERACOMPRA) solo se puede usar una vez por usuario
        if (['NUEVO2025', 'PRIMERACOMPRA'].includes(codigo_cupon) && yaUsado[0].usos > 0) {
          return res.status(400).json({
            success: false,
            error: 'Cupón ya utilizado',
            message: 'Este cupón solo se puede usar una vez por usuario',
            valido: false,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Calcular descuento
      let descuento = 0;
      if (promocion.tipo_descuento === 'porcentaje') {
        descuento = total_compra * (promocion.valor_descuento / 100);
      } else {
        descuento = promocion.valor_descuento;
      }

      // Aplicar límite máximo de descuento si existe
      if (promocion.maximo_descuento && descuento > promocion.maximo_descuento) {
        descuento = promocion.maximo_descuento;
      }

      // No puede ser mayor al total de compra
      if (descuento > total_compra) {
        descuento = total_compra;
      }

      const total_final = total_compra - descuento;

      res.json({
        success: true,
        message: 'Cupón válido',
        valido: true,
        data: {
          promocion: {
            id: promocion.id,
            nombre: promocion.nombre,
            descripcion: promocion.descripcion,
            codigo: promocion.codigo_cupon,
            tipo: promocion.tipo_descuento,
            valor: promocion.valor_descuento
          },
          calculo: {
            total_original: total_compra,
            descuento_aplicado: descuento,
            total_final: total_final,
            ahorro: descuento,
            porcentaje_ahorro: ((descuento / total_compra) * 100).toFixed(1)
          },
          restricciones: {
            minimo_compra: promocion.minimo_compra,
            maximo_descuento: promocion.maximo_descuento,
            usos_restantes: promocion.limite_usos ? promocion.limite_usos - promocion.usos_actuales : null
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al validar cupón:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo validar el cupón',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Aplicar promoción a una compra
  async aplicarPromocion(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        promocion_id,
        pedido_id,
        usuario_id,
        total_compra,
        descuento_aplicado
      } = req.body;

      // Verificar que la promoción existe y está activa
      const [promociones] = await connection.execute(`
        SELECT * FROM promociones 
        WHERE id = ? AND activo = 1 
        AND fecha_inicio <= NOW() AND fecha_fin >= NOW()
      `, [promocion_id]);

      if (promociones.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Promoción no válida',
          message: 'La promoción no existe o no está activa',
          timestamp: new Date().toISOString()
        });
      }

      // Registrar el uso de la promoción
      await connection.execute(`
        INSERT INTO promociones_usadas 
        (promocion_id, pedido_id, usuario_id, descuento_aplicado)
        VALUES (?, ?, ?, ?)
      `, [promocion_id, pedido_id, usuario_id, descuento_aplicado]);

      // Actualizar contador de usos en la promoción
      await connection.execute(`
        UPDATE promociones 
        SET usos_actuales = usos_actuales + 1
        WHERE id = ?
      `, [promocion_id]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Promoción aplicada exitosamente',
        data: {
          promocion_id,
          descuento_aplicado,
          total_final: total_compra - descuento_aplicado
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      await connection.rollback();
      console.error('Error al aplicar promoción:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudo aplicar la promoción',
        timestamp: new Date().toISOString()
      });
    } finally {
      connection.release();
    }
  }

  // ==========================================
  // ESTADÍSTICAS DE PROMOCIONES
  // ==========================================

  // Obtener estadísticas detalladas de promociones
  async obtenerEstadisticas(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;

      let whereClause = '';
      let params = [];

      if (fecha_inicio && fecha_fin) {
        whereClause = 'WHERE pu.created_at BETWEEN ? AND ?';
        params = [fecha_inicio, fecha_fin];
      }

      // Estadísticas generales
      const [estadisticasGenerales] = await pool.execute(`
        SELECT 
          COUNT(DISTINCT p.id) as total_promociones,
          SUM(CASE WHEN p.activo = 1 AND NOW() BETWEEN p.fecha_inicio AND p.fecha_fin THEN 1 ELSE 0 END) as promociones_activas,
          COUNT(DISTINCT pu.id) as total_usos,
          SUM(pu.descuento_aplicado) as descuento_total_aplicado,
          AVG(pu.descuento_aplicado) as descuento_promedio
        FROM promociones p
        LEFT JOIN promociones_usadas pu ON p.id = pu.promocion_id
        ${whereClause}
      `, params);

      // Top promociones más usadas
      const [topPromociones] = await pool.execute(`
        SELECT 
          p.nombre,
          p.codigo_cupon,
          p.tipo_descuento,
          p.valor_descuento,
          COUNT(pu.id) as total_usos,
          SUM(pu.descuento_aplicado) as descuento_total,
          AVG(pu.descuento_aplicado) as descuento_promedio
        FROM promociones p
        LEFT JOIN promociones_usadas pu ON p.id = pu.promocion_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY total_usos DESC
        LIMIT 10
      `, params);

      // Estadísticas por tipo de descuento
      const [porTipo] = await pool.execute(`
        SELECT 
          p.tipo_descuento,
          COUNT(DISTINCT p.id) as cantidad_promociones,
          COUNT(pu.id) as total_usos,
          SUM(pu.descuento_aplicado) as descuento_total
        FROM promociones p
        LEFT JOIN promociones_usadas pu ON p.id = pu.promocion_id
        ${whereClause}
        GROUP BY p.tipo_descuento
      `, params);

      // Promociones por estado
      const [porEstado] = await pool.execute(`
        SELECT 
          CASE 
            WHEN NOW() < fecha_inicio THEN 'programada'
            WHEN NOW() > fecha_fin THEN 'expirada'
            WHEN activo = 0 THEN 'inactiva'
            ELSE 'activa'
          END as estado,
          COUNT(*) as cantidad
        FROM promociones
        GROUP BY estado
      `);

      // Evolución mensual (últimos 12 meses)
      const [evolucionMensual] = await pool.execute(`
        SELECT 
          DATE_FORMAT(pu.created_at, '%Y-%m') as mes,
          COUNT(pu.id) as usos,
          SUM(pu.descuento_aplicado) as descuento_total,
          COUNT(DISTINCT pu.promocion_id) as promociones_diferentes
        FROM promociones_usadas pu
        WHERE pu.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY mes
        ORDER BY mes ASC
      `);

      res.json({
        success: true,
        data: {
          resumen: estadisticasGenerales[0],
          top_promociones: topPromociones,
          por_tipo: porTipo,
          por_estado: porEstado,
          evolucion_mensual: evolucionMensual
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener las estadísticas',
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new PromocionesAdminController();