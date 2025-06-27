import React, { useEffect, useState } from 'react';
import { servicioClientes } from '../../servicios/servicioClientes';

const DetalleCliente = ({ clienteId, onVolver }) => {
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (clienteId) {
      setCargando(true);
      servicioClientes.obtenerPorId(clienteId)
        .then(res => setCliente(res.data))
        .finally(() => setCargando(false));
    }
  }, [clienteId]);

  if (cargando) return <div className="p-8 text-center">Cargando...</div>;
  if (!cliente) return <div className="p-8 text-center text-red-600">Cliente no encontrado</div>;

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <button onClick={onVolver} className="mb-4 text-blue-600 underline">← Volver</button>
      <h3 className="text-xl font-bold mb-2">Detalle de Cliente</h3>
      <div><b>ID:</b> {cliente.id}</div>
      <div><b>Nombre:</b> {cliente.nombre}</div>
      <div><b>Email:</b> {cliente.email}</div>
      <div><b>Teléfono:</b> {cliente.telefono}</div>
      {/* Puedes agregar más datos aquí */}
      {/* Ejemplo: historial, preferencias, direcciones, etc. */}
      {cliente.historialCompras && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Historial de Compras</h4>
          <ul className="list-disc ml-6">
            {cliente.historialCompras.map((compra, idx) => (
              <li key={idx}>{compra.descripcion} - {compra.fecha}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetalleCliente;

