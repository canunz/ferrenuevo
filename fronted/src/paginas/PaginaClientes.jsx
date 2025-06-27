import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import { servicioClientes } from '../servicios/servicioClientes';
import FormularioCliente from '../componentes/clientes/FormularioCliente';
import DetalleCliente from '../componentes/clientes/DetalleCliente';

const PaginaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteDetalleId, setClienteDetalleId] = useState(null);

  const cargarClientes = () => {
    setCargando(true);
    servicioClientes.listar()
      .then(res => setClientes(res.data))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleGuardar = (datos) => {
    const accion = datos.id ? servicioClientes.actualizar(datos.id, datos) : servicioClientes.crear(datos);
    accion.then(() => {
      setMostrarFormulario(false);
      setClienteEditar(null);
      cargarClientes();
    });
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      servicioClientes.eliminar(id).then(cargarClientes);
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando...</div>;

  if (clienteDetalleId) {
    return (
      <DetalleCliente
        clienteId={clienteDetalleId}
        onVolver={() => setClienteDetalleId(null)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu base de clientes
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Módulo de Gestión de Clientes en desarrollo
          </p>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Clientes</h2>
        <button
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => { setMostrarFormulario(true); setClienteEditar(null); }}
        >
          Nuevo Cliente
        </button>

        {mostrarFormulario && (
          <FormularioCliente
            clienteInicial={clienteEditar}
            onGuardar={handleGuardar}
            onCancelar={() => { setMostrarFormulario(false); setClienteEditar(null); }}
          />
        )}

        <table className="min-w-full bg-white mt-4">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nombre</th>
              <th className="py-2">Email</th>
              <th className="py-2">Teléfono</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td className="py-2">{cliente.id}</td>
                <td className="py-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setClienteDetalleId(cliente.id)}
                  >
                    {cliente.nombre}
                  </button>
                </td>
                <td className="py-2">{cliente.email}</td>
                <td className="py-2">{cliente.telefono}</td>
                <td className="py-2 flex gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded"
                    onClick={() => { setMostrarFormulario(true); setClienteEditar(cliente); }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEliminar(cliente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PaginaClientes;