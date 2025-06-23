const { WebpayPlus, Options } = require('transbank-sdk');
const pool = require('../database/database');

// Configuración de Transbank
const options = new Options(
    process.env.TRANSBANK_COMMERCE_CODE,
    process.env.TRANSBANK_API_KEY,
    process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'INTEGRATION'
);

// Crear una transacción
exports.crearTransaccion = async (req, res) => {
    try {
        const { monto, orden_compra, session_id, return_url } = req.body;

        // Crear la transacción en Transbank
        const resultado = await WebpayPlus.Transaction.create(
            orden_compra,
            session_id,
            monto,
            return_url,
            options
        );

        // Guardar la transacción en la base de datos
        const [result] = await pool.query(
            'INSERT INTO transacciones (orden_compra, monto, token, estado) VALUES (?, ?, ?, ?)',
            [orden_compra, monto, resultado.token, 'INICIADA']
        );

        res.json({
            token: resultado.token,
            url: resultado.url
        });
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({ mensaje: 'Error al crear transacción' });
    }
};

// Confirmar una transacción
exports.confirmarTransaccion = async (req, res) => {
    try {
        const { token_ws } = req.body;

        // Obtener el resultado de la transacción
        const resultado = await WebpayPlus.Transaction.commit(token_ws, options);

        // Actualizar el estado en la base de datos
        await pool.query(
            'UPDATE transacciones SET estado = ?, respuesta = ? WHERE token = ?',
            [resultado.status, JSON.stringify(resultado), token_ws]
        );

        // Si la transacción fue exitosa, actualizar la venta
        if (resultado.status === 'AUTHORIZED') {
            await pool.query(
                'UPDATE ventas SET estado_pago = ? WHERE orden_compra = ?',
                ['PAGADO', resultado.buyOrder]
            );
        }

        res.json(resultado);
    } catch (error) {
        console.error('Error al confirmar transacción:', error);
        res.status(500).json({ mensaje: 'Error al confirmar transacción' });
    }
};

// Obtener estado de una transacción
exports.obtenerEstadoTransaccion = async (req, res) => {
    try {
        const { token } = req.params;

        // Obtener el estado de la transacción
        const resultado = await WebpayPlus.Transaction.status(token, options);

        // Actualizar el estado en la base de datos
        await pool.query(
            'UPDATE transacciones SET estado = ?, respuesta = ? WHERE token = ?',
            [resultado.status, JSON.stringify(resultado), token]
        );

        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener estado de transacción:', error);
        res.status(500).json({ mensaje: 'Error al obtener estado de transacción' });
    }
};

// Reembolsar una transacción
exports.reembolsarTransaccion = async (req, res) => {
    try {
        const { token, monto } = req.body;

        // Obtener la transacción original
        const [transaccion] = await pool.query(
            'SELECT * FROM transacciones WHERE token = ?',
            [token]
        );

        if (!transaccion) {
            return res.status(404).json({ mensaje: 'Transacción no encontrada' });
        }

        // Realizar el reembolso
        const resultado = await WebpayPlus.Transaction.refund(token, monto, options);

        // Registrar el reembolso
        await pool.query(
            'INSERT INTO reembolsos (transaccion_id, monto, token, respuesta) VALUES (?, ?, ?, ?)',
            [transaccion.id, monto, token, JSON.stringify(resultado)]
        );

        res.json(resultado);
    } catch (error) {
        console.error('Error al reembolsar transacción:', error);
        res.status(500).json({ mensaje: 'Error al reembolsar transacción' });
    }
}; 