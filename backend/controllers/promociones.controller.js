const pool = require('../database/db');
const { promisify } = require('util');
const query = promisify(pool.query).bind(pool);

// Obtener todas las promociones activas
const obtenerPromociones = async (req, res) => {
    try {
        const promociones = await query(`
            SELECT p.*, rd.tipo as tipo_descuento, rd.valor as valor_descuento
            FROM promociones p
            LEFT JOIN reglas_descuento rd ON p.regla_descuento_id = rd.id
            WHERE p.activa = true 
            AND p.fecha_inicio <= NOW() 
            AND p.fecha_fin >= NOW()
        `);

        // Obtener productos y categorías para cada promoción
        for (let promocion of promociones) {
            const productos = await query(`
                SELECT p.*, pp.cantidad_minima, pp.cantidad_maxima
                FROM productos p
                JOIN promociones_productos pp ON p.id = pp.producto_id
                WHERE pp.promocion_id = ?
            `, [promocion.id]);

            const categorias = await query(`
                SELECT c.*
                FROM categorias c
                JOIN promociones_categorias pc ON c.id = pc.categoria_id
                WHERE pc.promocion_id = ?
            `, [promocion.id]);

            promocion.productos = productos;
            promocion.categorias = categorias;
        }

        res.json(promociones);
    } catch (error) {
        console.error('Error al obtener promociones:', error);
        res.status(500).json({ mensaje: 'Error al obtener promociones' });
    }
};

// Crear una nueva promoción
const crearPromocion = async (req, res) => {
    const {
        nombre,
        descripcion,
        tipo,
        regla_descuento,
        fecha_inicio,
        fecha_fin,
        productos,
        categorias
    } = req.body;

    try {
        // Iniciar transacción
        await query('START TRANSACTION');

        // Crear regla de descuento si se proporciona
        let regla_descuento_id = null;
        if (regla_descuento) {
            const [result] = await query(
                'INSERT INTO reglas_descuento (nombre, tipo, valor, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?)',
                [regla_descuento.nombre, regla_descuento.tipo, regla_descuento.valor, fecha_inicio, fecha_fin]
            );
            regla_descuento_id = result.insertId;
        }

        // Crear promoción
        const [result] = await query(
            'INSERT INTO promociones (nombre, descripcion, tipo, regla_descuento_id, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, tipo, regla_descuento_id, fecha_inicio, fecha_fin]
        );

        const promocion_id = result.insertId;

        // Asociar productos
        if (productos && productos.length > 0) {
            const valores = productos.map(p => [promocion_id, p.id, p.cantidad_minima || 1, p.cantidad_maxima]);
            await query(
                'INSERT INTO promociones_productos (promocion_id, producto_id, cantidad_minima, cantidad_maxima) VALUES ?',
                [valores]
            );
        }

        // Asociar categorías
        if (categorias && categorias.length > 0) {
            const valores = categorias.map(c => [promocion_id, c.id]);
            await query(
                'INSERT INTO promociones_categorias (promocion_id, categoria_id) VALUES ?',
                [valores]
            );
        }

        await query('COMMIT');
        res.status(201).json({ mensaje: 'Promoción creada exitosamente', id: promocion_id });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error al crear promoción:', error);
        res.status(500).json({ mensaje: 'Error al crear promoción' });
    }
};

// Actualizar una promoción existente
const actualizarPromocion = async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        descripcion,
        tipo,
        regla_descuento,
        fecha_inicio,
        fecha_fin,
        activa,
        productos,
        categorias
    } = req.body;

    try {
        await query('START TRANSACTION');

        // Actualizar regla de descuento si se proporciona
        if (regla_descuento) {
            await query(
                'UPDATE reglas_descuento SET nombre = ?, tipo = ?, valor = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = (SELECT regla_descuento_id FROM promociones WHERE id = ?)',
                [regla_descuento.nombre, regla_descuento.tipo, regla_descuento.valor, fecha_inicio, fecha_fin, id]
            );
        }

        // Actualizar promoción
        await query(
            'UPDATE promociones SET nombre = ?, descripcion = ?, tipo = ?, fecha_inicio = ?, fecha_fin = ?, activa = ? WHERE id = ?',
            [nombre, descripcion, tipo, fecha_inicio, fecha_fin, activa, id]
        );

        // Actualizar productos
        if (productos) {
            await query('DELETE FROM promociones_productos WHERE promocion_id = ?', [id]);
            if (productos.length > 0) {
                const valores = productos.map(p => [id, p.id, p.cantidad_minima || 1, p.cantidad_maxima]);
                await query(
                    'INSERT INTO promociones_productos (promocion_id, producto_id, cantidad_minima, cantidad_maxima) VALUES ?',
                    [valores]
                );
            }
        }

        // Actualizar categorías
        if (categorias) {
            await query('DELETE FROM promociones_categorias WHERE promocion_id = ?', [id]);
            if (categorias.length > 0) {
                const valores = categorias.map(c => [id, c.id]);
                await query(
                    'INSERT INTO promociones_categorias (promocion_id, categoria_id) VALUES ?',
                    [valores]
                );
            }
        }

        await query('COMMIT');
        res.json({ mensaje: 'Promoción actualizada exitosamente' });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error al actualizar promoción:', error);
        res.status(500).json({ mensaje: 'Error al actualizar promoción' });
    }
};

// Eliminar una promoción
const eliminarPromocion = async (req, res) => {
    const { id } = req.params;

    try {
        await query('START TRANSACTION');

        // Eliminar relaciones
        await query('DELETE FROM promociones_productos WHERE promocion_id = ?', [id]);
        await query('DELETE FROM promociones_categorias WHERE promocion_id = ?', [id]);
        
        // Eliminar promoción
        await query('DELETE FROM promociones WHERE id = ?', [id]);

        await query('COMMIT');
        res.json({ mensaje: 'Promoción eliminada exitosamente' });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error al eliminar promoción:', error);
        res.status(500).json({ mensaje: 'Error al eliminar promoción' });
    }
};

// Obtener una promoción específica
const obtenerPromocion = async (req, res) => {
    const { id } = req.params;

    try {
        const [promocion] = await query(`
            SELECT p.*, rd.tipo as tipo_descuento, rd.valor as valor_descuento
            FROM promociones p
            LEFT JOIN reglas_descuento rd ON p.regla_descuento_id = rd.id
            WHERE p.id = ?
        `, [id]);

        if (!promocion) {
            return res.status(404).json({ mensaje: 'Promoción no encontrada' });
        }

        // Obtener productos y categorías
        const productos = await query(`
            SELECT p.*, pp.cantidad_minima, pp.cantidad_maxima
            FROM productos p
            JOIN promociones_productos pp ON p.id = pp.producto_id
            WHERE pp.promocion_id = ?
        `, [id]);

        const categorias = await query(`
            SELECT c.*
            FROM categorias c
            JOIN promociones_categorias pc ON c.id = pc.categoria_id
            WHERE pc.promocion_id = ?
        `, [id]);

        promocion.productos = productos;
        promocion.categorias = categorias;

        res.json(promocion);
    } catch (error) {
        console.error('Error al obtener promoción:', error);
        res.status(500).json({ mensaje: 'Error al obtener promoción' });
    }
};

module.exports = {
    obtenerPromociones,
    crearPromocion,
    actualizarPromocion,
    eliminarPromocion,
    obtenerPromocion
}; 