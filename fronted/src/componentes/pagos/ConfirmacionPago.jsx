import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../../servicios/api';

const ConfirmacionPago = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transaccion, setTransaccion] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token_ws');
        if (!token) {
            setError('No se recibió token de transacción');
            setLoading(false);
            return;
        }

        const confirmarPago = async () => {
            try {
                const response = await api.post('/transbank/confirmar', { token });
                setTransaccion(response.data);
                enqueueSnackbar('Pago confirmado exitosamente', { variant: 'success' });
            } catch (error) {
                setError(error.response?.data?.mensaje || 'Error al confirmar el pago');
                enqueueSnackbar('Error al confirmar el pago', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        confirmarPago();
    }, [searchParams, enqueueSnackbar]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/carrito')}>
                    Volver al carrito
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    Pago Confirmado
                </Typography>
                {transaccion && (
                    <>
                        <Typography variant="body1" gutterBottom>
                            Orden de compra: {transaccion.orden_compra}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Monto: ${transaccion.monto.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Estado: {transaccion.estado}
                        </Typography>
                    </>
                )}
                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                    >
                        Volver al inicio
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/mis-compras')}
                    >
                        Ver mis compras
                    </Button>
                </Box>
            </Paper>

            {/* Tarjetas de prueba Webpay */}
            <Box mt={4} maxWidth={600} mx="auto">
                <Paper elevation={1} sx={{ p: 2, background: '#f5faff' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Tarjetas de Prueba Webpay (Integración)
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Puedes usar estos datos para probar pagos en el ambiente de integración de Webpay:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        <li><b>Visa:</b> 4051 8856 0044 6623</li>
                        <li><b>Mastercard:</b> 5186 0510 0998 5324</li>
                        <li><b>Redcompra:</b> 4051 8856 0044 6623</li>
                    </ul>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <b>CVV:</b> 123 &nbsp; | &nbsp; <b>Fecha:</b> Cualquiera &nbsp; | &nbsp; <b>Rut:</b> 11.111.111-1 &nbsp; | &nbsp; <b>Clave:</b> 123
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default ConfirmacionPago; 