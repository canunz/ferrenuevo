import api from './api';

export const servicioDashboard = {
    obtenerEstadisticasPrincipales: async () => {
        try {
            const response = await api.get('/dashboard/estadisticas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    },

    obtenerVentasRecientes: async () => {
        try {
            const response = await api.get('/dashboard/ventas-recientes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener ventas recientes:', error);
            throw error;
        }
    },

    obtenerProductosPopulares: async () => {
        try {
            const response = await api.get('/dashboard/productos-populares');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos populares:', error);
            throw error;
        }
    },

    obtenerAlertas: async () => {
        try {
            const response = await api.get('/dashboard/alertas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener alertas:', error);
            throw error;
        }
    }
}; 