// ==========================================
// ARCHIVO: frontend/src/componentes/descuentos/GestionDescuentos.jsx
// ==========================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TagIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarDaysIcon,
  PercentBadgeIcon,
  GiftIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

const GestionDescuentos = () => {
  const { exito, error, advertencia } = useNotificacion();
  const [promociones, setPromociones] = useState([]);
  const [cupones, setCupones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('promociones'); // promociones, cupones, reglas
  
  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      setTimeout(() => {
        setPromociones([
          {
            id: 1,
            nombre: 'Descuento Mayorista 15%',
            descripcion: 'Descuento especial para compras mayoristas',
            tipo: 'porcentaje',
            valor: 15,
            monto_minimo: 200000,
            fecha_inicio: '2024-06-01',
            fecha_fin: '2024-12-31',
            estado: 'activa',
            aplicable_a: 'todos',
            productos_incluidos: [],
            categorias_incluidas: [],
            usos_totales: 156,
            usos_limite: null,
            created_at: '2024-06-01',
            codigo: 'MAYOR15'
          },
          {
            id: 2,
            nombre: 'Herramientas Eléctricas 20%',
            descripcion: '20% de descuento en herramientas Bosch y Makita',
            tipo: 'porcentaje',
            valor: 20,
            monto_minimo: 50000,
            fecha_inicio: '2024-06-15',
            fecha_fin: '2024-07-15',
            estado: 'activa',
            aplicable_a: 'categorias',
            productos_incluidos: [],
            categorias_incluidas: [1], // ID de categoría herramientas eléctricas
            usos_totales: 89,
            usos_limite: 500,
            created_at: '2024-06-15',
            codigo: 'HERR20'
          },
          {
            id: 3,
            nombre: 'Black Friday 2024',
            descripcion: 'Descuentos especiales por Black Friday',
            tipo: 'porcentaje',
            valor: 30,
            monto_minimo: 100000,
            fecha_inicio: '2024-11-29',
            fecha_fin: '2024-12-02',
            estado: 'programada',
            aplicable_a: 'todos',
            productos_incluidos: [],
            categorias_incluidas: [],
            usos_totales: 0,
            usos_limite: 1000,
            created_at: '2024-06-10',
            codigo: 'BLACK30'
          },
          {
            id: 4,
            nombre: 'Envío Gratis Junio',
            descripcion: 'Envío gratuito en pedidos sobre $150.000',
            tipo: 'envio_gratis',
            valor: 0,
            monto_minimo: 150000,
            fecha_inicio: '2024-06-01',
            fecha_fin: '2024-06-30',
            estado: 'finalizada',
            aplicable_a: 'todos',
            productos_incluidos: [],
            categorias_incluidas: [],
            usos_totales: 234,
            usos_limite: null,
            created_at: '2024-06-01',
            codigo: 'ENVIO0'
          }
        ]);

        setCupones([
          {
            id: 1,
            codigo: 'CLIENTE123',
            descripcion: 'Cupón personalizado para cliente VIP',
            tipo: 'monto_fijo',
            valor: 10000,
            monto_minimo: 50000,
            fecha_inicio: '2024-06-01',
            fecha_fin: '2024-12-31',
            estado: 'activo',
            usos_totales: 3,
            usos_limite: 5,
            usuario_asignado: 'Juan Pérez',
            created_at: '2024-06-01'
          },
          {
            id: 2,
            codigo: 'PRIMERA15',
            descripcion: '15% de descuento para primera compra',
            tipo: 'porcentaje',
            valor: 15,
            monto_minimo: 30000,
            fecha_inicio: '2024-06-01',
            fecha_fin: '2024-12-31',
            estado: 'activo',
            usos_totales: 45,
            usos_limite: 100,
            usuario_asignado: null,
            created_at: '2024-06-01'
          }
        ]);

        setProductos([
          { id: 1, nombre: 'Taladro Eléctrico DeWalt 20V', categoria: 'Herramientas Eléctricas' },
          { id: 2, nombre: 'Sierra Circular Bosch 7.25"', categoria: 'Herramientas Eléctricas' },
          { id: 3, nombre: 'Martillo Stanley 16oz', categoria: 'Herramientas Manuales' }
        ]);

        setCargando(false);
      }, 1500);
    } catch (err) {
      error('Error al cargar promociones y descuentos');
      setCargando(false);
    }
  };

  // Filtrar promociones
  const promocionesFiltradas = promociones.filter(promo => {
    const cumpleBusqueda = promo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          promo.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleEstado = !filtroEstado || promo.estado === filtroEstado;
    const cumpleTipo = !filtroTipo || promo.tipo === filtroTipo;
    
    return cumpleBusqueda && cumpleEstado && cumpleTipo;
  });

  // Filtrar cupones
  const cuponesFiltrados = cupones.filter(cupon => {
    const cumpleBusqueda = cupon.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          cupon.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleEstado = !filtroEstado || cupon.estado === filtroEstado;
    const cumpleTipo = !filtroTipo || cupon.tipo === filtroTipo;
    
    return cumpleBusqueda && cumpleEstado && cumpleTipo;
  });

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL');
  };

  const obtenerEstadoPromocion = (promo) => {
    const hoy = new Date();
    const inicio = new Date(promo.fecha_inicio);
    const fin = new Date(promo.fecha_fin);

    if (promo.estado === 'inactiva') return 'inactiva';
    if (hoy < inicio) return 'programada';
    if (hoy > fin) return 'finalizada';
    return 'activa';
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'activa':
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'finalizada':
      case 'vencido':
        return 'bg-gray-100 text-gray-800';
      case 'inactiva':
      case 'inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const abrirModal = (item = null, edicion = false) => {
    setPromocionSeleccionada(item);
    setModoEdicion(edicion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPromocionSeleccionada(null);
    setModoEdicion(false);
  };

  const guardarPromocion = (datosPromocion) => {
    if (modoEdicion) {
      if (vistaActiva === 'promociones') {
        setPromociones(prev => prev.map(p => 
          p.id === datosPromocion.id ? { ...p, ...datosPromocion } : p
        ));
      } else {
        setCupones(prev => prev.map(c => 
          c.id === datosPromocion.id ? { ...c, ...datosPromocion } : c
        ));
      }
      exito('Promoción actualizada exitosamente');
    } else {
      const nuevaPromocion = {
        ...datosPromocion,
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0],
        usos_totales: 0
      };
      
      if (vistaActiva === 'promociones') {
        setPromociones(prev => [nuevaPromocion, ...prev]);
      } else {
        setCupones(prev => [nuevaPromocion, ...prev]);
      }
      exito('Promoción creada exitosamente');
    }
    cerrarModal();
  };

  const eliminarPromocion = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      if (vistaActiva === 'promociones') {
        setPromociones(prev => prev.filter(p => p.id !== id));
      } else {
        setCupones(prev => prev.filter(c => c.id !== id));
      }
      exito('Promoción eliminada exitosamente');
    }
  };

  const toggleEstadoPromocion = (id) => {
    if (vistaActiva === 'promociones') {
      setPromociones(prev => prev.map(p => 
        p.id === id ? { 
          ...p, 
          estado: p.estado === 'activa' ? 'inactiva' : 'activa' 
        } : p
      ));
    } else {
      setCupones(prev => prev.map(c => 
        c.id === id ? { 
          ...c, 
          estado: c.estado === 'activo' ? 'inactivo' : 'activo' 
        } : c
      ));
    }
    exito('Estado actualizado exitosamente');
  };

  if (cargando) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Descuentos y Promociones</h1>
          <p className="text-gray-600">Gestiona promociones, cupones y descuentos especiales</p>
        </div>
        <button
          onClick={() => abrirModal(null, false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nueva {vistaActiva === 'promociones' ? 'Promoción' : 'Cupón'}</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{promociones.length}</p>
              <p className="text-gray-600">Total Promociones</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <GiftIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {promociones.filter(p => obtenerEstadoPromocion(p) === 'activa').length}
              </p>
              <p className="text-gray-600">Promociones Activas</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{cupones.length}</p>
              <p className="text-gray-600">Cupones Creados</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <PercentBadgeIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {promociones.reduce((total, p) => total + p.usos_totales, 0)}
              </p>
              <p className="text-gray-600">Usos Totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de vistas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'promociones', nombre: 'Promociones', icono: TagIcon },
              { id: 'cupones', nombre: 'Cupones', icono: GiftIcon },
              { id: 'reglas', nombre: 'Reglas de Descuento', icono: SparklesIcon }
            ].map((tab) => {
              const Icono = tab.icono;
              return (
                <button
                  key={tab.id}
                  onClick={() => setVistaActiva(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    vistaActiva === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icono className="w-5 h-5" />
                  <span>{tab.nombre}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="programada">Programadas</option>
                <option value="finalizada">Finalizadas</option>
                <option value="inactiva">Inactivas</option>
              </select>
            </div>
            <div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="porcentaje">Porcentaje</option>
                <option value="monto_fijo">Monto Fijo</option>
                <option value="envio_gratis">Envío Gratis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenido según vista activa */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {vistaActiva === 'promociones' && (
              <motion.div
                key="promociones"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaPromociones 
                  promociones={promocionesFiltradas}
                  onEditar={(promo) => abrirModal(promo, true)}
                  onVer={(promo) => abrirModal(promo, false)}
                  onEliminar={eliminarPromocion}
                  onToggleEstado={toggleEstadoPromocion}
                  formatearPrecio={formatearPrecio}
                  formatearFecha={formatearFecha}
                  obtenerEstadoPromocion={obtenerEstadoPromocion}
                  obtenerColorEstado={obtenerColorEstado}
                />
              </motion.div>
            )}

            {vistaActiva === 'cupones' && (
              <motion.div
                key="cupones"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaCupones 
                  cupones={cuponesFiltrados}
                  onEditar={(cupon) => abrirModal(cupon, true)}
                  onVer={(cupon) => abrirModal(cupon, false)}
                  onEliminar={eliminarPromocion}
                  onToggleEstado={toggleEstadoPromocion}
                  formatearPrecio={formatearPrecio}
                  formatearFecha={formatearFecha}
                  obtenerColorEstado={obtenerColorEstado}
                />
              </motion.div>
            )}

            {vistaActiva === 'reglas' && (
              <motion.div
                key="reglas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <VistaReglas />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalAbierto && (
          <ModalPromocion
            promocion={promocionSeleccionada}
            modoEdicion={modoEdicion}
            tipo={vistaActiva}
            productos={productos}
            onGuardar={guardarPromocion}
            onCerrar={cerrarModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Vista Promociones
const VistaPromociones = ({ 
  promociones, 
  onEditar, 
  onVer, 
  onEliminar, 
  onToggleEstado, 
  formatearPrecio, 
  formatearFecha, 
  obtenerEstadoPromocion,
  obtenerColorEstado 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {promociones.map((promocion) => {
      const estado = obtenerEstadoPromocion(promocion);
      
      return (
        <motion.div
          key={promocion.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {promocion.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {promocion.descripcion}
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${obtenerColorEstado(estado)}`}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {promocion.tipo === 'porcentaje' ? `${promocion.valor}%` :
                   promocion.tipo === 'monto_fijo' ? formatearPrecio(promocion.valor) :
                   'Gratis'}
                </div>
                <div className="text-xs text-gray-500">
                  Código: {promocion.codigo}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Monto mínimo:</span>
                <span className="font-medium">{formatearPrecio(promocion.monto_minimo)}</span>
              </div>
              <div className="flex justify-between">
                <span>Vigencia:</span>
                <span className="font-medium">
                  {formatearFecha(promocion.fecha_inicio)} - {formatearFecha(promocion.fecha_fin)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Usos:</span>
                <span className="font-medium">
                  {promocion.usos_totales}
                  {promocion.usos_limite && ` / ${promocion.usos_limite}`}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => onVer(promocion)}
                className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-50 transition-colors"
              >
                Ver
              </button>
              <button
                onClick={() => onEditar(promocion)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => onEliminar(promocion.id)}
                className="text-red-600 border border-red-600 px-3 py-2 rounded text-sm hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      );
    })}

    {promociones.length === 0 && (
      <div className="col-span-full text-center py-12">
        <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron promociones</h3>
        <p className="text-gray-500">Crea tu primera promoción para comenzar.</p>
      </div>
    )}
  </div>
);

// Vista Cupones
const VistaCupones = ({ 
  cupones, 
  onEditar, 
  onVer, 
  onEliminar, 
  onToggleEstado, 
  formatearPrecio, 
  formatearFecha,
  obtenerColorEstado 
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Código
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Descripción
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Descuento
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Usos
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {cupones.map((cupon) => (
          <tr key={cupon.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900 font-mono">
                  {cupon.codigo}
                </div>
                {cupon.usuario_asignado && (
                  <div className="text-sm text-gray-500">
                    Para: {cupon.usuario_asignado}
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{cupon.descripcion}</div>
              <div className="text-sm text-gray-500">
                Mín: {formatearPrecio(cupon.monto_minimo)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-blue-600">
                {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : formatearPrecio(cupon.valor)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                {cupon.usos_totales}
                {cupon.usos_limite && ` / ${cupon.usos_limite}`}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => onToggleEstado(cupon.id)}
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                  obtenerColorEstado(cupon.estado)
                } hover:opacity-80`}
              >
                {cupon.estado.charAt(0).toUpperCase() + cupon.estado.slice(1)}
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onVer(cupon)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Ver detalles"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditar(cupon)}
                  className="text-yellow-600 hover:text-yellow-900 p-1"
                  title="Editar"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEliminar(cupon.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Eliminar"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {cupones.length === 0 && (
      <div className="text-center py-12">
        <GiftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cupones</h3>
        <p className="text-gray-500">Crea tu primer cupón para comenzar.</p>
      </div>
    )}
  </div>
);

// Vista Reglas
const VistaReglas = () => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-blue-900 mb-4">Reglas de Descuento Automáticas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Descuento por Volumen</h4>
          <p className="text-sm text-gray-600 mb-3">
            Aplicar descuentos automáticos según la cantidad de productos
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>10+ productos:</span>
              <span className="font-medium text-green-600">5% descuento</span>
            </div>
            <div className="flex justify-between">
              <span>20+ productos:</span>
              <span className="font-medium text-green-600">10% descuento</span>
            </div>
            <div className="flex justify-between">
              <span>50+ productos:</span>
              <span className="font-medium text-green-600">15% descuento</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
            Activar Regla
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Descuento por Monto</h4>
          <p className="text-sm text-gray-600 mb-3">
            Aplicar descuentos según el monto total de la compra
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Sobre $100.000:</span>
              <span className="font-medium text-green-600">3% descuento</span>
            </div>
            <div className="flex justify-between">
              <span>Sobre $300.000:</span>
              <span className="font-medium text-green-600">7% descuento</span>
            </div>
            <div className="flex justify-between">
              <span>Sobre $500.000:</span>
              <span className="font-medium text-green-600">12% descuento</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition-colors">
            Activar Regla
          </button>
        </div>
      </div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-yellow-900 mb-4">Descuentos Especiales por Cliente</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Cliente VIP</h4>
          <p className="text-sm text-gray-600 mb-2">
            Clientes con más de 10 compras
          </p>
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            15% descuento automático
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Cliente Mayorista</h4>
          <p className="text-sm text-gray-600 mb-2">
            Compras sobre $200.000 mensuales
          </p>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            20% descuento automático
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Cliente Nuevo</h4>
          <p className="text-sm text-gray-600 mb-2">
            Primera compra del cliente
          </p>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            10% descuento automático
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Modal Promoción
const ModalPromocion = ({ promocion, modoEdicion, tipo, productos, onGuardar, onCerrar }) => {
    const [formData, setFormData] = useState({
      nombre: promocion?.nombre || '',
      descripcion: promocion?.descripcion || '',
      codigo: promocion?.codigo || '',
      tipo: promocion?.tipo || 'porcentaje',
      valor: promocion?.valor || '',
      monto_minimo: promocion?.monto_minimo || '',
      fecha_inicio: promocion?.fecha_inicio || '',
      fecha_fin: promocion?.fecha_fin || '',
      estado: promocion?.estado || 'activa',
      aplicable_a: promocion?.aplicable_a || 'todos',
      productos_incluidos: promocion?.productos_incluidos || [],
      categorias_incluidas: promocion?.categorias_incluidas || [],
      usos_limite: promocion?.usos_limite || '',
      usuario_asignado: promocion?.usuario_asignado || ''
    });
  
    const [errores, setErrores] = useState({});
  
    const validarFormulario = () => {
      const nuevosErrores = {};
  
      if (!formData.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es requerido';
      }
  
      if (!formData.descripcion.trim()) {
        nuevosErrores.descripcion = 'La descripción es requerida';
      }
  
      if (!formData.codigo.trim()) {
        nuevosErrores.codigo = 'El código es requerido';
      }
  
      if (!formData.valor || formData.valor <= 0) {
        nuevosErrores.valor = 'El valor debe ser mayor a 0';
      }
  
      if (formData.tipo === 'porcentaje' && formData.valor > 100) {
        nuevosErrores.valor = 'El porcentaje no puede ser mayor a 100%';
      }
  
      if (!formData.fecha_inicio) {
        nuevosErrores.fecha_inicio = 'La fecha de inicio es requerida';
      }
  
      if (!formData.fecha_fin) {
        nuevosErrores.fecha_fin = 'La fecha de fin es requerida';
      }
  
      if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio > formData.fecha_fin) {
        nuevosErrores.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
  
      setErrores(nuevosErrores);
      return Object.keys(nuevosErrores).length === 0;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!validarFormulario()) {
        return;
      }
  
      const datosFormateados = {
        ...formData,
        valor: parseFloat(formData.valor),
        monto_minimo: parseFloat(formData.monto_minimo) || 0,
        usos_limite: formData.usos_limite ? parseInt(formData.usos_limite) : null
      };
  
      if (modoEdicion) {
        datosFormateados.id = promocion.id;
      }
  
      onGuardar(datosFormateados);
    };
  
    const generarCodigoAleatorio = () => {
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let codigo = '';
      for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      setFormData(prev => ({ ...prev, codigo }));
    };
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              {modoEdicion ? 'Editar' : 'Crear'} {tipo === 'promociones' ? 'Promoción' : 'Cupón'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errores.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Descuento Black Friday"
                />
                {errores.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono ${
                      errores.codigo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="BLACK25"
                  />
                  <button
                    type="button"
                    onClick={generarCodigoAleatorio}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Generar código aleatorio"
                  >
                    <SparklesIcon className="w-4 h-4" />
                  </button>
                </div>
                {errores.codigo && (
                  <p className="text-red-500 text-xs mt-1">{errores.codigo}</p>
                )}
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errores.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe los detalles de la promoción..."
              />
              {errores.descripcion && (
                <p className="text-red-500 text-xs mt-1">{errores.descripcion}</p>
              )}
            </div>
  
            {/* Configuración del descuento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="porcentaje">Porcentaje</option>
                  <option value="monto_fijo">Monto Fijo</option>
                  {tipo === 'promociones' && (
                    <option value="envio_gratis">Envío Gratis</option>
                  )}
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor del Descuento *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={formData.tipo === 'porcentaje' ? 100 : undefined}
                    step={formData.tipo === 'porcentaje' ? 1 : 100}
                    value={formData.valor}
                    onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errores.valor ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    disabled={formData.tipo === 'envio_gratis'}
                  />
                  {formData.tipo === 'porcentaje' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  )}
                  {formData.tipo === 'monto_fijo' && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  )}
                </div>
                {errores.valor && (
                  <p className="text-red-500 text-xs mt-1">{errores.valor}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.monto_minimo}
                  onChange={(e) => setFormData(prev => ({ ...prev, monto_minimo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
  
            {/* Fechas de vigencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errores.fecha_inicio ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errores.fecha_inicio && (
                  <p className="text-red-500 text-xs mt-1">{errores.fecha_inicio}</p>
                )}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errores.fecha_fin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errores.fecha_fin && (
                  <p className="text-red-500 text-xs mt-1">{errores.fecha_fin}</p>
                )}
              </div>
            </div>
  
            {/* Configuración avanzada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="programada">Programada</option>
                </select>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Límite de Usos
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.usos_limite}
                  onChange={(e) => setFormData(prev => ({ ...prev, usos_limite: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Sin límite"
                />
              </div>
            </div>
  
            {/* Aplicable a */}
            {tipo === 'promociones' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aplicable a
                </label>
                <select
                  value={formData.aplicable_a}
                  onChange={(e) => setFormData(prev => ({ ...prev, aplicable_a: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todos">Todos los productos</option>
                  <option value="productos">Productos específicos</option>
                  <option value="categorias">Categorías específicas</option>
                </select>
              </div>
            )}
  
            {/* Usuario asignado (solo para cupones) */}
            {tipo === 'cupones' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario Asignado
                </label>
                <input
                  type="text"
                  value={formData.usuario_asignado}
                  onChange={(e) => setFormData(prev => ({ ...prev, usuario_asignado: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dejar vacío para uso general"
                />
              </div>
            )}
  
            {/* Productos específicos */}
            {formData.aplicable_a === 'productos' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Productos Incluidos
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {productos.map(producto => (
                    <label key={producto.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.productos_incluidos.includes(producto.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              productos_incluidos: [...prev.productos_incluidos, producto.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              productos_incluidos: prev.productos_incluidos.filter(id => id !== producto.id)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{producto.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
  
            {/* Vista previa del descuento */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Vista Previa</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Código:</strong> {formData.codigo || 'CODIGO'}</p>
                <p><strong>Descuento:</strong> {
                  formData.tipo === 'porcentaje' ? `${formData.valor || 0}%` :
                  formData.tipo === 'monto_fijo' ? `${new Intl.NumberFormat('es-CL').format(formData.valor || 0)}` :
                  'Envío Gratis'
                }</p>
                {formData.monto_minimo && (
                  <p><strong>Compra mínima:</strong> ${new Intl.NumberFormat('es-CL').format(formData.monto_minimo)}</p>
                )}
                <p><strong>Vigencia:</strong> {formData.fecha_inicio || 'Sin fecha'} - {formData.fecha_fin || 'Sin fecha'}</p>
                {formData.usos_limite && (
                  <p><strong>Límite:</strong> {formData.usos_limite} usos</p>
                )}
              </div>
            </div>
  
            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {modoEdicion ? 'Actualizar' : 'Crear'} {tipo === 'promociones' ? 'Promoción' : 'Cupón'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };
  
  export default GestionDescuentos;