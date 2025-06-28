// src/controllers/promociones.controller.js (ARCHIVO NUEVO)
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'emma2004',
  database: process.env.DB_NAME || 'ferremasnueva'
};

class PromocionesController {
  // 📋 LISTAR PROMOCIONES
  async listarPromociones(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const { page = 1, limit = 10, activo } = req.query;
      const offset = (page - 1) * limit;
      
      let whereClause = '';
      let params = [];
      
      if (activo !== undefined) {
        whereClause = 'WHERE activo = ?';
        params.push(parseInt(activo));
      }
      
      const [promociones] = await connection.execute(`
        SELECT 
          id, nombre, descripcion, tipo_descuento, valor_descuento,
          fecha_inicio, fecha_fin, codigo_cupon, minimo_compra,
          maximo_descuento, limite_usos, usos_actuales, activo,
          created_at, updated_at
        FROM promociones
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), parseInt(offset)]);

      // Contar total
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total FROM promociones ${whereClause}
      `, params);

      res.json({
        success: true,
        data: {
          promociones,
          pagination: {
            current_page: parseInt(page),
            total_pages: Math.ceil(countResult[0].total / limit),
            total_items: countResult[0].total
          }
        }
      });

    } catch (error) {
      console.error('Error al listar promociones:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener promociones',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // ➕ CREAR PROMOCIÓN
  async crearPromocion(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      
      const {
        nombre, descripcion, tipo_descuento, valor_descuento,
        fecha_inicio, fecha_fin, codigo_cupon, minimo_compra = 0,
        maximo_descuento = null, limite_usos = null
      } = req.body;

      // Validaciones
      if (!nombre || !tipo_descuento || !valor_descuento || !fecha_inicio || !fecha_fin) {
        return res.status(400).json({
          success: false,
          message: 'Campos requeridos: nombre, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin'
        });
      }

      // Verificar código de cupón único
      if (codigo_cupon) {
        const [existing] = await connection.execute(
          'SELECT id FROM promociones WHERE codigo_cupon = ? AND activo = 1',
          [codigo_cupon]
        );
        
        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'El código de cupón ya existe'
          });
        }
      }

      const [result] = await connection.execute(`
        INSERT INTO promociones (
          nombre, descripcion, tipo_descuento, valor_descuento,
          fecha_inicio, fecha_fin, codigo_cupon, minimo_compra,
          maximo_descuento, limite_usos, usos_actuales, activo,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, NOW(), NOW())
      `, [
        nombre, descripcion, tipo_descuento, parseFloat(valor_descuento),
        fecha_inicio, fecha_fin, codigo_cupon, parseFloat(minimo_compra),
        maximo_descuento ? parseFloat(maximo_descuento) : null,
        limite_usos ? parseInt(limite_usos) : null
      ]);

      res.status(201).json({
        success: true,
        message: 'Promoción creada exitosamente',
        data: { id: result.insertId, ...req.body }
      });

    } catch (error) {
      console.error('Error al crear promoción:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear promoción',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 🎫 VALIDAR CUPÓN
  async validarCupon(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      const { codigo, monto_compra } = req.body;

      if (!codigo || !monto_compra) {
        return res.status(400).json({
          success: false,
          message: 'Código de cupón y monto de compra requeridos'
        });
      }

      const [promociones] = await connection.execute(`
        SELECT * FROM promociones 
        WHERE codigo_cupon = ? AND activo = 1 
        AND fecha_inicio <= NOW() AND fecha_fin >= NOW()
      `, [codigo]);

      if (promociones.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cupón no válido o expirado'
        });
      }

      const promocion = promociones[0];

      // Verificar monto mínimo
      if (monto_compra < promocion.minimo_compra) {
        return res.status(400).json({
          success: false,
          message: `Monto mínimo de compra: $${promocion.minimo_compra}`
        });
      }

      // Verificar límite de usos
      if (promocion.limite_usos && promocion.usos_actuales >= promocion.limite_usos) {
        return res.status(400).json({
          success: false,
          message: 'Cupón agotado'
        });
      }

      // Calcular descuento
      let descuento = 0;
      if (promocion.tipo_descuento === 'porcentaje') {
        descuento = (monto_compra * promocion.valor_descuento) / 100;
        if (promocion.maximo_descuento && descuento > promocion.maximo_descuento) {
          descuento = promocion.maximo_descuento;
        }
      } else {
        descuento = promocion.valor_descuento;
      }

      res.json({
        success: true,
        message: 'Cupón válido',
        data: {
          promocion_id: promocion.id,
          nombre: promocion.nombre,
          descuento: parseFloat(descuento.toFixed(2)),
          monto_final: parseFloat((monto_compra - descuento).toFixed(2))
        }
      });

    } catch (error) {
      console.error('Error al validar cupón:', error);
      res.status(500).json({
        success: false,
        message: 'Error al validar cupón',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }

  // 🔄 APLICAR PROMOCIÓN
  async aplicarPromocion(req, res) {
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);
      await connection.beginTransaction();

      const { promocion_id, pedido_id } = req.body;

      // Incrementar uso de la promoción
      await connection.execute(
        'UPDATE promociones SET usos_actuales = usos_actuales + 1 WHERE id = ?',
        [promocion_id]
      );

      // Registrar uso de promoción
      await connection.execute(`
        INSERT INTO promociones_usadas (promocion_id, pedido_id, created_at)
        VALUES (?, ?, NOW())
      `, [promocion_id, pedido_id]);

      await connection.commit();

      res.json({
        success: true,
        message: 'Promoción aplicada exitosamente'
      });

    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error al aplicar promoción:', error);
      res.status(500).json({
        success: false,
        message: 'Error al aplicar promoción',
        error: error.message
      });
    } finally {
      if (connection) await connection.end();
    }
  }
}

module.exports = new PromocionesController();