import api from './api';

export const servicioDashboard = {
    obtenerEstadisticasPrincipales: async () => {
        try {
            const response = await api.get('/dashboard/test/estadisticas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return {
                totalVentas: 0,
                totalProductos: 0,
                totalClientes: 0,
                totalPedidos: 0
            };
        }
    },

    obtenerVentasRecientes: async () => {
        try {
            const response = await api.get('/dashboard/test/ventas-recientes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener ventas recientes:', error);
            return [];
        }
    },

    obtenerProductosPopulares: async () => {
        try {
            const response = await api.get('/dashboard/test/productos-populares');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos populares:', error);
            return [];
        }
    },

    obtenerAlertas: async () => {
        try {
            const response = await api.get('/dashboard/test/alertas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener alertas:', error);
            return [];
        }
    }
}; 