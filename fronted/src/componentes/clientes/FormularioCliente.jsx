import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicioClientes } from '../../servicios/servicioClientes';

const FormularioCliente = ({ modoEdicion = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo_cliente: '',
    rut: '',
    razon_social: '',
    giro: '',
    fecha_nacimiento: '',
    genero: 'no_especifica',
    direccion_principal: null,
    preferencias: null,
    notas: '',
    credito_disponible: 0,
    descuento_personalizado: 0,
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (modoEdicion && id) {
      (async () => {
        try {
          setCargando(true);
          const cliente = await servicioClientes.obtenerPorId(id);
          setValores({
            nombre: cliente.nombre || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            tipo_cliente: cliente.tipo_cliente || '',
            rut: cliente.rut || '',
            razon_social: cliente.razon_social || '',
            giro: cliente.giro || '',
            fecha_nacimiento: cliente.fecha_nacimiento || '',
            genero: cliente.genero || 'no_especifica',
            direccion_principal: cliente.direccion_principal || null,
            preferencias: cliente.preferencias || null,
            notas: cliente.notas || '',
            credito_disponible: cliente.credito_disponible || 0,
            descuento_personalizado: cliente.descuento_personalizado || 0,
          });
        } catch (error) {
          alert('Error al cargar datos del cliente');
        } finally {
          setCargando(false);
        }
      })();
    }
  }, [modoEdicion, id]);

  const validar = () => {
    const nuevosErrores = {};
    if (!valores.nombre) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!valores.email) nuevosErrores.email = 'El email es obligatorio';
    if (!valores.tipo_cliente) nuevosErrores.tipo_cliente = 'Selecciona un tipo de cliente';
    return nuevosErrores;
  };

  const handleChange = e => {
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setCargando(true);
    try {
      if (modoEdicion && id) {
        const valoresEnviar = { ...valores };
        if (!valoresEnviar.fecha_nacimiento || isNaN(new Date(valoresEnviar.fecha_nacimiento).getTime())) {
          valoresEnviar.fecha_nacimiento = null;
        }
        await servicioClientes.actualizar(id, valoresEnviar);
        alert('Cliente actualizado exitosamente');
      } else {
        const valoresEnviar = { ...valores };
        delete valoresEnviar.password;
        await servicioClientes.crear(valoresEnviar);
        alert('Cliente creado exitosamente');
      }
      navigate('/clientes');
    } catch (error) {
      let mensaje = modoEdicion ? 'Error al actualizar el cliente' : 'Error al crear el cliente';
      if (error.response && error.response.data && error.response.data.errors) {
        mensaje += ': ' + error.response.data.errors.map(e => e.msg).join(', ');
      } else if (error.response && error.response.data && error.response.data.error) {
        mensaje += ': ' + error.response.data.error;
      }
      alert(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Nuevo Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={valores.nombre}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.nombre ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errores.nombre && <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={valores.email}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errores.email && <p className="text-red-600 text-xs mt-1">{errores.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={valores.telefono}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Cliente</label>
          <select
            name="tipo_cliente"
            value={valores.tipo_cliente}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errores.tipo_cliente ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecciona...</option>
            <option value="persona">Persona</option>
            <option value="empresa">Empresa</option>
          </select>
          {errores.tipo_cliente && <p className="text-red-600 text-xs mt-1">{errores.tipo_cliente}</p>}
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/clientes')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50"
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCliente;
