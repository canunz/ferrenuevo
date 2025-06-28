import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicioClientes } from '../../servicios/servicioClientes';
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';

const DetalleCliente = ({ clienteId, onVolver }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar clienteId si se pasa como prop, sino usar el id de la URL
  const clienteIdToUse = clienteId || id;

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await servicioClientes.obtenerPorId(clienteIdToUse);
        setCliente(data);
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
            {cliente.direccion && (
              <div className="flex items-center text-gray-700 mb-1">
                <span className="font-medium mr-2">Dirección:</span>
                {cliente.direccion}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Información Adicional</h3>
            <div className="mb-1">
              <span className="font-medium">ID:</span> {cliente.id}
            </div>
            <div className="mb-1">
              <span className="font-medium">Crédito disponible:</span> {cliente.credito_disponible ? `$${cliente.credito_disponible}` : 'No asignado'}
            </div>
            <div className="mb-1">
              <span className="font-medium">Última compra:</span> {cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString('es-CL') : 'Sin compras'}
            </div>
          </div>
        </div>

        {/* Historial de Compras */}
        {cliente.historialCompras && cliente.historialCompras.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Historial de Compras</h3>
            <ul className="list-disc ml-6 space-y-1">
              {cliente.historialCompras.map((compra, idx) => (
                <li key={idx} className="text-gray-700">
                  {compra.descripcion} - {compra.fecha}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleCliente;
