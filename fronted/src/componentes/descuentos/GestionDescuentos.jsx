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
import { api, productosAPI } from '../../servicios/api';
import { servicioProductos } from '../../servicios/servicioProductos';

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
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [descuentos, setDescuentos] = useState({});
  const [descuentosPrevios, setDescuentosPrevios] = useState({});
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
  const [descuentoMasivo, setDescuentoMasivo] = useState(0);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [resProds, resCats, resMarcas] = await Promise.all([
        servicioProductos.obtenerTodos(),
        productosAPI.obtenerCategorias(),
        productosAPI.obtenerMarcas()
      ]);
      setProductos(resProds.data || []);
      setCategorias(resCats.data || []);
      setMarcas(resMarcas.data || []);
      // Guardar descuentos previos para deshacer
      const prev = {};
      (resProds.data || []).forEach(p => { prev[p.id] = p.descuento ?? 0; });
      setDescuentosPrevios(prev);
    } catch (err) {
      error('Error al cargar productos/categorías/marcas: ' + (err.response?.data?.error || err.message));
    } finally {
      setCargando(false);
    }
  }, [error]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Filtro y búsqueda
  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaSeleccionada ? (p.categoria && p.categoria.id === Number(categoriaSeleccionada)) : true;
    const coincideMarca = marcaSeleccionada ? (p.marca && p.marca.id === Number(marcaSeleccionada)) : true;
    const coincideBusqueda = busqueda.trim() === '' ||
      (p.nombre && p.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.codigo_sku && p.codigo_sku.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideCategoria && coincideMarca && coincideBusqueda;
  });

  const handleDescuentoChange = (id, value) => {
    setDescuentos({ ...descuentos, [id]: value });
  };

  const guardarDescuento = async (id) => {
    try {
      const valor = descuentos[id];
      await productosAPI.actualizarDescuento(id, valor);
      exito('Descuento actualizado');
      cargarDatos();
    } catch (err) {
      error('Error al actualizar descuento: ' + (err.response?.data?.error || err.message));
    }
  };

  const deshacerDescuento = (id) => {
    setDescuentos({ ...descuentos, [id]: descuentosPrevios[id] });
  };

  // Descuento masivo por categoría
  const aplicarDescuentoCategoria = async () => {
    if (!categoriaSeleccionada) return error('Selecciona una categoría');
    try {
      await productosAPI.actualizarDescuentoCategoria(categoriaSeleccionada, descuentoMasivo);
      exito('Descuento masivo aplicado a la categoría');
      cargarDatos();
    } catch (err) {
      error('Error al aplicar descuento masivo: ' + (err.response?.data?.error || err.message));
    }
  };

  // Descuento masivo por marca
  const aplicarDescuentoMarca = async () => {
    if (!marcaSeleccionada) return error('Selecciona una marca');
    try {
      await productosAPI.actualizarDescuentoMarca(marcaSeleccionada, descuentoMasivo);
      exito('Descuento masivo aplicado a la marca');
      cargarDatos();
    } catch (err) {
      error('Error al aplicar descuento masivo: ' + (err.response?.data?.error || err.message));
    }
  };

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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones y Descuentos</h1>
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

      <div className="p-6 bg-white rounded shadow space-y-4">
        <h2 className="text-2xl font-bold mb-4">Gestión de Descuentos por Producto</h2>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <label className="font-semibold">Categoría:</label>
          <select value={categoriaSeleccionada} onChange={e => setCategoriaSeleccionada(e.target.value)} className="p-2 border rounded">
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <label className="font-semibold">Marca:</label>
          <select value={marcaSeleccionada} onChange={e => setMarcaSeleccionada(e.target.value)} className="p-2 border rounded">
            <option value="">Todas</option>
            {marcas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="p-2 border rounded flex-1 min-w-[200px]"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="number"
            min="0"
            max="100"
            value={descuentoMasivo}
            onChange={e => setDescuentoMasivo(e.target.value)}
            className="p-2 border rounded w-24"
            placeholder="% descuento"
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            onClick={aplicarDescuentoCategoria}
          >
            Aplicar a Categoría
          </button>
          <button
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            onClick={aplicarDescuentoMarca}
          >
            Aplicar a Marca
          </button>
        </div>
        {cargando ? (
          <div>Cargando productos...</div>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Producto</th>
                <th className="p-2 border">Categoría</th>
                <th className="p-2 border">Marca</th>
                <th className="p-2 border">Precio</th>
                <th className="p-2 border">Descuento (%)</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(prod => (
                <tr key={prod.id} className={((prod.descuento ?? 0) > 0) ? 'bg-yellow-50' : ''}>
                  <td className="p-2 border font-semibold flex items-center gap-2">
                    {prod.nombre}
                    {(prod.descuento ?? 0) > 0 && (
                      <span className="bg-yellow-300 text-yellow-900 text-xs px-2 py-0.5 rounded-full ml-2">Descuento</span>
                    )}
                  </td>
                  <td className="p-2 border">{prod.categoria?.nombre || '-'}</td>
                  <td className="p-2 border">{prod.marca?.nombre || '-'}</td>
                  <td className="p-2 border">${prod.precio}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={descuentos[prod.id] ?? prod.descuento ?? 0}
                      onChange={e => handleDescuentoChange(prod.id, e.target.value)}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => guardarDescuento(prod.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                      onClick={() => deshacerDescuento(prod.id)}
                      disabled={descuentos[prod.id] === descuentosPrevios[prod.id]}
                    >
                      Deshacer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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