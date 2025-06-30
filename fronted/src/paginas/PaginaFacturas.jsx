import React, { useState } from 'react';
import ListaFacturas from '../componentes/facturas/ListaFacturas';
import DetalleFactura from '../componentes/facturas/DetalleFactura';
import FormularioFactura from '../componentes/facturas/FormularioFactura';

const PaginaFacturas = () => {
  const [vista, setVista] = useState('lista'); // 'lista', 'detalle', 'formulario'
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const handleVerFactura = (facturaId) => {
    setFacturaSeleccionada(facturaId);
    setVista('detalle');
  };

  const handleEmitirFactura = () => {
    setVista('formulario');
  };

  const handleVolver = () => {
    setVista('lista');
    setFacturaSeleccionada(null);
  };

  const handleFacturaEmitida = () => {
    setVista('lista');
    // Recargar la lista de facturas
  };

  const renderVista = () => {
    switch (vista) {
      case 'detalle':
        return (
          <DetalleFactura
            facturaId={facturaSeleccionada}
            onVolver={handleVolver}
          />
        );
      case 'formulario':
        return (
          <FormularioFactura
            onGuardar={handleFacturaEmitida}
            onCancelar={handleVolver}
          />
        );
      default:
        return (
          <ListaFacturas
            onVerFactura={handleVerFactura}
            onEmitirFactura={handleEmitirFactura}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturas</h1>
        <p className="text-gray-600 mt-2">
          Emite, visualiza y gestiona las facturas de la empresa
        </p>
      </div>

      {renderVista()}
    </div>
  );
};

export default PaginaFacturas;