// ==========================================
// ARCHIVO: frontend/src/App.jsx
// ==========================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TemaProvider } from './contexto/ContextoTema';
import { AuthProvider } from './contexto/ContextoAuth';
import { CarritoProvider } from './contexto/ContextoCarrito';
import { NotificacionProvider } from './contexto/ContextoNotificacion';

// Componentes de Layout
import Encabezado from './componentes/comun/Encabezado';
import EncabezadoAdmin from './componentes/comun/EncabezadoAdmin';
import BarraLateral from './componentes/comun/BarraLateral';
import PiePagina from './componentes/comun/PiePagina';


// Páginas principales
import PaginaInicio from './paginas/PaginaInicio';  // NUEVA - Landing Page
import PaginaPrincipal from './paginas/PaginaPrincipal';  // Catálogo/Ofertas
import PaginaTablero from './paginas/PaginaTablero';
import PanelCliente from './paginas/PanelCliente';
import Herramientas from './paginas/Herramientas';
import Construccion from './paginas/Construccion';
import Seguridad from './paginas/Seguridad';
import Contacto from './paginas/Contacto';
import Ofertas from './paginas/Ofertas';
import PaginaClientes from './paginas/PaginaClientes';

// Autenticación
import IniciarSesion from './componentes/autenticacion/IniciarSesion';
import Registrarse from './componentes/autenticacion/Registrarse';

// Hook personalizado para verificar autenticación
import { useAuth } from './contexto/ContextoAuth';

import TestBackend from './componentes/TestBackend';
import DetalleProducto from './componentes/productos/DetalleProducto';
import DetalleCliente from './componentes/clientes/DetalleCliente';
import FormularioCliente from './componentes/clientes/FormularioCliente';

// Wrapper para cargar el producto por ID y pasarlo a DetalleProducto
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { servicioProductos } from './servicios/servicioProductos';

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  const { usuario, cargando } = useAuth();
  
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  return usuario ? children : <Navigate to="/iniciar-sesion" />;
};

// Layout para páginas públicas
const LayoutPublico = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Encabezado />
      <main className="flex-1">
        {children}
      </main>
      <PiePagina />
    </div>
  );
};

// Layout para páginas administrativas
const LayoutAdmin = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <BarraLateral />
      <div className="flex-1 flex flex-col overflow-hidden">
        <EncabezadoAdmin />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Componente para páginas en desarrollo
const PaginaEnDesarrollo = ({ titulo, icono }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">{icono}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{titulo}</h2>
        <p className="text-gray-600 mb-6">Este módulo está en desarrollo</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            Próximamente tendrás acceso a todas las funcionalidades de este módulo.
          </p>
        </div>
      </div>
    </div>
  );
};

// Wrapper para cargar el producto por ID y pasarlo a DetalleProducto
const DetalleProductoWrapper = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const res = await servicioProductos.obtenerPorId(id);
        setProducto(res.data);
      } catch (e) {
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);
  
  if (cargando) return <div className="p-8 text-center">Cargando...</div>;
  return <DetalleProducto producto={producto} />;
};

// Componente principal de la aplicación
const ContenidoPrincipal = () => {
  const { usuario } = useAuth();

  return (
    <Router>
      <Routes>
        {/* PÁGINA DE INICIO - LANDING PAGE */}
        <Route 
          path="/" 
          element={
            <LayoutPublico>
              <PaginaInicio />
            </LayoutPublico>
          } 
        />

        {/* CATÁLOGO/OFERTAS - Tu página actual */}
        <Route 
          path="/catalogo" 
          element={
            <LayoutPublico>
              <PaginaPrincipal />
            </LayoutPublico>
          } 
        />

        {/* OFERTAS - Página independiente */}
        <Route 
          path="/ofertas" 
          element={
            <LayoutPublico>
              <Ofertas />
            </LayoutPublico>
          } 
        />

        {/* Rutas de autenticación */}
        <Route 
          path="/iniciar-sesion" 
          element={
            usuario ? <Navigate to="/tablero" /> : <IniciarSesion />
          } 
        />
        
        <Route 
          path="/registrarse" 
          element={
            usuario ? <Navigate to="/tablero" /> : <Registrarse />
          } 
        />

        {/* Panel de Cliente */}
        <Route 
          path="/mi-cuenta" 
          element={
            <RutaProtegida>
              <LayoutPublico>
                <PanelCliente />
              </LayoutPublico>
            </RutaProtegida>
          } 
        />

        {/* Detalle de Producto */}
        <Route 
          path="/producto/:id" 
          element={
            <LayoutPublico>
              <DetalleProductoWrapper />
            </LayoutPublico>
          } 
        />

        {/* Test Backend */}
        <Route 
          path="/test-backend" 
          element={
            <LayoutPublico>
              <div className="container mx-auto px-4 py-8">
                <TestBackend />
              </div>
            </LayoutPublico>
          } 
        />

        {/* RUTAS ADMINISTRATIVAS */}
        <Route 
          path="/tablero" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaTablero />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/clientes" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaClientes />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/clientes/:id" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <DetalleCliente />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/clientes/nuevo" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <FormularioCliente />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/clientes/editar/:id" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <FormularioCliente modoEdicion={true} />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/proveedores" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Proveedores" 
                  icono="🏭" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/productos" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Productos" 
                  icono="🔧" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/inventario" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Control de Inventario" 
                  icono="📦" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/pedidos" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Pedidos" 
                  icono="📋" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/facturas" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Facturación" 
                  icono="🧾" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/pagos" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Pagos" 
                  icono="💳" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/descuentos" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Descuentos y Promociones" 
                  icono="🏷️" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/reportes" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Reportes y Análisis" 
                  icono="📊" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        <Route 
          path="/integraciones" 
          element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Integraciones y APIs" 
                  icono="🔗" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } 
        />

        {/* PÁGINAS SECUNDARIAS */}
        <Route 
          path="/herramientas" 
          element={
            <LayoutPublico>
              <Herramientas />
            </LayoutPublico>
          } 
        />
        <Route 
          path="/construccion" 
          element={
            <LayoutPublico>
              <Construccion />
            </LayoutPublico>
          } 
        />
        <Route 
          path="/seguridad" 
          element={
            <LayoutPublico>
              <Seguridad />
            </LayoutPublico>
          } 
        />
        <Route 
          path="/contacto" 
          element={
            <LayoutPublico>
              <Contacto />
            </LayoutPublico>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

// Componente principal de la aplicación
const App = () => {
  return (
    <TemaProvider>
      <AuthProvider>
        <CarritoProvider>
          <NotificacionProvider>
            <ContenidoPrincipal />
          </NotificacionProvider>
        </CarritoProvider>
      </AuthProvider>
    </TemaProvider>
  );
};

export default App;