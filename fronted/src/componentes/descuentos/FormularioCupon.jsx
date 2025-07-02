import React, { useState, useEffect } from 'react';

const FormularioCupon = () => {
  const [form, setForm] = useState({
    codigo: '',
    descripcion: '',
    tipo: 'porcentaje',
    valor: '',
    monto_minimo: '',
    fecha_inicio: '',
    fecha_fin: '',
    usos_limite: 1
  });
  const [mensaje, setMensaje] = useState(null);
  const [cupones, setCupones] = useState([]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const cargarCupones = async () => {
    try {
      const res = await fetch('/api/v1/promociones/cupones');
      const data = await res.json();
      if (data.success) setCupones(data.cupones);
    } catch {}
  };

  useEffect(() => { cargarCupones(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje(null);
    try {
      const res = await fetch('/api/v1/promociones/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMensaje('Cupón creado correctamente');
        setForm({
          codigo: '', descripcion: '', tipo: 'porcentaje', valor: '', monto_minimo: '', fecha_inicio: '', fecha_fin: '', usos_limite: 1
        });
        cargarCupones();
      } else {
        setMensaje(data.message || 'Error al crear cupón');
      }
    } catch (err) {
      setMensaje('Error al crear cupón');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold mb-2">Crear Cupón</h2>
        {mensaje && <div className="mb-2 text-center text-green-700">{mensaje}</div>}
        <div>
          <label className="block mb-1">Código</label>
          <input name="codigo" value={form.codigo} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block mb-1">Descripción</label>
          <input name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto_fijo">Monto fijo ($)</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Valor</label>
          <input name="valor" value={form.valor} onChange={handleChange} className="w-full border px-3 py-2 rounded" required type="number" min="1" />
        </div>
        <div>
          <label className="block mb-1">Monto mínimo</label>
          <input name="monto_minimo" value={form.monto_minimo} onChange={handleChange} className="w-full border px-3 py-2 rounded" type="number" min="0" />
        </div>
        <div>
          <label className="block mb-1">Fecha inicio</label>
          <input name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange} className="w-full border px-3 py-2 rounded" required type="date" />
        </div>
        <div>
          <label className="block mb-1">Fecha fin</label>
          <input name="fecha_fin" value={form.fecha_fin} onChange={handleChange} className="w-full border px-3 py-2 rounded" required type="date" />
        </div>
        <div>
          <label className="block mb-1">Usos límite</label>
          <input name="usos_limite" value={form.usos_limite} onChange={handleChange} className="w-full border px-3 py-2 rounded" type="number" min="1" />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Crear Cupón</button>
      </form>
      <div className="max-w-2xl mx-auto mt-8">
        <h3 className="text-lg font-bold mb-2">Cupones creados</h3>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Código</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Usos</th>
              <th className="p-2">Vigencia</th>
            </tr>
          </thead>
          <tbody>
            {cupones.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-2 font-mono">{c.codigo}</td>
                <td className="p-2">{c.tipo === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'}</td>
                <td className="p-2">{c.tipo === 'porcentaje' ? `${c.valor}%` : `$${c.valor}`}</td>
                <td className="p-2">{c.estado}</td>
                <td className="p-2">{c.usos_totales}/{c.usos_limite}</td>
                <td className="p-2">{c.fecha_inicio?.slice(0,10)}<br/>al<br/>{c.fecha_fin?.slice(0,10)}</td>
              </tr>
            ))}
            {cupones.length === 0 && (
              <tr><td colSpan={6} className="p-2 text-center text-gray-400">No hay cupones creados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormularioCupon;
