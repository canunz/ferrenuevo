import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicioClientes } from '../../servicios/servicioClientes';
import { useAuth } from '../../contexto/ContextoAuth';

const FormularioCliente = ({ modoEdicion = false, clienteInicial = {}, onGuardar, onCancelar }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuario } = useAuth();
  const [valores, setValores] = useState({
    nombre: '',
    email: '',
    password: '',
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
    ...clienteInicial
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [direccionEnvio, setDireccionEnvio] = useState({
    calle: '',
    numero: '',
    departamento: '',
    comuna: '',
    ciudad: '',
    region: '',
    nombre_receptor: '',
    codigo_postal: '',
    instrucciones: ''
  });

  useEffect(() => {
    if (clienteInicial && Object.keys(clienteInicial).length > 0) {
      setValores({ ...valores, ...clienteInicial });
    }
  }, [clienteInicial]);

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
          // Obtener dirección de envío si existe
          try {
            const direccion = await servicioClientes.obtenerDireccionEnvio(id);
            setDireccionEnvio({ ...direccion });
          } catch (e) {
            // No hay dirección, dejar vacío
            setDireccionEnvio({
              calle: '', numero: '', departamento: '', comuna: '', ciudad: '', region: '', nombre_receptor: '', codigo_postal: '', instrucciones: ''
            });
          }
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
    if (!modoEdicion && !valores.password) nuevosErrores.password = 'La contraseña es obligatoria';
    if (!valores.tipo_cliente) nuevosErrores.tipo_cliente = 'Selecciona un tipo de cliente';
    return nuevosErrores;
  };

  const handleChange = e => {
    setValores({ ...valores, [e.target.name]: e.target.value });
  };

  // Handler para cambios en los campos de dirección
  const handleDireccionChange = (e) => {
    const { name, value } = e.target;
    setDireccionEnvio((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    
    setCargando(true);
    try {
      console.log('Valores enviados al backend:', valores);
      let clienteGuardado;
      if (onGuardar) {
        await onGuardar(valores);
      } else {
        if (modoEdicion && id) {
          const valoresEnviar = { ...valores };
          if (!valoresEnviar.fecha_nacimiento || isNaN(new Date(valoresEnviar.fecha_nacimiento).getTime())) {
            valoresEnviar.fecha_nacimiento = null;
          }
          clienteGuardado = await servicioClientes.actualizar(id, valoresEnviar);
        } else {
          const valoresEnviar = { ...valores };
          if (modoEdicion) {
            delete valoresEnviar.password;
          }
          clienteGuardado = await servicioClientes.crear(valoresEnviar);
        }
      }
      // Guardar dirección de envío si hay datos
      const clienteId = modoEdicion ? id : clienteGuardado.data?.id || clienteGuardado.id;
      const idParaDireccion = clienteId || usuario?.id;
      // Validar campos obligatorios
      if (!direccionEnvio.nombre_receptor || !direccionEnvio.calle || !direccionEnvio.region) {
        alert('Completa todos los campos obligatorios de la dirección: Nombre del Receptor, Dirección y Región.');
        return;
      }
      // Mapear los campos del frontend a los del backend
      const direccionEnvioBackend = {
        nombre_receptor: direccionEnvio.nombre_receptor,
        direccion: direccionEnvio.calle,
        numero: direccionEnvio.numero,
        depto_oficina: direccionEnvio.departamento,
        comuna: direccionEnvio.comuna,
        ciudad: direccionEnvio.ciudad,
        region: direccionEnvio.region,
        codigo_postal: direccionEnvio.codigo_postal,
        instrucciones_entrega: direccionEnvio.instrucciones
      };
      console.log('Datos a enviar:', direccionEnvioBackend);
      if (idParaDireccion && direccionEnvio.calle) {
        await servicioClientes.actualizarDireccionEnvio(idParaDireccion, direccionEnvioBackend);
      }
      alert(modoEdicion ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
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

  const handleCancelar = () => {
    if (onCancelar) {
      onCancelar();
    } else {
      navigate('/clientes');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
      </h2>
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
          <label className="block text-sm font-medium mb-1">RUT</label>
          <input
            type="text"
            name="rut"
            value={valores.rut}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-gray-300"
            placeholder="Ej: 12345678-9"
          />
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
        
        {!modoEdicion && (
          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={valores.password}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errores.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ingresa una contraseña"
            />
            {errores.password && <p className="text-red-600 text-xs mt-1">{errores.password}</p>}
          </div>
        )}
        
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

        {valores.tipo_cliente === 'empresa' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Razón Social</label>
              <input
                type="text"
                name="razon_social"
                value={valores.razon_social}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giro</label>
              <input
                type="text"
                name="giro"
                value={valores.giro}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 border-gray-300"
              />
            </div>
          </>
        )}

        {valores.tipo_cliente === 'persona' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={valores.fecha_nacimiento}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Género</label>
              <select
                name="genero"
                value={valores.genero}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 border-gray-300"
              >
                <option value="no_especifica">No especifica</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea
            name="notas"
            value={valores.notas}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded px-3 py-2 border-gray-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mt-6 mb-2">Dirección de Envío</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Receptor</label>
                <input type="text" name="nombre_receptor" value={direccionEnvio.nombre_receptor} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Región</label>
                <input type="text" name="region" value={direccionEnvio.region} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input type="text" name="calle" value={direccionEnvio.calle} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Número</label>
                <input type="text" name="numero" value={direccionEnvio.numero} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departamento/Oficina</label>
                <input type="text" name="departamento" value={direccionEnvio.departamento} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comuna</label>
                <input type="text" name="comuna" value={direccionEnvio.comuna} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input type="text" name="ciudad" value={direccionEnvio.ciudad} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código Postal</label>
                <input type="text" name="codigo_postal" value={direccionEnvio.codigo_postal} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Instrucciones de Entrega</label>
                <textarea name="instrucciones" value={direccionEnvio.instrucciones} onChange={handleDireccionChange} className="w-full border rounded px-3 py-2" rows="2" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancelar}
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
