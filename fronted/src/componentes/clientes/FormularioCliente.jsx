import React, { useState, useEffect } from 'react';

const FormularioCliente = ({ clienteInicial = {}, onGuardar, onCancelar }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ...clienteInicial
  });

  useEffect(() => {
    setForm({ ...form, ...clienteInicial });
    // eslint-disable-next-line
  }, [clienteInicial]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gray-50 p-4 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
        <button type="button" onClick={onCancelar} className="bg-gray-200 px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default FormularioCliente;
