import React, { useState } from 'react';
import { registrarIngresoStockTest, registrarEgresoStock } from '../../servicios/servicioInventario';

const MovimientoStock = ({ productoId, modoCompacto, onMovimientoExitoso }) => {
  const [cantidad, setCantidad] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleMovimiento = async (tipo) => {
    setMensaje('');
    setCargando(true);
    try {
      const data = { 
        producto_id: productoId, 
        cantidad: Number(cantidad),
        motivo: tipo === 'ingreso' ? 'Ingreso manual de stock' : 'Egreso manual de stock'
      };
      console.log('🔍 Datos a enviar:', data);
      console.log('🔍 productoId:', productoId);
      console.log('🔍 cantidad:', cantidad);
      console.log('🔍 Token disponible:', !!localStorage.getItem('token'));
      
      let res;
      if (tipo === 'ingreso') res = await registrarIngresoStockTest(data);
      if (tipo === 'egreso') res = await registrarEgresoStock(data);
      setMensaje('✅ Movimiento registrado');
      setCantidad(0);
      if (onMovimientoExitoso && res && res.data && res.data.inventario) {
        onMovimientoExitoso(res.data.inventario);
      }
    } catch (err) {
      console.error('❌ Error en handleMovimiento:', err);
      console.error('❌ Error response:', err.response);
      let errorMsg = 'No se pudo registrar el movimiento';
      if (err.response && err.response.data) {
        errorMsg = err.response.data.error || err.response.data.message || errorMsg;
      }
      setMensaje('❌ ' + errorMsg);
    } finally {
      setCargando(false);
    }
  };

  if (modoCompacto) {
    return (
      <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
          min="1"
          required
          style={{ width: 60, height: 32 }}
          placeholder="Cantidad"
        />
        <button
          type="button"
          disabled={cargando || cantidad <= 0}
          onClick={() => handleMovimiento('ingreso')}
          style={{ height: 32, padding: '0 12px', background: '#22c55e', color: 'white', borderRadius: 4, border: 'none', fontWeight: 'bold', fontSize: 18 }}
          title="Sumar al stock"
        >
          +
        </button>
        <button
          type="button"
          disabled={cargando || cantidad <= 0}
          onClick={() => handleMovimiento('egreso')}
          style={{ height: 32, padding: '0 12px', background: '#ef4444', color: 'white', borderRadius: 4, border: 'none', fontWeight: 'bold', fontSize: 18 }}
          title="Restar del stock"
        >
          –
        </button>
        {mensaje && <span style={{ fontSize: 12, marginLeft: 8 }}>{mensaje}</span>}
      </form>
    );
  }

  // Versión no compacta (opcional, por si se usa en otro contexto)
  return (
    <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 350 }}>
      <label>
        Cantidad:
        <input type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} min="1" required />
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          disabled={cargando || cantidad <= 0}
          onClick={() => handleMovimiento('ingreso')}
          style={{ height: 32, padding: '0 12px', background: '#22c55e', color: 'white', borderRadius: 4, border: 'none', fontWeight: 'bold', fontSize: 18 }}
        >
          + Ingreso
        </button>
        <button
          type="button"
          disabled={cargando || cantidad <= 0}
          onClick={() => handleMovimiento('egreso')}
          style={{ height: 32, padding: '0 12px', background: '#ef4444', color: 'white', borderRadius: 4, border: 'none', fontWeight: 'bold', fontSize: 18 }}
        >
          – Egreso
        </button>
      </div>
      {mensaje && <div style={{ marginTop: 8 }}>{mensaje}</div>}
    </form>
  );
};

export default MovimientoStock;
