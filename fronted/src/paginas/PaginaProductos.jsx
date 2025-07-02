import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CubeIcon } from '@heroicons/react/24/outline';
import { servicioProductos } from '../servicios/servicioProductos';

const TABS = {
  CATALOGO: 'Catálogo',
  MASIVA: 'Carga Masiva',
  FICHAS: 'Fichas Técnicas',
};

const initialFicha = { dimensiones: '', materiales: '', caracteristicas: '' };

const PaginaProductos = () => {
  const [tab, setTab] = useState(TABS.CATALOGO);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', codigo_sku: '', categoria_id: '', marca_id: '', ficha_tecnica: initialFicha });
  const [editId, setEditId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [masivaMsg, setMasivaMsg] = useState('');

  // Cargar productos
  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await servicioProductos.obtenerTodos();
      let productosArray = [];
      if (response.success && Array.isArray(response.data)) {
        productosArray = response.data;
      } else if (response.success && response.data && Array.isArray(response.data.productos)) {
        productosArray = response.data.productos;
      } else if (response.success && response.data && Array.isArray(response.data.data)) {
        productosArray = response.data.data;
      }
      setProductos(productosArray);
    } catch (e) {
      setError(e.message);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarProductos(); }, []);

  // CRUD Producto
  const handleFormChange = e => {
    const { name, value } = e.target;
    if (name.startsWith('ficha_tecnica.')) {
      setForm({ ...form, ficha_tecnica: { ...form.ficha_tecnica, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editId) {
        await servicioProductos.actualizar(editId, form);
      } else {
        await servicioProductos.crear(form);
      }
      setForm({ nombre: '', descripcion: '', precio: '', codigo_sku: '', categoria_id: '', marca_id: '', ficha_tecnica: initialFicha });
      setEditId(null);
      cargarProductos();
    } catch (e) {
      alert('Error al guardar: ' + e.message);
    }
  };

  const handleEditar = prod => {
    setEditId(prod.id);
    setForm({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      precio: prod.precio || '',
      codigo_sku: prod.codigo_sku || '',
      categoria_id: prod.categoria_id || '',
      marca_id: prod.marca_id || '',
      ficha_tecnica: prod.ficha_tecnica || initialFicha,
    });
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await servicioProductos.eliminar(id);
    cargarProductos();
  };

  // Carga masiva
  const handleCsvChange = e => setCsvFile(e.target.files[0]);
  const handleCsvUpload = async e => {
    e.preventDefault();
    if (!csvFile) return;
    setMasivaMsg('Subiendo...');
    try {
      await servicioProductos.cargaMasiva(csvFile);
      setMasivaMsg('Carga exitosa');
      cargarProductos();
    } catch (e) {
      setMasivaMsg('Error: ' + e.message);
    }
  };

  // Fichas técnicas (CRUD sobre ficha_tecnica)
  const handleFichaChange = (id, field, value) => {
    setProductos(productos.map(p => p.id === id ? { ...p, ficha_tecnica: { ...p.ficha_tecnica, [field]: value } } : p));
  };
  const handleFichaSave = async id => {
    const prod = productos.find(p => p.id === id);
    await servicioProductos.actualizar(id, { ficha_tecnica: prod.ficha_tecnica });
    cargarProductos();
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Gestión de Productos</h1>
      <div className="flex gap-2 mb-6">
        {Object.values(TABS).map(t => (
          <button key={t} className={`px-4 py-2 rounded-t ${tab === t ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700'}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {/* Catálogo */}
      {tab === TABS.CATALOGO && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Catálogo de Productos</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4" onSubmit={handleSubmit}>
            <input name="nombre" value={form.nombre} onChange={handleFormChange} placeholder="Nombre" className="border p-2 rounded" required />
            <input name="codigo_sku" value={form.codigo_sku} onChange={handleFormChange} placeholder="Código SKU" className="border p-2 rounded" required />
            <input name="precio" value={form.precio} onChange={handleFormChange} placeholder="Precio" type="number" className="border p-2 rounded" required />
            <input name="categoria_id" value={form.categoria_id} onChange={handleFormChange} placeholder="ID Categoría" className="border p-2 rounded" required />
            <input name="marca_id" value={form.marca_id} onChange={handleFormChange} placeholder="ID Marca" className="border p-2 rounded" required />
            <textarea name="descripcion" value={form.descripcion} onChange={handleFormChange} placeholder="Descripción" className="border p-2 rounded col-span-2" />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editId ? 'Actualizar' : 'Crear'}</button>
              {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', descripcion: '', precio: '', codigo_sku: '', categoria_id: '', marca_id: '', ficha_tecnica: initialFicha }); }} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>}
            </div>
          </form>
          {cargando ? <div>Cargando...</div> : error ? <div className="text-red-500">{error}</div> : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-blue-100">
                  <th>ID</th><th>Nombre</th><th>SKU</th><th>Precio</th><th>Categoría</th><th>Marca</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(prod => (
                  <tr key={prod.id} className="border-b">
                    <td>{prod.id}</td>
                    <td>{prod.nombre}</td>
                    <td>{prod.codigo_sku}</td>
                    <td>${parseInt(prod.precio).toLocaleString('es-CL')}</td>
                    <td>{prod.categoria_id}</td>
                    <td>{prod.marca_id}</td>
                    <td>
                      <button className="text-blue-600 mr-2" onClick={() => handleEditar(prod)}>Editar</button>
                      <button className="text-red-600" onClick={() => handleEliminar(prod.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {/* Carga Masiva */}
      {tab === TABS.MASIVA && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Carga Masiva de Productos</h2>
          <form onSubmit={handleCsvUpload} className="flex gap-2 items-center mb-4">
            <input type="file" accept=".csv" onChange={handleCsvChange} className="border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Subir CSV</button>
            {masivaMsg && <span>{masivaMsg}</span>}
          </form>
          <div className="mb-2">O agrega productos rápidamente:</div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleSubmit}>
            <input name="nombre" value={form.nombre} onChange={handleFormChange} placeholder="Nombre" className="border p-2 rounded" required />
            <input name="codigo_sku" value={form.codigo_sku} onChange={handleFormChange} placeholder="Código SKU" className="border p-2 rounded" required />
            <input name="precio" value={form.precio} onChange={handleFormChange} placeholder="Precio" type="number" className="border p-2 rounded" required />
            <input name="categoria_id" value={form.categoria_id} onChange={handleFormChange} placeholder="ID Categoría" className="border p-2 rounded" required />
            <input name="marca_id" value={form.marca_id} onChange={handleFormChange} placeholder="ID Marca" className="border p-2 rounded" required />
            <textarea name="descripcion" value={form.descripcion} onChange={handleFormChange} placeholder="Descripción" className="border p-2 rounded col-span-2" />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Agregar</button>
            </div>
          </form>
        </div>
      )}
      {/* Fichas Técnicas */}
      {tab === TABS.FICHAS && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Fichas Técnicas</h2>
          <table className="w-full text-sm border mb-4">
            <thead>
              <tr className="bg-blue-100">
                <th>ID</th><th>Nombre</th><th>Dimensiones</th><th>Materiales</th><th>Características</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(prod => (
                <tr key={prod.id} className="border-b">
                  <td>{prod.id}</td>
                  <td>{prod.nombre}</td>
                  <td><input value={prod.ficha_tecnica?.dimensiones || ''} onChange={e => handleFichaChange(prod.id, 'dimensiones', e.target.value)} className="border p-1 rounded w-32" /></td>
                  <td><input value={prod.ficha_tecnica?.materiales || ''} onChange={e => handleFichaChange(prod.id, 'materiales', e.target.value)} className="border p-1 rounded w-32" /></td>
                  <td><input value={prod.ficha_tecnica?.caracteristicas || ''} onChange={e => handleFichaChange(prod.id, 'caracteristicas', e.target.value)} className="border p-1 rounded w-32" /></td>
                  <td><button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={() => handleFichaSave(prod.id)}>Guardar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaginaProductos;