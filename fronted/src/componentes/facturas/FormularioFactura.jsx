import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { servicioFacturas } from '../../servicios/servicioFacturas';
import { servicioPedidos } from '../../servicios/servicioPedidos';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const FormularioFactura = ({ onGuardar, onCancelar }) => {
  const [formulario, setFormulario] = useState({
    pedido_id: '',
    metodo_pago: 'efectivo',
    observaciones: ''
  });
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const { exito, error } = useNotificacion();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setBuscando(true);
      const respuesta = await servicioPedidos.obtenerTodos({
        estado: 'confirmado',
        limit: 50
      });
      setPedidos(respuesta.data || []);
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      error('Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setBuscando(false);
    }
  };

  const buscarPedidos = async () => {
    if (!terminoBusqueda.trim()) {
      cargarPedidos();
      return;
    }

    try {
      setBuscando(true);
      const respuesta = await servicioPedidos.buscar(terminoBusqueda);
      setPedidos(respuesta.data || []);
    } catch (err) {
      console.error('Error al buscar pedidos:', err);
      error('Error al buscar pedidos');
      setPedidos([]);
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setFormulario(prev => ({ ...prev, pedido_id: pedido.id }));
  };

  const emitirFactura = async () => {
    if (!formulario.pedido_id) {
      error('Debe seleccionar un pedido');
      return;
    }

    try {
      setCargando(true);
      await servicioFacturas.emitirFactura(formulario);
      exito('Factura emitida exitosamente');
      onGuardar();
    } catch (err) {
      console.error('Error al emitir factura:', err);
      error('Error al emitir la factura');
    } finally {
      setCargando(false);
    }
  };

  const formatearMoneda = (monto) => {
    if (!monto && monto !== 0) return 'N/A';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(monto);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Emitir Factura</h2>
          </div>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Selección de pedido */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Pedido</h3>
          
          {/* Búsqueda de pedidos */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarPedidos()}
                placeholder="Buscar pedidos por número, cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Lista de pedidos */}
          <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {buscando ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Buscando pedidos...
              </div>
            ) : Array.isArray(pedidos) && pedidos.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No se encontraron pedidos
              </div>
            ) : Array.isArray(pedidos) ? (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  onClick={() => seleccionarPedido(pedido)}
                  className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    pedidoSeleccionado?.id === pedido.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {pedido.numero_pedido}
                        </span>
                        {pedidoSeleccionado?.id === pedido.id && (
                          <CheckIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Cliente: {pedido.cliente?.nombre || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Fecha: {formatearFecha(pedido.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatearMoneda(pedido.total)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {pedido.detalles?.length || 0} productos
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Cargando pedidos...
              </div>
            )}
          </div>
        </div>

        {/* Pedido seleccionado */}
        {pedidoSeleccionado && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Pedido Seleccionado</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Número de pedido</p>
                <p className="font-medium text-gray-900">{pedidoSeleccionado.numero_pedido}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{pedidoSeleccionado.cliente?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-medium text-gray-900">{formatearFecha(pedidoSeleccionado.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium text-gray-900">{formatearMoneda(pedidoSeleccionado.total)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Configuración de factura */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Factura</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formulario.metodo_pago}
                onChange={(e) => setFormulario(prev => ({ ...prev, metodo_pago: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="webpay">Webpay</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formulario.observaciones}
              onChange={(e) => setFormulario(prev => ({ ...prev, observaciones: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={emitirFactura}
            disabled={!formulario.pedido_id || cargando}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Emitiendo...' : 'Emitir Factura'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioFactura;
