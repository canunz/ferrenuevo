// ==========================================
// ARCHIVO: frontend/src/componentes/descuentos/GestionDescuentos.jsx
// ==========================================
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TagIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { api } from '../../servicios/api'; // Asegúrate que tu wrapper de API esté aquí

// Componente Modal para crear/editar promociones
const ModalPromocion = ({ isOpen, onClose, onSave, promocion, productos, categorias, marcas }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (promocion) {
      setFormData({
        ...promocion,
        fecha_inicio: promocion.fecha_inicio ? new Date(promocion.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: promocion.fecha_fin ? new Date(promocion.fecha_fin).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        descripcion: '',
        tipo_descuento: 'porcentaje',
        valor: 0,
        fecha_inicio: '',
        fecha_fin: '',
        activo: true,
        producto_id: null,
        categoria_id: null,
        marca_id: null
      });
    }
  }, [promocion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Limpiar campos no relevantes antes de guardar
    const dataToSave = { ...formData };
    if (dataToSave.producto_id === '') dataToSave.producto_id = null;
    if (dataToSave.categoria_id === '') dataToSave.categoria_id = null;
    if (dataToSave.marca_id === '') dataToSave.marca_id = null;

    onSave(dataToSave);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {promocion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="descripcion" value={formData.descripcion || ''} onChange={handleChange} placeholder="Descripción (ej: 20% en Herramientas)" className="w-full p-2 border rounded" required />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="tipo_descuento" value={formData.tipo_descuento || 'porcentaje'} onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto Fijo (CLP)</option>
                  </select>
                  <input name="valor" type="number" value={formData.valor || ''} onChange={handleChange} placeholder="Valor" className="w-full p-2 border rounded" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                    <input name="fecha_inicio" type="date" value={formData.fecha_inicio || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                    <input name="fecha_fin" type="date" value={formData.fecha_fin || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                  </div>
                </div>

                <p className="text-sm text-gray-600">Aplicar a (opcional, deja en blanco si es para todo):</p>
                <select name="producto_id" value={formData.producto_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Selecciona un Producto</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
                <select name="categoria_id" value={formData.categoria_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Selecciona una Categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                <select name="marca_id" value={formData.marca_id || ''} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="">Selecciona una Marca</option>
                  {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
                
                <div className="flex items-center">
                  <input id="activo" name="activo" type="checkbox" checked={formData.activo || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">Activa</label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// Componente Principal
const GestionDescuentos = () => {
  const { exito, error } = useNotificacion();
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [resPromos, resProds, resCats, resMarcas] = await Promise.all([
        api.get('/promociones'),
        api.get('/productos'),
        api.get('/productos/categorias'),
        api.get('/productos/marcas')
      ]);
      setPromociones(resPromos.data.data || []);
      setProductos(resProds.data.data?.productos || []);
      setCategorias(resCats.data.data || []);
      setMarcas(resMarcas.data.data || []);
    } catch (err) {
      error('Error al cargar datos: ' + (err.response?.data?.error || err.message));
    } finally {
      setCargando(false);
    }
  }, [error]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const abrirModal = (promocion = null) => {
    setPromocionSeleccionada(promocion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPromocionSeleccionada(null);
  };

  const guardarPromocion = async (datos) => {
    try {
      if (datos.id) {
        // Editar
        await api.put(`/promociones/${datos.id}`, datos);
        exito('Promoción actualizada correctamente.');
      } else {
        // Crear
        await api.post('/promociones', datos);
        exito('Promoción creada correctamente.');
      }
      cargarDatos();
      cerrarModal();
    } catch (err) {
      error('Error al guardar la promoción: ' + (err.response?.data?.error || err.message));
    }
  };

  const eliminarPromocion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      try {
        await api.delete(`/promociones/${id}`);
        exito('Promoción eliminada correctamente.');
        cargarDatos();
      } catch (err) {
        error('Error al eliminar la promoción: ' + (err.response?.data?.error || err.message));
      }
    }
  };
  
  const getEstadoPromocion = (promo) => {
    if (!promo.activo) return { texto: 'Inactiva', color: 'bg-red-100 text-red-800' };
    const hoy = new Date();
    const inicio = new Date(promo.fecha_inicio);
    const fin = new Date(promo.fecha_fin);
    if (hoy < inicio) return { texto: 'Programada', color: 'bg-blue-100 text-blue-800' };
    if (hoy > fin) return { texto: 'Finalizada', color: 'bg-gray-100 text-gray-800' };
    return { texto: 'Activa', color: 'bg-green-100 text-green-800' };
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
          <p className="text-gray-600">Crea y administra descuentos para tus productos.</p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nueva Promoción</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promociones.map(promo => {
              const estado = getEstadoPromocion(promo);
              return (
                <tr key={promo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{promo.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{promo.tipo_descuento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.tipo_descuento === 'porcentaje' ? `${promo.valor}%` : `$${promo.valor}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(promo.fecha_inicio).toLocaleDateString()} - {new Date(promo.fecha_fin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estado.color}`}>
                      {estado.texto}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => abrirModal(promo)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => eliminarPromocion(promo.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ModalPromocion
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSave={guardarPromocion}
        promocion={promocionSeleccionada}
        productos={productos}
        categorias={categorias}
        marcas={marcas}
      />
    </div>
  );
};

export default GestionDescuentos;