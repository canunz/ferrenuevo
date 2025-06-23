const { Venta, Producto, Usuario, Pedido } = require('../modelos');
const { Op } = require('sequelize');
const moment = require('moment');

// Obtener estadísticas principales
exports.obtenerEstadisticasPrincipales = async (req, res) => {
    try {
        const hoy = moment().startOf('day');
        const ayer = moment().subtract(1, 'day').startOf('day');

        // Ventas del día
        const ventasHoy = await Venta.sum('total', {
            where: {
                fecha: {
                    [Op.gte]: hoy.toDate()
                }
            }
        });

        const ventasAyer = await Venta.sum('total', {
            where: {
                fecha: {
                    [Op.gte]: ayer.toDate(),
                    [Op.lt]: hoy.toDate()
                }
            }
        });

        const cambioVentas = ventasAyer ? ((ventasHoy - ventasAyer) / ventasAyer * 100).toFixed(1) : 0;

        // Pedidos pendientes
        const pedidosPendientes = await Pedido.count({
            where: {
                estado: 'pendiente'
            }
        });

        // Clientes activos (últimos 30 días)
        const clientesActivos = await Usuario.count({
            where: {
                ultimaCompra: {
                    [Op.gte]: moment().subtract(30, 'days').toDate()
                }
            }
        });

        // Productos en stock
        const productosStock = await Producto.count({
            where: {
                stock: {
                    [Op.gt]: 0
                }
            }
        });

        res.json([
            {
                titulo: 'Ventas del Día',
                valor: new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP'
                }).format(ventasHoy || 0),
                cambio: `${cambioVentas > 0 ? '+' : ''}${cambioVentas}%`,
                tendencia: cambioVentas >= 0 ? 'up' : 'down',
                icono: 'CurrencyDollarIcon',
                color: 'bg-green-500',
                descripcion: 'Comparado con ayer'
            },
            {
                titulo: 'Pedidos Pendientes',
                valor: pedidosPendientes.toString(),
                cambio: '-2.1%',
                tendencia: 'down',
                icono: 'ShoppingCartIcon',
                color: 'bg-orange-500',
                descripcion: 'Requieren atención'
            },
            {
                titulo: 'Clientes Activos',
                valor: clientesActivos.toString(),
                cambio: '+5.4%',
                tendencia: 'up',
                icono: 'UsersIcon',
                color: 'bg-blue-500',
                descripcion: 'Clientes con compras recientes'
            },
            {
                titulo: 'Productos en Stock',
                valor: productosStock.toString(),
                cambio: '+1.8%',
                tendencia: 'up',
                icono: 'ArchiveBoxIcon',
                color: 'bg-purple-500',
                descripcion: 'Total de productos disponibles'
            }
        ]);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
    }
};

// Obtener ventas recientes
exports.obtenerVentasRecientes = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre']
                },
                {
                    model: Producto,
                    attributes: ['nombre']
                }
            ],
            order: [['fecha', 'DESC']],
            limit: 5
        });

        const ventasFormateadas = ventas.map(venta => ({
            id: venta.id,
            cliente: venta.Usuario.nombre,
            total: venta.total,
            productos: venta.Productos.map(p => p.nombre),
            hora: moment(venta.fecha).format('HH:mm')
        }));

        res.json(ventasFormateadas);
    } catch (error) {
        console.error('Error al obtener ventas recientes:', error);
        res.status(500).json({ mensaje: 'Error al obtener ventas recientes' });
    }
};

// Obtener productos populares
exports.obtenerProductosPopulares = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            attributes: [
                'nombre',
                'stock',
                [sequelize.fn('COUNT', sequelize.col('VentaProductos.id')), 'vendidos']
            ],
            include: [{
                model: Venta,
                attributes: [],
                through: { attributes: [] }
            }],
            group: ['Producto.id'],
            order: [[sequelize.literal('vendidos'), 'DESC']],
            limit: 5
        });

        const productosFormateados = productos.map(producto => ({
            nombre: producto.nombre,
            vendidos: parseInt(producto.getDataValue('vendidos')),
            stock: producto.stock,
            progreso: Math.min(100, (producto.stock / 100) * 100)
        }));

        res.json(productosFormateados);
    } catch (error) {
        console.error('Error al obtener productos populares:', error);
        res.status(500).json({ mensaje: 'Error al obtener productos populares' });
    }
};

// Obtener alertas
exports.obtenerAlertas = async (req, res) => {
    try {
        const alertas = [];

        // Alerta de stock bajo
        const productosStockBajo = await Producto.findAll({
            where: {
                stock: {
                    [Op.lt]: 50
                }
            },
            limit: 1
        });

        if (productosStockBajo.length > 0) {
            alertas.push({
                tipo: 'warning',
                mensaje: `Stock bajo: ${productosStockBajo[0].nombre} (Solo ${productosStockBajo[0].stock} unidades)`,
                icono: 'ExclamationTriangleIcon'
            });
        }

        // Alerta de pedidos pendientes
        const pedidosPendientes = await Pedido.count({
            where: {
                estado: 'pendiente'
            }
        });

        if (pedidosPendientes > 0) {
            alertas.push({
                tipo: 'info',
                mensaje: `${pedidosPendientes} pedidos pendientes requieren atención`,
                icono: 'ClockIcon'
            });
        }

        res.json(alertas);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ mensaje: 'Error al obtener alertas' });
    }
}; 