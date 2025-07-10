import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexto/ContextoAuth';
import { servicioClientes } from '../../servicios/servicioClientes';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { CurrencyDollarIcon, ShoppingCartIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PanelCliente = () => {
  const { usuario } = useAuth();
  const { exito, error } = useNotificacion();
  const [cliente, setCliente] = useState(null);
  const [historial, setHistorial] = useState([]);
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
        setCliente(res);
        // Obtener historial de compras real
        const historialCompras = await servicioClientes.obtenerHistorial(usuario.id);
        if (cancelado) return;
        setHistorial(historialCompras || []);
        // Log para depuración
        console.log('Historial recibido:', historialCompras);
      } catch (e) {
        if (!cancelado) setErrorCarga('No se pudo cargar la información del cliente.');
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    if (usuario?.id) cargarDatos();
    return () => { cancelado = true; };
  }, [usuario]);

  // Calcular total gastado usando monto_total
  const totalGastado = historial.reduce((sum, compra) => sum + (Number(compra.monto_total) || 0), 0);
  // Pedidos recientes (últimos 5)
  const pedidosRecientes = historial.slice(0, 5);
  // Alertas simples (ejemplo: pedidos pendientes)
  const alertas = historial.filter(p => (p.estado || '').toLowerCase() === 'pendiente');

  if (cargando) return <div className="p-8 text-center">Cargando...</div>;
  if (errorCarga) return <div className="p-8 text-center text-red-600">{errorCarga}</div>;
  if (!cliente) return <div className="p-8 text-center text-red-600">No se encontró el cliente</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">¡Bienvenido/a, {cliente.nombre}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
          <div>
            <div className="text-lg font-semibold">Total gastado</div>
            <div className="text-2xl font-bold text-green-700">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalGastado)}
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <ShoppingCartIcon className="w-8 h-8 text-blue-600" />
          <div>
            <div className="text-lg font-semibold">Compras realizadas</div>
            <div className="text-2xl font-bold text-blue-700">{historial.length}</div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
          <div>
            <div className="font-semibold text-yellow-800">Tienes pedidos pendientes:</div>
            <ul className="list-disc ml-6 text-yellow-700">
              {alertas.map((p, i) => (
                <li key={i}>Pedido #{p.numero_pedido} - Total: ${p.total}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pedidos recientes */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold mb-2">Tus últimas compras</h3>
        {pedidosRecientes.length === 0 ? (
          <div>No hay compras registradas.</div>
        ) : (
          <ul className="list-disc ml-6">
            {pedidosRecientes.map((compra, idx) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold">Pedido #{compra.pedido_id || compra.id}</span> - Estado: <span className="capitalize">{compra.estado || '-'}</span> - Total: ${Number(compra.monto_total || 0).toLocaleString('es-CL')}
                {compra.productos && compra.productos.length > 0 && (
                  <ul className="ml-4 text-sm text-gray-700">
                    {compra.productos.map((detalle, i) => (
                      <li key={i}>
                        {detalle.nombre || 'Producto'} x{detalle.cantidad} - ${Number(detalle.precio_unitario || 0).toLocaleString('es-CL')}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PanelCliente; 