import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShoppingCartIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../../contexto/ContextoNotificacion';
import { servicioPedidos } from '../../servicios/servicioPedidos';
import { servicioProductos } from '../../servicios/servicioProductos';

const FormularioPedido = ({ pedido = null, onGuardar, onCancelar }) => {
  const [formulario, setFormulario] = useState({
    productos: [],
    metodo_entrega: 'retiro_tienda',
    direccion_entrega: '',
    observaciones: '',
    metodo_pago: 'transferencia'
  });
  
  const [productos, setProductos] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [buscandoProductos, setBuscandoProductos] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [paso, setPaso] = useState(1); // 1: Productos, 2: Cliente, 3: Entrega, 4: Resumen
  const { exito, error } = useNotificacion();

  useEffect(() => {
    if (pedido) {
      setFormulario({
        productos: pedido.productos || [],
        metodo_entrega: pedido.metodo_entrega || 'retiro_tienda',
        direccion_entrega: pedido.direccion_entrega || '',
        observaciones: pedido.observaciones || '',
        metodo_pago: pedido.metodo_pago || 'transferencia'
      });
    }
    cargarProductos();
  }, [pedido]);

  const cargarProductos = async () => {
    try {
      const response = await servicioProductos.obtenerTodos({ activo: true });
      setProductosDisponibles(response.data || []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  const buscarProductos = async (termino) => {
    if (!termino.trim()) {
      setProductosDisponibles([]);
      return;
    }

    setBuscandoProductos(true);
    try {
      const response = await servicioProductos.buscar(termino);
      setProductosDisponibles(response.data || []);
    } catch (err) {
      console.error('Error al buscar productos:', err);
    } finally {
      setBuscandoProductos(false);
    }
  };

  const agregarProducto = (producto) => {
    const productoExistente = formulario.productos.find(p => p.producto_id === producto.id);
    
    if (productoExistente) {
      setFormulario(prev => ({
        ...prev,
        productos: prev.productos.map(p => 
          p.producto_id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1, subtotal: (p.cantidad + 1) * p.precio_unitario }
            : p
        )
      }));
    } else {
      const nuevoProducto = {
        producto_id: producto.id,
        producto_nombre: producto.nombre,
        cantidad: 1,
        precio_unitario: producto.precio,
        subtotal: producto.precio,
        stock_disponible: producto.stock
      };
      
      setFormulario(prev => ({
        ...prev,
        productos: [...prev.productos, nuevoProducto]
      }));
    }
    
    setTerminoBusqueda('');
    setProductosDisponibles([]);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(productoId);
      return;
    }

    setFormulario(prev => ({
      ...prev,
      productos: prev.productos.map(p => 
        p.producto_id === productoId 
          ? { ...p, cantidad: nuevaCantidad, subtotal: nuevaCantidad * p.precio_unitario }
          : p
      )
    }));
  };

  const eliminarProducto = (productoId) => {
    setFormulario(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.producto_id !== productoId)
    }));
  };

  const calcularSubtotal = () => {
    return formulario.productos.reduce((sum, p) => sum + p.subtotal, 0);
  };

  const calcularEnvio = () => {
    if (formulario.metodo_entrega === 'despacho_domicilio') return 5990;
    return 0;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularEnvio();
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const validarFormulario = () => {
    if (formulario.productos.length === 0) {
      error('Debe agregar al menos un producto');
      return false;
    }
    
    if (formulario.metodo_entrega === 'despacho_domicilio' && !formulario.direccion_entrega.trim()) {
      error('Debe especificar una dirección de entrega');
      return false;
    }
    
    return true;
  };

  const guardarPedido = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      const datosPedido = {
        ...formulario,
        subtotal: calcularSubtotal(),
        total: calcularTotal(),
        costo_envio: calcularEnvio()
      };

      if (pedido) {
        await servicioPedidos.actualizar(pedido.id, datosPedido);
        exito('Pedido actualizado correctamente');
      } else {
        await servicioPedidos.crear(datosPedido);
        exito('Pedido creado correctamente');
      }

      if (onGuardar) {
        onGuardar();
      }
    } catch (err) {
      console.error('Error al guardar pedido:', err);
      error('Error al guardar el pedido');
    } finally {
      setCargando(false);
    }
  };

  const renderPasoProductos = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos del Pedido</h3>
        
        {/* Buscador de productos */}
        <div className="relative mb-4">
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => {
              setTerminoBusqueda(e.target.value);
              buscarProductos(e.target.value);
            }}
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Lista de productos disponibles */}
        {productosDisponibles.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
            {productosDisponibles.map((producto) => (
              <div
                key={producto.id}
                onClick={() => agregarProducto(producto)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatearPrecio(producto.precio)}</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Productos seleccionados */}
        {formulario.productos.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Productos Seleccionados</h4>
            {formulario.productos.map((producto) => (
              <div key={producto.producto_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{producto.producto_nombre}</p>
                    <p className="text-sm text-gray-600">Stock disponible: {producto.stock_disponible}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => actualizarCantidad(producto.producto_id, producto.cantidad - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">{producto.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(producto.producto_id, producto.cantidad + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatearPrecio(producto.precio_unitario)}</p>
                      <p className="text-sm text-gray-600">Subtotal: {formatearPrecio(producto.subtotal)}</p>
                    </div>
                    <button
                      onClick={() => eliminarProducto(producto.producto_id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPasoEntrega = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TruckIcon className="w-5 h-5" />
          Información de Entrega
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de entrega
            </label>
            <select
              value={formulario.metodo_entrega}
              onChange={(e) => setFormulario({...formulario, metodo_entrega: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="retiro_tienda">Retiro en Tienda</option>
              <option value="despacho_domicilio">Domicilio</option>
            </select>
          </div>

          {formulario.metodo_entrega !== 'retiro_tienda' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de entrega
              </label>
              <textarea
                value={formulario.direccion_entrega}
                onChange={(e) => setFormulario({...formulario, direccion_entrega: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese la dirección completa..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de pago
            </label>
            <select
              value={formulario.metodo_pago}
              onChange={(e) => setFormulario({...formulario, metodo_pago: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="mercadopago">MercadoPago</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones (opcional)
            </label>
            <textarea
              value={formulario.observaciones}
              onChange={(e) => setFormulario({...formulario, observaciones: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instrucciones especiales para el pedido..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasoResumen = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
        
        {/* Productos */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-900">Productos</h4>
          {formulario.productos.map((producto) => (
            <div key={producto.producto_id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{producto.producto_nombre}</p>
                <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatearPrecio(producto.subtotal)}</p>
            </div>
          ))}
        </div>

        {/* Información de entrega */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Información de Entrega</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Método:</span> {
              formulario.metodo_entrega === 'retiro_tienda' ? 'Retiro en Tienda' :
              formulario.metodo_entrega === 'despacho_domicilio' ? 'Domicilio' :
              formulario.metodo_entrega
            }</p>
            {formulario.direccion_entrega && (
              <p><span className="font-medium">Dirección:</span> {formulario.direccion_entrega}</p>
            )}
            <p><span className="font-medium">Pago:</span> {formulario.metodo_pago}</p>
            {formulario.observaciones && (
              <p><span className="font-medium">Observaciones:</span> {formulario.observaciones}</p>
            )}
          </div>
        </div>

        {/* Totales */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatearPrecio(calcularSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de envío:</span>
              <span>{formatearPrecio(calcularEnvio())}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-2">
              <span>Total:</span>
              <span>{formatearPrecio(calcularTotal())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {pedido ? 'Editar Pedido' : 'Nuevo Pedido'}
        </h2>
        <button
          onClick={onCancelar}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Pasos */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((numeroPaso) => (
            <div key={numeroPaso} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                paso >= numeroPaso 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {numeroPaso}
              </div>
              {numeroPaso < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  paso > numeroPaso ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="mb-8">
        {paso === 1 && renderPasoProductos()}
        {paso === 2 && renderPasoEntrega()}
        {paso === 3 && renderPasoResumen()}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          onClick={() => setPaso(Math.max(1, paso - 1))}
          disabled={paso === 1}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        <div className="flex gap-2">
          {paso < 3 ? (
            <button
              onClick={() => setPaso(paso + 1)}
              disabled={formulario.productos.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={guardarPedido}
              disabled={cargando}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-4 h-4" />
                  {pedido ? 'Actualizar Pedido' : 'Crear Pedido'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormularioPedido;
