import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    TextField,
    Divider,
    Paper,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useCarrito } from '../../contexto/ContextoCarrito';
import TransbankPago from '../pagos/TransbankPago';

const CarritoCompras = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { carrito, actualizarCantidad, eliminarItem, limpiarCarrito, obtenerTotal } = useCarrito();
    const [openPago, setOpenPago] = useState(false);

    const handleCantidadChange = (id, cantidad) => {
        if (cantidad < 1) return;
        actualizarCantidad(id, cantidad);
    };

    const handleEliminar = (id) => {
        eliminarItem(id);
        enqueueSnackbar('Producto eliminado del carrito', { variant: 'info' });
    };

    const handlePagar = () => {
        if (carrito.length === 0) {
            enqueueSnackbar('El carrito está vacío', { variant: 'warning' });
            return;
        }
        navigate('/confirmacion-pago');
    };

    const handlePagoExitoso = () => {
        limpiarCarrito();
        enqueueSnackbar('Pago realizado exitosamente', { variant: 'success' });
        navigate('/confirmacion-pago');
    };

    if (carrito.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
                p={3}
            >
                <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Tu carrito está vacío
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/productos')}
                >
                    Ver productos
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Carrito de Compras
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                <Box flex={1}>
                    {carrito.map((item) => (
                        <Card key={item.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box display="flex" gap={2}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                                        image={item.imagen || '/placeholder.png'}
                                        alt={item.nombre}
                                    />
                                    <Box flex={1}>
                                        <Typography variant="h6">{item.nombre}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${item.precio.toLocaleString()}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <TextField
                                                size="small"
                                                value={item.cantidad}
                                                onChange={(e) => handleCantidadChange(item.id, parseInt(e.target.value))}
                                                inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                                sx={{ width: 60, mx: 1 }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleEliminar(item.id)}
                                                sx={{ ml: 2 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Paper elevation={3} sx={{ p: 3, width: { xs: '100%', md: 300 } }}>
                    <Typography variant="h6" gutterBottom>
                        Resumen del pedido
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Subtotal:</Typography>
                        <Typography>${obtenerTotal().toLocaleString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>IVA (19%):</Typography>
                        <Typography>${(obtenerTotal() * 0.19).toLocaleString()}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">
                            ${(obtenerTotal() * 1.19).toLocaleString()}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handlePagar}
                    >
                        Proceder al pago
                    </Button>
                </Paper>
            </Box>

            <TransbankPago
                open={openPago}
                onClose={() => setOpenPago(false)}
                monto={obtenerTotal() * 1.19}
                ordenCompra={`ORD-${Date.now()}`}
                onSuccess={handlePagoExitoso}
            />
        </Box>
    );
};

export default CarritoCompras; 