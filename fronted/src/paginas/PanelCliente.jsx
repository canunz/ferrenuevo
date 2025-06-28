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
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexto/ContextoAuth';
import { useCarrito } from '../contexto/ContextoCarrito';

const PanelCliente = () => {
  const { usuario } = useAuth();
  const { carrito, obtenerTotal } = useCarrito();
  const [seccionActiva, setSeccionActiva] = useState('resumen');

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
    { id: 'resumen', nombre: 'Resumen', icono: UserIcon },
    { id: 'pedidos', nombre: 'Mis Pedidos', icono: ShoppingBagIcon },
    { id: 'direcciones', nombre: 'Direcciones', icono: MapPinIcon },
    { id: 'facturas', nombre: 'Facturas', icono: DocumentTextIcon },
    { id: 'promociones', nombre: 'Promociones', icono: TagIcon },
    { id: 'configuracion', nombre: 'Mi Perfil', icono: UserIcon }
  ];

  const renderResumen = () => (
    <div className="space-y-6">
      {/* Bienvenida y estadísticas */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">¡Hola, {datosCliente.nombre}!</h2>
        <p className="text-blue-100 mb-4">Bienvenido de vuelta a tu panel de cliente FERREMAS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <p className="text-2xl font-bold">{pedidosRecientes.length}</p>
                <p className="text-blue-100 text-sm">Pedidos Totales</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <p className="text-2xl font-bold">{datosCliente.puntosFidelidad}</p>
                <p className="text-blue-100 text-sm">Puntos Fidelidad</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <TagIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <p className="text-2xl font-bold">{datosCliente.descuentoActivo}%</p>
                <p className="text-blue-100 text-sm">Descuento Activo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos recientes y accesos rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos pedidos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Recientes</h3>
          <div className="space-y-3">
            {pedidosRecientes.slice(0, 3).map((pedido) => (
              <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {obtenerIconoEstado(pedido.estado)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{pedido.id}</p>
                    <p className="text-sm text-gray-600">{pedido.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatearPrecio(pedido.total)}</p>
                  <p className={`text-sm font-medium ${
                    pedido.colorEstado === 'green' ? 'text-green-600' :
                    pedido.colorEstado === 'blue' ? 'text-blue-600' :
                    pedido.colorEstado === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pedido.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSeccionActiva('pedidos')}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos los pedidos →
          </button>
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSeccionActiva('pedidos')}
              className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-800">Nuevo Pedido</span>
            </button>
            <button 
              onClick={() => setSeccionActiva('facturas')}
              className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <DocumentTextIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-800">Ver Facturas</span>
            </button>
            <button 
              onClick={() => setSeccionActiva('direcciones')}
              className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <MapPinIcon className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-800">Direcciones</span>
            </button>
            <button 
              onClick={() => setSeccionActiva('promociones')}
              className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <TagIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-800">Promociones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPedidos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Historial de Pedidos</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Realizar Nuevo Pedido
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>Todos los estados</option>
              <option>Entregado</option>
              <option>En Tránsito</option>
              <option>Procesando</option>
              <option>Cancelado</option>
            </select>
            <input 
              type="date" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input 
              type="text" 
              placeholder="Buscar por ID de pedido..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-0"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {pedidosRecientes.map((pedido) => (
            <div key={pedido.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {obtenerIconoEstado(pedido.estado)}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{pedido.id}</h3>
                    <p className="text-sm text-gray-600">{pedido.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatearPrecio(pedido.total)}</p>
                  <p className={`text-sm font-medium ${
                    pedido.colorEstado === 'green' ? 'text-green-600' :
                    pedido.colorEstado === 'blue' ? 'text-blue-600' :
                    pedido.colorEstado === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {pedido.estado}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Productos:</span> {pedido.productos} items
                </div>
                <div>
                  <span className="font-medium">Entrega en:</span> {pedido.direccion}
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver Detalles
                  </button>
                  <span>•</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Rastrear Pedido
                  </button>
                  {pedido.estado === 'Entregado' && (
                    <>
                      <span>•</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Reordenar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDirecciones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Direcciones de Entrega</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Agregar Nueva Dirección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {direccionesGuardadas.map((direccion) => (
          <div key={direccion.id} className="bg-white rounded-lg shadow-sm border p-6 relative">
            {direccion.principal && (
              <div className="absolute top-4 right-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Principal
                </span>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">{direccion.nombre}</h3>
              <p className="text-gray-600 text-sm mb-1">{direccion.direccion}</p>
              <p className="text-gray-600 text-sm mb-1">{direccion.comuna}, {direccion.ciudad}</p>
              <p className="text-gray-600 text-sm">{direccion.telefono}</p>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-50 transition-colors">
                Editar
              </button>
              {!direccion.principal && (
                <button className="flex-1 text-red-600 border border-red-600 px-3 py-2 rounded text-sm hover:bg-red-50 transition-colors">
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFacturas = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Facturas y Pagos</h2>

      {/* Facturas pendientes */}
      {facturasPendientes.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-orange-800 mb-3">Facturas Pendientes de Pago</h3>
          <div className="space-y-3">
            {facturasPendientes.map((factura) => (
              <div key={factura.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{factura.id}</h4>
                  <p className="text-sm text-gray-600">
                    Emitida: {factura.fecha} • Vence: {factura.vencimiento}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                    factura.estado === 'Vencida' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {factura.estado}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatearPrecio(factura.monto)}</p>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                    Pagar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de facturas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Historial de Facturas</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No hay facturas adicionales por el momento</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPromociones = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Promociones y Descuentos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promocionesDisponibles.map((promocion) => (
          <motion.div
            key={promocion.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <TagIcon className="h-6 w-6" />
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm font-medium">
                  {promocion.descuento}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-2">{promocion.titulo}</h3>
              <p className="text-gray-600 text-sm mb-3">{promocion.descripcion}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>Código: <span className="font-mono font-medium">{promocion.codigo}</span></span>
                <span>Válido hasta: {promocion.validoHasta}</span>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                Usar Promoción
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderConfiguracion = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información personal */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                value={datosCliente.nombre}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={datosCliente.email}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input 
                type="tel" 
                value={datosCliente.telefono}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
              <input 
                type="text" 
                value={datosCliente.rut}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled
              />
            </div>
          </div>
          <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Guardar Cambios
          </button>
        </div>

        {/* Información de cuenta */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Cuenta</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Tipo de Cliente:</span>
              <span className="text-sm font-medium text-blue-600">{datosCliente.tipoCliente}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Descuento Activo:</span>
              <span className="text-sm font-medium text-green-600">{datosCliente.descuentoActivo}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Puntos de Fidelidad:</span>
              <span className="text-sm font-medium text-purple-600">{datosCliente.puntosFidelidad} pts</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Cambiar Contraseña</h4>
            <div className="space-y-3">
              <input 
                type="password" 
                placeholder="Contraseña actual"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <input 
                type="password" 
                placeholder="Nueva contraseña"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <input 
                type="password" 
                placeholder="Confirmar nueva contraseña"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'resumen':
        return renderResumen();
      case 'pedidos':
        return renderPedidos();
      case 'direcciones':
        return renderDirecciones();
      case 'facturas':
        return renderFacturas();
      case 'promociones':
        return renderPromociones();
      case 'configuracion':
        return renderConfiguracion();
      default:
        return renderResumen();
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
              <p className="text-gray-600">Gestiona tus pedidos, direcciones y más</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{datosCliente.nombre}</p>
                <p className="text-sm text-gray-600">{datosCliente.tipoCliente}</p>
              </div>
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {datosCliente.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
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
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSeccionActiva(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        seccionActiva === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icono className="mr-3 h-5 w-5" />
                      {item.nombre}
                    </button>
                  );
                })}
              </nav>

              {/* Información de contacto */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">¿Necesitas Ayuda?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>(56) 2 2XXX XXXX</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>soporte@ferremas.cl</span>
                  </div>
                </div>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                  Contactar Soporte
                </button>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={seccionActiva}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContenido()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PanelCliente;