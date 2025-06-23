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
        </Box>
    );
};

export default ConfirmacionPago; 