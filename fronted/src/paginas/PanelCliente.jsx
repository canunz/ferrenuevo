// ==========================================
// ARCHIVO: frontend/src/paginas/PanelCliente.jsx
// ==========================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBagIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  TagIcon,
  DocumentTextIcon,
  UserIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexto/ContextoAuth';
import { useCarrito } from '../contexto/ContextoCarrito';

const PanelCliente = () => {
  const { usuario } = useAuth();
  const { carrito, obtenerTotal } = useCarrito();
  const [seccionActiva, setSeccionActiva] = useState('contacto');

  // Datos simulados del cliente
  const datosCliente = {
    nombre: usuario?.nombre || 'Juan Pérez',
    email: usuario?.email || 'juan.perez@email.com',
    telefono: '+56 9 1234 5678',
    rut: '12.345.678-9',
    tipoCliente: 'Mayorista',
    descuentoActivo: 15,
    puntosFidelidad: 1250
  };

  const pedidosRecientes = [
    {
      id: 'PED-2024-001',
      fecha: '2024-06-05',
      estado: 'Entregado',
      total: 485990,
      productos: 8,
      direccion: 'Las Condes, Santiago',
      colorEstado: 'green'
    },
    {
      id: 'PED-2024-002',
      fecha: '2024-06-03',
      estado: 'En Tránsito',
      total: 234500,
      productos: 4,
      direccion: 'Providencia, Santiago',
      colorEstado: 'blue'
    },
    {
      id: 'PED-2024-003',
      fecha: '2024-06-01',
      estado: 'Procesando',
      total: 156750,
      productos: 6,
      direccion: 'Ñuñoa, Santiago',
      colorEstado: 'yellow'
    },
    {
      id: 'PED-2024-004',
      fecha: '2024-05-28',
      estado: 'Cancelado',
      total: 89990,
      productos: 2,
      direccion: 'Maipú, Santiago',
      colorEstado: 'red'
    }
  ];

  const direccionesGuardadas = [
    {
      id: 1,
      nombre: 'Casa Principal',
      direccion: 'Av. Providencia 1234, Apto 56',
      comuna: 'Providencia',
      ciudad: 'Santiago',
      telefono: '+56 9 1234 5678',
      principal: true
    },
    {
      id: 2,
      nombre: 'Oficina',
      direccion: 'Av. Las Condes 890, Piso 12',
      comuna: 'Las Condes',
      ciudad: 'Santiago',
      telefono: '+56 2 2345 6789',
      principal: false
    },
    {
      id: 3,
      nombre: 'Bodega',
      direccion: 'Calle Industrial 456',
      comuna: 'Quilicura',
      ciudad: 'Santiago',
      telefono: '+56 9 8765 4321',
      principal: false
    }
  ];

  const promocionesDisponibles = [
    {
      id: 1,
      titulo: 'Descuento Mayorista',
      descripcion: '15% de descuento en pedidos sobre $200.000',
      descuento: '15%',
      validoHasta: '2024-12-31',
      activo: true,
      codigo: 'MAYOR15'
    },
    {
      id: 2,
      titulo: 'Envío Gratis',
      descripcion: 'Envío gratis en pedidos sobre $150.000',
      descuento: 'Envío Gratis',
      validoHasta: '2024-07-31',
      activo: true,
      codigo: 'ENVIO0'
    },
    {
      id: 3,
      titulo: 'Herramientas Eléctricas',
      descripcion: '20% en herramientas Bosch y Makita',
      descuento: '20%',
      validoHasta: '2024-06-30',
      activo: true,
      codigo: 'TOOLS20'
    }
  ];

  const facturasPendientes = [
    {
      id: 'FAC-2024-156',
      fecha: '2024-06-03',
      vencimiento: '2024-06-18',
      monto: 234500,
      estado: 'Pendiente',
      pedidoId: 'PED-2024-002'
    },
    {
      id: 'FAC-2024-155',
      fecha: '2024-06-01',
      vencimiento: '2024-06-16',
      monto: 156750,
      estado: 'Vencida',
      pedidoId: 'PED-2024-003'
    }
  ];

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'Entregado':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'En Tránsito':
        return <TruckIcon className="h-5 w-5 text-blue-600" />;
      case 'Procesando':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    }
  };

  const menuNavegacion = [
    {
      id: 'contacto',
      nombre: 'Datos de Contacto',
      descripcion: 'Información esencial para la comunicación con el cliente',
      icono: UserIcon,
    },
    {
      id: 'compras',
      nombre: 'Historial de Compras',
      descripcion: 'Registros de transacciones pasadas para análisis',
      icono: ClockIcon,
    },
    {
      id: 'envio',
      nombre: 'Dirección de Envío',
      descripcion: 'Detalles para la entrega eficiente de productos',
      icono: MapPinIcon,
    },
    {
      id: 'segmentacion',
      nombre: 'Búsqueda y Segmentación',
      descripcion: 'Herramientas para campañas de marketing dirigidas',
      icono: MagnifyingGlassIcon,
    },
  ];

  const renderContenido = () => {
    const opcion = menuNavegacion.find((item) => item.id === seccionActiva);
    switch (opcion.id) {
      case 'contacto':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center"><UserIcon className="h-7 w-7 text-red-600 mr-2" /> {opcion.nombre}</h2>
            <p className="text-gray-600 text-lg mb-6">{opcion.descripcion}</p>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" value="Juan Pérez" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" value="juan.perez@email.com" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2" value="+56 9 1234 5678" disabled />
              </div>
            </form>
          </div>
        );
      case 'compras':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center"><ClockIcon className="h-7 w-7 text-red-600 mr-2" /> {opcion.nombre}</h2>
            <p className="text-gray-600 text-lg mb-6">{opcion.descripcion}</p>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2">05/06/2024</td>
                  <td className="px-4 py-2">Martillo Stanley</td>
                  <td className="px-4 py-2">$12.990</td>
                  <td className="px-4 py-2 text-green-600 font-semibold">Entregado</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">03/06/2024</td>
                  <td className="px-4 py-2">Taladro Bosch</td>
                  <td className="px-4 py-2">$54.990</td>
                  <td className="px-4 py-2 text-blue-600 font-semibold">En tránsito</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">01/06/2024</td>
                  <td className="px-4 py-2">Caja de herramientas</td>
                  <td className="px-4 py-2">$29.990</td>
                  <td className="px-4 py-2 text-yellow-600 font-semibold">Procesando</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'envio':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center"><MapPinIcon className="h-7 w-7 text-red-600 mr-2" /> {opcion.nombre}</h2>
            <p className="text-gray-600 text-lg mb-6">{opcion.descripcion}</p>
            <ul className="space-y-3">
              <li className="p-4 bg-gray-50 rounded-lg border flex flex-col">
                <span className="font-medium text-gray-900">Casa Principal</span>
                <span className="text-gray-600 text-sm">Av. Providencia 1234, Apto 56, Santiago</span>
                <span className="text-gray-500 text-xs">Tel: +56 9 1234 5678</span>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg border flex flex-col">
                <span className="font-medium text-gray-900">Oficina</span>
                <span className="text-gray-600 text-sm">Av. Las Condes 890, Piso 12, Santiago</span>
                <span className="text-gray-500 text-xs">Tel: +56 2 2345 6789</span>
              </li>
            </ul>
          </div>
        );
      case 'segmentacion':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center"><MagnifyingGlassIcon className="h-7 w-7 text-red-600 mr-2" /> {opcion.nombre}</h2>
            <p className="text-gray-600 text-lg mb-6">{opcion.descripcion}</p>
            <div className="text-gray-700">Filtra tus compras por fecha, producto o monto para recibir promociones personalizadas.</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del panel */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Cliente</h1>
              <p className="text-gray-600">Gestión de Clientes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navegación */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <nav className="space-y-2">
                {menuNavegacion.map((item) => {
                  const Icono = item.icono;
                  const activo = seccionActiva === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSeccionActiva(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activo
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icono className={`mr-3 h-5 w-5 ${activo ? 'text-red-600' : 'text-gray-400'}`} />
                      {item.nombre}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
                {renderContenido()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PanelCliente;