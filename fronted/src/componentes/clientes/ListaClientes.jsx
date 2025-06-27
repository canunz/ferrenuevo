// frontend/src/componentes/clientes/ListaClientes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  UserPlusIcon, 
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { servicioClientes } from '../../servicios/servicioClientes';

const ListaClientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState({
    segmento: '',
    tipo_cliente: ''
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicioClientes.obtenerTodos({
        busqueda,
        ...filtros
      });
      setClientes(response.data || []);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
      setError('Error al cargar los clientes');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarClientes();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [busqueda, filtros]);

  const getSegmentoBadgeColor = (segmento) => {
    const colors = {
      vip: 'bg-purple-100 text-purple-800',
      profesional: 'bg-blue-100 text-blue-800',
      empresa: 'bg-green-100 text-green-800',
      retail: 'bg-gray-100 text-gray-800'
    };
    return colors[segmento] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Sin compras';
    return new Date(date).toLocaleDateString('es-CL');
  };

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 m-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista completa de clientes registrados en el sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => navigate('/clientes/nuevo')}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-3" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar clientes..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        
        <select
          value={filtros.segmento}
          onChange={(e) => setFiltros({...filtros, segmento: e.target.value})}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">Todos los segmentos</option>
          <option value="retail">Retail</option>
          <option value="profesional">Profesional</option>
          <option value="empresa">Empresa</option>
          <option value="vip">VIP</option>
        </select>

        <select
          value={filtros.tipo_cliente}
          onChange={(e) => setFiltros({...filtros, tipo_cliente: e.target.value})}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="persona">Persona</option>
          <option value="empresa">Empresa</option>
        </select>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : clientes.length === 0 ? (
                <div className="text-center py-12">
                  <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
                  <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo cliente.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Cliente
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contacto
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Segmento
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Crédito
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Última Compra
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ver</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {clientes.map((cliente) => (
                      <tr 
                        key={cliente.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/clientes/${cliente.id}`)}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="flex items-center">
                            {cliente.tipo_cliente === 'empresa' ? (
                              <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                            ) : (
                              <UserIcon className="h-8 w-8 text-gray-400" />
                            )}
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{cliente.nombre}</div>
                              <div className="text-gray-500">{cliente.rut || 'Sin RUT'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div>
                            <div className="flex items-center text-gray-900">
                              <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                              {cliente.email}
                            </div>
                            {cliente.telefono && (
                              <div className="flex items-center mt-1 text-gray-500">
                                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                                {cliente.telefono}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getSegmentoBadgeColor(cliente.segmento)}`}>
                            {cliente.segmento?.toUpperCase() || 'RETAIL'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>
                            <div className="font-medium">
                              {formatCurrency((cliente.credito_disponible || 0) - (cliente.credito_usado || 0))}
                            </div>
                            <div className="text-xs text-gray-400">
                              de {formatCurrency(cliente.credito_disponible)}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(cliente.ultima_compra)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListaClientes;