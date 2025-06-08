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
import PaginaPrincipal from './paginas/PaginaPrincipal';
import PaginaTablero from './paginas/PaginaTablero';
import PanelCliente from './paginas/PanelCliente';

// Autenticación
import IniciarSesion from './componentes/autenticacion/IniciarSesion';
import Registrarse from './componentes/autenticacion/Registrarse';

// Hook personalizado para verificar autenticación
import { useAuth } from './contexto/ContextoAuth';

import TestBackend from './componentes/TestBackend';

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

// Componente principal de la aplicación
const ContenidoPrincipal = () => {
  const { usuario } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={
            <div>
              <Encabezado />
              <PaginaPrincipal />
              <PiePagina />
            </div>
          } />
          
          <Route path="/iniciar-sesion" element={
            usuario ? <Navigate to="/tablero" /> : <IniciarSesion />
          } />
          
          <Route path="/registrarse" element={
            usuario ? <Navigate to="/tablero" /> : <Registrarse />
          } />

          {/* Panel de Cliente */}
          <Route path="/mi-cuenta" element={
            <RutaProtegida>
              <div>
                <Encabezado />
                <PanelCliente />
                <PiePagina />
              </div>
            </RutaProtegida>
          } />

          {/* Rutas administrativas protegidas */}
          <Route path="/tablero" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaTablero />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/clientes" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Clientes" 
                  icono="👥" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/proveedores" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Proveedores" 
                  icono="🏭" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/productos" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Productos" 
                  icono="🔧" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/inventario" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Control de Inventario" 
                  icono="📦" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/pedidos" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Pedidos" 
                  icono="📋" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/facturas" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Facturación" 
                  icono="🧾" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/pagos" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Gestión de Pagos" 
                  icono="💳" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/descuentos" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Descuentos y Promociones" 
                  icono="🏷️" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/reportes" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Reportes y Análisis" 
                  icono="📊" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/integraciones" element={
            <RutaProtegida>
              <LayoutAdmin>
                <PaginaEnDesarrollo 
                  titulo="Integraciones y APIs" 
                  icono="🔗" 
                />
              </LayoutAdmin>
            </RutaProtegida>
          } />

          <Route path="/test-backend" element={
            <div>
              <Encabezado />
              <div className="container mx-auto px-4 py-8">
                <TestBackend />
              </div>
              <PiePagina />
            </div>
          } />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
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