import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexto/ContextoAuth';
import { servicioClientes } from '../../servicios/servicioClientes';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const PanelCliente = () => {
  const { usuario } = useAuth();
  const { exito, error } = useNotificacion();
  const [cliente, setCliente] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [formDireccion, setFormDireccion] = useState({ direccion: '', ciudad: '', region: '' });
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    let cancelado = false;
    const cargarDatos = async () => {
      setCargando(true);
      setErrorCarga(null);
      try {
        const res = await servicioClientes.obtenerPorId(usuario.id);
        if (cancelado) return;
        setCliente(res.data);
        setForm({
          nombre: res.data.nombre || '',
          email: res.data.email || '',
          telefono: res.data.telefono || ''
        });
        if (res.data.direcciones && res.data.direcciones.length > 0) {
          setDireccion(res.data.direcciones[0]);
          setFormDireccion({
            direccion: res.data.direcciones[0].direccion || '',
            ciudad: res.data.direcciones[0].ciudad || '',
            region: res.data.direcciones[0].region || ''
          });
        } else {
          setDireccion(null);
          setFormDireccion({ direccion: '', ciudad: '', region: '' });
        }
        setHistorial(res.data.historial_compras || []);
      } catch (e) {
        if (!cancelado) setErrorCarga('No se pudo cargar la información del cliente.');
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    if (usuario?.id) cargarDatos();
    return () => { cancelado = true; };
  }, [usuario]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangeDireccion = e => {
    setFormDireccion({ ...formDireccion, [e.target.name]: e.target.value });
  };

  const guardarDatos = async () => {
    try {
      await servicioClientes.actualizar(usuario.id, form);
      exito('Datos personales actualizados');
      setEditando(false);
    } catch {
      error('No se pudo actualizar los datos');
    }
  };

  const guardarDireccion = async () => {
    try {
      await servicioClientes.actualizarDireccion(usuario.id, formDireccion);
      exito('Dirección actualizada');
    } catch {
      error('No se pudo actualizar la dirección');
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando...</div>;
  if (errorCarga) return <div className="p-8 text-center text-red-600">{errorCarga}</div>;
  if (!cliente) return <div className="p-8 text-center text-red-600">No se encontró el cliente</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Bienvenido, {cliente.nombre}</h2>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Datos Personales</h3>
        {editando ? (
          <div className="space-y-2">
            <input name="nombre" value={form.nombre} onChange={handleChange} className="input" placeholder="Nombre" />
            <input name="email" value={form.email} onChange={handleChange} className="input" placeholder="Email" />
            <input name="telefono" value={form.telefono} onChange={handleChange} className="input" placeholder="Teléfono" />
            <button onClick={guardarDatos} className="btn btn-primary">Guardar</button>
            <button onClick={() => setEditando(false)} className="btn btn-secondary ml-2">Cancelar</button>
          </div>
        ) : (
          <div>
            <div><b>Nombre:</b> {cliente.nombre}</div>
            <div><b>Email:</b> {cliente.email}</div>
            <div><b>Teléfono:</b> {cliente.telefono || '-'}</div>
            <button onClick={() => setEditando(true)} className="btn btn-primary mt-2">Editar</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Dirección de Envío</h3>
        <input name="direccion" value={formDireccion.direccion} onChange={handleChangeDireccion} className="input mb-2" placeholder="Dirección" />
        <input name="ciudad" value={formDireccion.ciudad} onChange={handleChangeDireccion} className="input mb-2" placeholder="Ciudad" />
        <input name="region" value={formDireccion.region} onChange={handleChangeDireccion} className="input mb-2" placeholder="Región" />
        <button onClick={guardarDireccion} className="btn btn-primary">Guardar dirección</button>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Historial de Compras</h3>
        {historial.length === 0 ? (
          <div>No hay compras registradas.</div>
        ) : (
          <ul className="list-disc ml-6">
            {historial.map((compra, idx) => (
              <li key={idx}>{compra.descripcion || 'Compra'} - {compra.fecha || compra.fecha_compra || ''}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PanelCliente; 