// ==========================================
// FRONTEND/SRC/COMPONENTES/TESTBACKEND.JSX - COMPLETO
// ==========================================
import React, { useState } from 'react';
import { productosAPI, sistemaAPI } from '../servicios/api';

const TestBackend = () => {
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);

  const probarTodo = async () => {
    setCargando(true);
    setResultados(null);

    const tests = {
      servidor: null,
      productos: null,
      marcas: null,
      categorias: null,
    };

    try {
      console.log('🧪 INICIANDO TESTS COMPLETOS...');

      // Test 1: Servidor
      console.log('1. Probando servidor...');
      try {
        const servidor = await sistemaAPI.healthCheck();
        tests.servidor = { success: true, data: servidor };
        console.log('✅ Servidor OK');
      } catch (error) {
        tests.servidor = { success: false, error: error.message };
        console.log('❌ Servidor FAIL:', error.message);
      }

      // Test 2: Productos
      console.log('2. Probando productos...');
      try {
        const productos = await productosAPI.obtenerTodos();
        tests.productos = { 
          success: true, 
          total: productos.data?.length || 0,
          datos: productos.data?.slice(0, 3) // Solo los primeros 3 para mostrar
        };
        console.log('✅ Productos OK:', productos.data?.length);
      } catch (error) {
        tests.productos = { success: false, error: error.message };
        console.log('❌ Productos FAIL:', error.message);
      }

      // Test 3: Marcas
      console.log('3. Probando marcas...');
      try {
        const marcas = await productosAPI.obtenerMarcas();
        tests.marcas = { 
          success: true, 
          total: marcas.data?.length || 0,
          datos: marcas.data
        };
        console.log('✅ Marcas OK:', marcas.data?.length);
      } catch (error) {
        tests.marcas = { success: false, error: error.message };
        console.log('❌ Marcas FAIL:', error.message);
      }

      // Test 4: Categorías
      console.log('4. Probando categorías...');
      try {
        const categorias = await productosAPI.obtenerCategorias();
        tests.categorias = { 
          success: true, 
          total: categorias.data?.length || 0,
          datos: categorias.data
        };
        console.log('✅ Categorías OK:', categorias.data?.length);
      } catch (error) {
        tests.categorias = { success: false, error: error.message };
        console.log('❌ Categorías FAIL:', error.message);
      }

      setResultados(tests);
      console.log('🎯 TESTS COMPLETADOS:', tests);

    } catch (error) {
      console.error('💥 Error general:', error);
      setResultados({ error: error.message });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto my-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🔥 Test de Conexión Completo
        </h2>
        <p className="text-gray-600">
          Verifica que todos los endpoints de la API estén funcionando correctamente
        </p>
      </div>
      
      <div className="text-center mb-8">
        <button
          onClick={probarTodo}
          disabled={cargando}
          className={`px-8 py-4 rounded-lg text-white font-bold text-lg transition-colors ${
            cargando 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {cargando ? '🔄 Ejecutando Tests...' : '🚀 EJECUTAR TODOS LOS TESTS'}
        </button>
      </div>

      {resultados && (
        <div className="space-y-6">
          {resultados.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-bold text-xl mb-2">💥 Error General:</h3>
              <p className="text-red-600">{resultados.error}</p>
            </div>
          ) : (
            <>
              {/* Resumen */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-blue-800 font-bold text-xl mb-4">📊 Resumen de Tests</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${resultados.servidor?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {resultados.servidor?.success ? '✅' : '❌'}
                    </div>
                    <div className="font-semibold">Servidor</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${resultados.productos?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {resultados.productos?.success ? '✅' : '❌'}
                    </div>
                    <div className="font-semibold">Productos</div>
                    {resultados.productos?.success && (
                      <div className="text-sm text-gray-600">{resultados.productos.total} items</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${resultados.marcas?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {resultados.marcas?.success ? '✅' : '❌'}
                    </div>
                    <div className="font-semibold">Marcas</div>
                    {resultados.marcas?.success && (
                      <div className="text-sm text-gray-600">{resultados.marcas.total} items</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${resultados.categorias?.success ? 'text-green-600' : 'text-red-600'}`}>
                      {resultados.categorias?.success ? '✅' : '❌'}
                    </div>
                    <div className="font-semibold">Categorías</div>
                    {resultados.categorias?.success && (
                      <div className="text-sm text-gray-600">{resultados.categorias.total} items</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalles de Productos */}
              {resultados.productos?.success && resultados.productos.datos && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-green-800 font-bold text-xl mb-4">
                    ✅ Productos Encontrados ({resultados.productos.total})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resultados.productos.datos.map(producto => (
                      <div key={producto.id} className="bg-white border rounded-lg p-4">
                        <h4 className="font-bold text-sm mb-1">{producto.nombre}</h4>
                        <p className="text-xs text-gray-600 mb-2">{producto.marca_nombre}</p>
                        <p className="text-lg font-bold text-red-600">
                          ${new Intl.NumberFormat('es-CL').format(producto.precio)}
                        </p>
                        <p className="text-xs text-blue-600">{producto.categoria_nombre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detalles de Marcas */}
              {resultados.marcas?.success && resultados.marcas.datos && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-purple-800 font-bold text-xl mb-4">
                    ✅ Marcas Encontradas ({resultados.marcas.total})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {resultados.marcas.datos.map(marca => (
                      <div key={marca.id} className="bg-white border rounded-lg p-3 text-center">
                        <h4 className="font-bold text-sm">{marca.nombre}</h4>
                        <p className="text-xs text-gray-600">{marca.total_productos} productos</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detalles de Categorías */}
              {resultados.categorias?.success && resultados.categorias.datos && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-yellow-800 font-bold text-xl mb-4">
                    ✅ Categorías Encontradas ({resultados.categorias.total})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resultados.categorias.datos.map(categoria => (
                      <div key={categoria.id} className="bg-white border rounded-lg p-3">
                        <h4 className="font-bold text-sm">{categoria.nombre}</h4>
                        <p className="text-xs text-gray-600 mb-1">{categoria.descripcion}</p>
                        <p className="text-xs text-blue-600">{categoria.total_productos} productos</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errores */}
              {Object.entries(resultados).some(([key, value]) => !value?.success) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-red-800 font-bold text-xl mb-4">❌ Errores Encontrados</h3>
                  <div className="space-y-2">
                    {Object.entries(resultados).map(([key, value]) => (
                      !value?.success && (
                        <div key={key} className="bg-white border border-red-300 rounded p-3">
                          <div className="font-semibold text-red-700 capitalize">{key}:</div>
                          <div className="text-red-600 text-sm">{value?.error}</div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TestBackend;