import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../servicios/api';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';

const GestionPromociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPromocion, setEditingPromocion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo: 'descuento',
        regla_descuento: {
            nombre: '',
            tipo: 'porcentaje',
            valor: 0
        },
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        productos: [],
        categorias: []
    });

    useEffect(() => {
        cargarPromociones();
        cargarProductos();
        cargarCategorias();
    }, []);

    const cargarPromociones = async () => {
        try {
            const response = await api.get('/promociones');
            setPromociones(response.data);
        } catch (error) {
            console.error('Error al cargar promociones:', error);
            enqueueSnackbar('Error al cargar promociones', { variant: 'error' });
        }
    };

    const cargarProductos = async () => {
        try {
            const response = await api.get('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const cargarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const handleOpenDialog = (promocion = null) => {
        if (promocion) {
            setEditingPromocion(promocion);
            setFormData({
                ...promocion,
                fecha_inicio: new Date(promocion.fecha_inicio),
                fecha_fin: new Date(promocion.fecha_fin)
            });
        } else {
            setEditingPromocion(null);
            setFormData({
                nombre: '',
                descripcion: '',
                tipo: 'descuento',
                regla_descuento: {
                    nombre: '',
                    tipo: 'porcentaje',
                    valor: 0
                },
                fecha_inicio: new Date(),
                fecha_fin: new Date(),
                productos: [],
                categorias: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPromocion(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('regla_descuento.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                regla_descuento: {
                    ...prev.regla_descuento,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingPromocion) {
                await api.put(`/promociones/${editingPromocion.id}`, formData);
                enqueueSnackbar('Promoción actualizada exitosamente', { variant: 'success' });
            } else {
                await api.post('/promociones', formData);
                enqueueSnackbar('Promoción creada exitosamente', { variant: 'success' });
            }
            handleCloseDialog();
            cargarPromociones();
        } catch (error) {
            console.error('Error al guardar promoción:', error);
            enqueueSnackbar('Error al guardar promoción', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta promoción?')) {
            try {
                await api.delete(`/promociones/${id}`);
                enqueueSnackbar('Promoción eliminada exitosamente', { variant: 'success' });
                cargarPromociones();
            } catch (error) {
                console.error('Error al eliminar promoción:', error);
                enqueueSnackbar('Error al eliminar promoción', { variant: 'error' });
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Gestión de Promociones</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Nueva Promoción
                </Button>
            </Box>

            <Grid container spacing={3}>
                {promociones.map((promocion) => (
                    <Grid item xs={12} md={6} lg={4} key={promocion.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">{promocion.nombre}</Typography>
                                    <Box>
                                        <IconButton onClick={() => handleOpenDialog(promocion)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(promocion.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                    {promocion.descripcion}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chip
                                        label={promocion.tipo}
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={`${promocion.tipo_descuento === 'porcentaje' ? '%' : '$'}${promocion.valor_descuento}`}
                                        color="secondary"
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ mt: 2 }}>
                                    Válido hasta: {new Date(promocion.fecha_fin).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingPromocion ? 'Editar Promoción' : 'Nueva Promoción'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de Promoción</InputLabel>
                                    <Select
                                        name="tipo"
                                        value={formData.tipo}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <MenuItem value="descuento">Descuento</MenuItem>
                                        <MenuItem value="combo">Combo</MenuItem>
                                        <MenuItem value="regalo">Regalo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tipo de Descuento</InputLabel>
                                    <Select
                                        name="regla_descuento.tipo"
                                        value={formData.regla_descuento.tipo}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <MenuItem value="porcentaje">Porcentaje</MenuItem>
                                        <MenuItem value="monto_fijo">Monto Fijo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Valor del Descuento"
                                    name="regla_descuento.valor"
                                    type="number"
                                    value={formData.regla_descuento.valor}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                                    <DatePicker
                                        label="Fecha de Inicio"
                                        value={formData.fecha_inicio}
                                        onChange={(newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fecha_inicio: newValue
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
                                    <DatePicker
                                        label="Fecha de Fin"
                                        value={formData.fecha_fin}
                                        onChange={(newValue) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                fecha_fin: newValue
                                            }));
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GestionPromociones; 