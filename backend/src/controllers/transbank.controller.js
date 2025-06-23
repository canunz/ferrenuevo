const { WebpayPlus, Options, Environment } = require('transbank-sdk');

// Configuración de Transbank para ambiente de integración
const options = new Options(
    '597055555532', // Código de comercio Webpay Plus
    '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // Api Key Secret
    Environment.Integration
);

const transaction = new WebpayPlus.Transaction(options);

// Crear transacción Webpay
exports.crearTransaccion = async (req, res) => {
    try {
        const { 
            monto,
            ordenCompra,
            sessionId,
            returnUrl,
            items,
            cliente,
            metodoEntrega,
            metodoPago
        } = req.body;

        // Validar datos requeridos
        if (!monto || !ordenCompra || !sessionId || !returnUrl) {
            return res.status(400).json({
                success: false,
                error: 'Faltan datos requeridos para crear la transacción'
            });
        }

        // Crear transacción en Transbank
        const resultado = await transaction.create(
            ordenCompra,
            sessionId,
            monto,
            returnUrl
        );

        res.json({
            success: true,
            message: 'Transacción creada exitosamente',
            data: {
                token: resultado.token,
                url: resultado.url,
                orden_compra: ordenCompra
            }
        });

    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

// Confirmar transacción Webpay
exports.confirmarTransaccion = async (req, res) => {
    try {
        const { token_ws } = req.body;

        if (!token_ws) {
            return res.status(400).json({
                success: false,
                error: 'Token de transacción requerido'
            });
        }

        // Confirmar transacción con Transbank
        const resultado = await transaction.commit(token_ws);

        // Si la transacción fue exitosa
        if (resultado.status === 'AUTHORIZED') {
            res.json({
                success: true,
                message: 'Pago confirmado exitosamente',
                data: {
                    status: resultado.status,
                    orden_compra: resultado.buyOrder,
                    monto: resultado.amount,
                    fecha_transaccion: resultado.transactionDate
                }
            });
        } else {
            res.json({
                success: false,
                message: 'Pago rechazado',
                data: {
                    status: resultado.status,
                    orden_compra: resultado.buyOrder,
                    monto: resultado.amount,
                    fecha_transaccion: resultado.transactionDate
                }
            });
        }

    } catch (error) {
        console.error('Error al confirmar transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

// Obtener estado de transacción
exports.obtenerEstadoTransaccion = async (req, res) => {
    try {
        const { token } = req.params;

        const resultado = await transaction.status(token);

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {
        console.error('Error al obtener estado de transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
};

// Reembolsar transacción
exports.reembolsarTransaccion = async (req, res) => {
    try {
        const { token, monto } = req.body;

        const resultado = await transaction.refund(token, monto);

        res.json({
            success: true,
            message: 'Reembolso realizado exitosamente',
            data: resultado
        });

    } catch (error) {
        console.error('Error al reembolsar transacción:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}; 