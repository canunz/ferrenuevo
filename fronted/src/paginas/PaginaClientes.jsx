import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import ListaClientes from '../componentes/clientes/ListaClientes';
import { servicioClientes } from '../servicios/servicioClientes';
import FormularioCliente from '../componentes/clientes/FormularioCliente';
import DetalleCliente from '../componentes/clientes/DetalleCliente';

const PaginaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteDetalleId, setClienteDetalleId] = useState(null);
  const [error, setError] = useState(null);

  // Mover cargarClientes aquí
  const cargarClientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await servicioClientes.listar();
      setClientes(res.data || res);
    } catch (err) {
      setError('Error al cargar clientes: ' + (err.message || err));
    } finally {
      setCargando(false);
    }
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

  if (mostrarFormulario) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {clienteEditar ? 'Modifica los datos del cliente' : 'Agrega un nuevo cliente al sistema'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <FormularioCliente
            clienteInicial={clienteEditar}
            onGuardar={handleGuardar}
            onCancelar={() => { setMostrarFormulario(false); setClienteEditar(null); }}
          />
        </div>
      </motion.div>
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
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <ListaClientes />
      </div>
    </motion.div>
  );
};

export default PaginaClientes;