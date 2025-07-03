import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { servicioProductos } from '../../servicios/servicioProductos';
import { servicioDescuentos } from '../../servicios/servicioDescuentos';
import { TagIcon, PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import api from '../../servicios/api';
import dayjs from 'dayjs';

const ModalPromocion = ({ open, onClose, onSave, producto }) => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    tipo_descuento: 'porcentaje',
    valor_descuento: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && producto) {
      // Fechas por defecto: hoy y mañana
      const hoy = dayjs().format('YYYY-MM-DD');
      const manana = dayjs().add(1, 'day').format('YYYY-MM-DD');
      setForm({
        nombre: `Promo ${producto.nombre}`,
        descripcion: '',
        tipo_descuento: 'porcentaje',
        valor_descuento: '',
        fecha_inicio: hoy,
        fecha_fin: manana
      });
      setError(null);
    }
  }, [open, producto]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      // Actualizar el campo descuento del producto (descuento manual)
      await servicioProductos.actualizarDescuento(producto.id, form.valor_descuento);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCargando(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Promoción para {producto?.nombre}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 border rounded" required />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 border rounded" />
          <div className="flex gap-2">
            <select name="tipo_descuento" value={form.tipo_descuento} onChange={handleChange} className="p-2 border rounded">
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto_fijo">Monto Fijo</option>
            </select>
            <input name="valor_descuento" type="number" value={form.valor_descuento} onChange={handleChange} placeholder="Valor" className="p-2 border rounded w-32" required />
          </div>
          <div className="flex gap-2">
            <input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} className="p-2 border rounded w-1/2" required />
            <input name="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} className="p-2 border rounded w-1/2" required />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" disabled={cargando} className="px-4 py-2 bg-blue-600 text-white rounded">{cargando ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GestorPromociones = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, producto: null });
  const [exito, setExito] = useState('');

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    setExito('');
    try {
      const resProductos = await servicioProductos.obtenerTodos({ limit: 1000 });
      const resDescuentos = await servicioDescuentos.obtenerTodos();
      const descuentos = resDescuentos.data || [];
      const productosConDescuento = (resProductos.data || []).map(prod => {
        const descuento = descuentos.find(d => d.producto_id === prod.id && d.estado === 'activa');
        return { ...prod, descuento };
      });
      setProductos(productosConDescuento);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(precio);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {exito && <div className="bg-green-100 text-green-800 p-2 rounded text-center">{exito}</div>}
      {/* Listado de Productos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Productos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Aplica descuentos a productos específicos.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Original</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento Aplicado</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={producto.imagen || '/assets/imagenes/productos/placeholder.jpg'} alt={producto.nombre} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{producto.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {producto.codigo_sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatearPrecio(producto.precio)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {producto.tiene_promocion && producto.promocion_activa ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {producto.promocion_activa.tipo === 'porcentaje'
                          ? `-${producto.promocion_activa.porcentaje}%`
                          : `-$${Number(producto.promocion_activa.ahorro ?? producto.promocion_activa.descuento_monto ?? 0).toLocaleString('es-CL')}`}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Sin descuento</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center"
                      onClick={() => setModal({ open: true, producto })}
                    >
                      <PlusCircleIcon className="w-5 h-5 mr-1" />
                      Crear Descuento
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && !cargando && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos.</p>
            </div>
          )}
        </div>
      </div>
      <ModalPromocion
        open={modal.open}
        producto={modal.producto}
        onClose={() => setModal({ open: false, producto: null })}
        onSave={() => {
          setModal({ open: false, producto: null });
          setExito('¡Descuento creado y asociado correctamente!');
          cargarDatos();
        }}
      />
    </motion.div>
  );
};

export default GestorPromociones;

