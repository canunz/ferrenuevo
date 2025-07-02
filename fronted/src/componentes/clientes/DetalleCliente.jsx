import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicioClientes } from '../../servicios/servicioClientes';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, UserIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const DetalleCliente = ({ clienteId, onVolver }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direccionEnvio, setDireccionEnvio] = useState(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historialCompras, setHistorialCompras] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // Usar clienteId si se pasa como prop, sino usar el id de la URL
  const clienteIdToUse = clienteId || id;

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await servicioClientes.obtenerPorId(clienteIdToUse);
        setCliente(data);
        // Obtener dirección de envío
        try {
          const direccion = await servicioClientes.obtenerDireccionEnvio(clienteIdToUse);
          setDireccionEnvio(direccion);
        } catch (e) {
          setDireccionEnvio(null);
        }
      } catch (err) {
        setError('Error al cargar el cliente');
      } finally {
        setLoading(false);
      }
    };
    
    if (clienteIdToUse) {
      fetchCliente();
    }
  }, [clienteIdToUse]);

  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    } else {
      navigate(-1);
    }
  };

  const handleToggleHistorial = async () => {
    if (!mostrarHistorial && historialCompras.length === 0) {
      setCargandoHistorial(true);
      try {
        const data = await servicioClientes.obtenerHistorial(clienteIdToUse);
        setHistorialCompras(data);
      } catch (e) {
        setHistorialCompras([]);
      } finally {
        setCargandoHistorial(false);
      }
    }
    setMostrarHistorial(!mostrarHistorial);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 m-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  if (!cliente) {
    return <div className="p-8 text-center text-red-600">Cliente no encontrado</div>;
  }

  console.log('Cliente en render:', cliente);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={handleVolver}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" /> Volver a la lista
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          {cliente.tipo_cliente === 'empresa' ? (
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400" />
          ) : (
            <UserIcon className="h-12 w-12 text-gray-400" />
          )}
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-gray-900">{cliente.nombre}</h2>
            <p className="text-gray-500">{cliente.rut || 'Sin RUT'}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
              {cliente.tipo_cliente === 'empresa' ? 'Empresa' : 'Persona'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Datos de Contacto</h3>
            <div className="flex items-center text-gray-700 mb-1">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
              {cliente.email}
            </div>
            {cliente.telefono && (
              <div className="flex items-center text-gray-700 mb-1">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                {cliente.telefono}
              </div>
            )}
            {/* Dirección de Envío */}
            {direccionEnvio && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-1 text-gray-700">Dirección de Envío</h4>
                <div className="text-gray-700 text-sm">
                  <div><span className="font-medium">Dirección:</span> {direccionEnvio.direccion} {direccionEnvio.numero} {direccionEnvio.depto_oficina && `, Depto/Of: ${direccionEnvio.depto_oficina}`}</div>
                  <div><span className="font-medium">Comuna:</span> {direccionEnvio.comuna}</div>
                  <div><span className="font-medium">Ciudad:</span> {direccionEnvio.ciudad}</div>
                  <div><span className="font-medium">Región:</span> {direccionEnvio.region}</div>
                  {direccionEnvio.codigo_postal && <div><span className="font-medium">Código Postal:</span> {direccionEnvio.codigo_postal}</div>}
                  <div><span className="font-medium">Receptor:</span> {direccionEnvio.nombre_receptor}</div>
                  {direccionEnvio.telefono_receptor && <div><span className="font-medium">Teléfono:</span> {direccionEnvio.telefono_receptor}</div>}
                  {direccionEnvio.instrucciones_entrega && <div><span className="font-medium">Instrucciones:</span> {direccionEnvio.instrucciones_entrega}</div>}
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Información Adicional</h3>
            <div className="mb-1">
              <span className="font-medium">ID:</span> {cliente.id}
            </div>
            <div className="mb-1">
              <span className="font-medium">Última compra:</span> {cliente.estadisticas && cliente.estadisticas.ultima_compra ? new Date(cliente.estadisticas.ultima_compra).toLocaleDateString('es-CL') : 'Sin compras'}
            </div>
          </div>
        </div>

        {/* Historial de Compras */}
        <div className="mt-6">
          <button
            onClick={handleToggleHistorial}
            className="flex items-center text-gray-700 font-semibold text-lg focus:outline-none"
          >
            {mostrarHistorial ? (
              <ChevronDownIcon className="h-5 w-5 mr-2" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 mr-2" />
            )}
            Historial de Compras
          </button>
          {mostrarHistorial && (
            <div className="mt-3">
              {cargandoHistorial ? (
                <div className="text-gray-500">Cargando historial...</div>
              ) : historialCompras.length === 0 ? (
                <div className="text-gray-400">Sin compras registradas.</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {historialCompras.map((compra, idx) => (
                    <li key={idx} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{compra.descripcion || 'Compra'}</span>
                        <span className="text-sm text-gray-500">{new Date(compra.fecha_compra).toLocaleDateString()}</span>
                        <span className="text-sm font-semibold text-indigo-700">${compra.monto_total}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
                        <span>Método: {compra.metodo_pago}</span>
                        <span>Puntos: {compra.puntos_ganados}</span>
                        <span>Satisfacción: {compra.nivel_satisfaccion}</span>
                        {parseFloat(compra.descuento_aplicado) > 0 && (
                          <span>Descuento: ${compra.descuento_aplicado}</span>
                        )}
                        {compra.comentario_compra && (
                          <span>Comentario: {compra.comentario_compra}</span>
                        )}
                      </div>
                      {compra.productos && compra.productos.length > 0 && (
                        <div className="mt-1 ml-4">
                          <span className="block text-xs font-semibold text-gray-700 mb-1">Productos:</span>
                          <ul className="list-disc ml-4 text-xs text-gray-700">
                            {compra.productos.map((prod, i) => (
                              <li key={i}>
                                {prod.nombre} (x{prod.cantidad}) - ${prod.precio_unitario}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleCliente;
