import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  UserIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { servicioFacturas } from '../../servicios/servicioFacturas';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const DetalleFactura = ({ facturaId, onVolver }) => {
  const [factura, setFactura] = useState(null);
  const [cargando, setCargando] = useState(true);
  const { error } = useNotificacion();

  useEffect(() => {
    cargarFactura();
  }, [facturaId]);

  const cargarFactura = async () => {
    try {
      setCargando(true);
      const respuesta = await servicioFacturas.obtenerPorId(facturaId);
      setFactura(respuesta.data);
    } catch (err) {
      console.error('Error al cargar factura:', err);
      error('Error al cargar la factura');
    } finally {
      setCargando(false);
    }
  };

  const imprimirFactura = () => {
    window.print();
  };

  const descargarPDF = () => {
    window.open(`/facturas/${facturaId}/pdf`, '_blank');
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Factura no encontrada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onVolver}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Factura {servicioFacturas.formatearNumero(factura.numero_factura)}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={imprimirFactura}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <PrinterIcon className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={descargarPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              Descargar PDF
            </button>
          </div>
        </div>
      </div>

      {/* Información de la factura */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Información del Cliente
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Nombre:</span>
                <p className="text-gray-900">{factura.cliente?.nombre || factura.cliente_nombre}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-900">{factura.cliente?.email || factura.cliente_email}</p>
              </div>
              {factura.cliente?.telefono && (
                <div>
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <p className="text-gray-900">{factura.cliente.telefono}</p>
                </div>
              )}
              {factura.cliente?.direccion && (
                <div>
                  <span className="font-medium text-gray-700">Dirección:</span>
                  <p className="text-gray-900">{factura.cliente.direccion}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de la factura */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5" />
              Detalles de la Factura
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Número:</span>
                <p className="text-gray-900">{servicioFacturas.formatearNumero(factura.numero_factura)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Fecha de emisión:</span>
                <p className="text-gray-900">{servicioFacturas.formatearFecha(factura.fecha_emision)}</p>
              </div>
              {factura.fecha_vencimiento && (
                <div>
                  <span className="font-medium text-gray-700">Fecha de vencimiento:</span>
                  <p className="text-gray-900">{servicioFacturas.formatearFecha(factura.fecha_vencimiento)}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Estado:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                  factura.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                  factura.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  factura.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {servicioFacturas.obtenerEstados().find(s => s.value === factura.estado)?.label || factura.estado}
                </span>
              </div>
              {factura.metodo_pago && (
                <div>
                  <span className="font-medium text-gray-700">Método de pago:</span>
                  <p className="text-gray-900">{factura.metodo_pago}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IVA
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {factura.detalles?.map((detalle) => (
                  <tr key={detalle.id}>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {detalle.producto_nombre}
                        </div>
                        {detalle.producto_codigo && (
                          <div className="text-sm text-gray-500">
                            Código: {detalle.producto_codigo}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {detalle.cantidad}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {servicioFacturas.formatearMoneda(detalle.precio_unitario)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {servicioFacturas.formatearMoneda(detalle.descuento)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {servicioFacturas.formatearMoneda(detalle.subtotal)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {servicioFacturas.formatearMoneda(detalle.iva)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {servicioFacturas.formatearMoneda(detalle.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="mt-6 flex justify-end">
          <div className="w-80 bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Totales</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-gray-900">{servicioFacturas.formatearMoneda(factura.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Descuento:</span>
                <span className="text-gray-900">{servicioFacturas.formatearMoneda(factura.descuento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">IVA (19%):</span>
                <span className="text-gray-900">{servicioFacturas.formatearMoneda(factura.iva)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-gray-900">{servicioFacturas.formatearMoneda(factura.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {factura.observaciones && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{factura.observaciones}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleFactura;
