const pool = require('../database/db');
const { promisify } = require('util');
const query = promisify(pool.query).bind(pool);

// Crear pago con Webpay
const crearPago = async (req, res) => {
    try {
        const { monto, orden_compra, session_id, return_url } = req.body;

        // Validar datos
        if (!monto || !orden_compra || !session_id || !return_url) {
            return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
        }

        // Crear registro de pago
        const [result] = await query(
            'INSERT INTO pagos (monto, orden_compra, session_id, estado, metodo_pago) VALUES (?, ?, ?, ?, ?)',
            [monto, orden_compra, session_id, 'pendiente', 'webpay']
        );

        res.status(201).json({
            mensaje: 'Pago creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear pago:', error);
        res.status(500).json({ mensaje: 'Error al crear pago' });
    }
};

// Confirmar pago de Webpay
const confirmarPago = async (req, res) => {
    try {
        const { token_ws } = req.body;

        // Validar token
        if (!token_ws) {
            return res.status(400).json({ mensaje: 'Token no proporcionado' });
        }

        // Actualizar estado del pago
        await query(
            'UPDATE pagos SET estado = ?, token_ws = ? WHERE session_id = ?',
            ['confirmado', token_ws, req.session.id]
        );

        res.json({ mensaje: 'Pago confirmado exitosamente' });
    } catch (error) {
        console.error('Error al confirmar pago:', error);
        res.status(500).json({ mensaje: 'Error al confirmar pago' });
    }
};

// Obtener estado del pago
const obtenerEstadoPago = async (req, res) => {
    try {
        const { id } = req.params;

        const [pago] = await query(
            'SELECT * FROM pagos WHERE id = ?',
            [id]
        );

        if (!pago) {
            return res.status(404).json({ mensaje: 'Pago no encontrado' });
        }

        res.json(pago);
    } catch (error) {
        console.error('Error al obtener estado del pago:', error);
        res.status(500).json({ mensaje: 'Error al obtener estado del pago' });
    }
};

// Obtener historial de pagos
const obtenerHistorialPagos = async (req, res) => {
    try {
        const pagos = await query(`
            SELECT p.*, u.nombre as nombre_usuario
            FROM pagos p
            LEFT JOIN usuarios u ON p.usuario_id = u.id
            ORDER BY p.created_at DESC
        `);

        res.json(pagos);
    } catch (error) {
        console.error('Error al obtener historial de pagos:', error);
        res.status(500).json({ mensaje: 'Error al obtener historial de pagos' });
    }
};

module.exports = {
    crearPago,
    confirmarPago,
    obtenerEstadoPago,
    obtenerHistorialPagos
}; 