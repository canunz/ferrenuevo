import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { api } from '../../servicios/api';
import { useSnackbar } from 'notistack';

const TransbankPago = ({ open, onClose, monto, ordenCompra, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const iniciarPago = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/transbank/crear', {
                monto,
                orden_compra: ordenCompra,
                session_id: Date.now().toString(),
                return_url: `${window.location.origin}/pago/confirmacion`
            });

            // Redirigir a la página de pago de Transbank
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Error al iniciar pago:', error);
            setError('Error al iniciar el proceso de pago');
            enqueueSnackbar('Error al iniciar el proceso de pago', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Pago con Transbank</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Resumen del Pago
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Orden de Compra: {ordenCompra}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Monto a Pagar: ${monto.toLocaleString('es-CL')}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={iniciarPago}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                >
                    {loading ? 'Procesando...' : 'Pagar Ahora'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransbankPago; 