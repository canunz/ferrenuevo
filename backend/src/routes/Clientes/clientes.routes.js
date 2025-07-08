// ============================================
// Rutas de diagnóstico temporal
// Agregar al final de routes/clientes.routes.js
// ============================================

console.log('*** CARGANDO ESTE ARCHIVO DE RUTAS DE CLIENTES (mayusculas) ***');

// RUTA DE DIAGNÓSTICO - TEMPORAL PARA DEBUG
router.get('/diagnostico',
    verificarToken,
    verificarRol(['administrador']),
    clientesController.diagnosticarConexiones
  );
  
  // RUTA SIMPLE PARA PROBAR CONECTIVIDAD BÁSICA
  router.get('/test',
    verificarToken,
    async (req, res) => {
      try {
        console.log('🧪 Ejecutando test básico...');
        
        // Test 1: Conexión a BD
        await sequelize.authenticate();
        console.log('✅ Conexión a BD: OK');
        
        // Test 2: Contar usuarios
        const totalUsuarios = await Usuario.count();
        console.log(`✅ Total usuarios: ${totalUsuarios}`);
        
        // Test 3: Obtener primer usuario
        const primerUsuario = await Usuario.findOne({
          attributes: ['id', 'nombre', 'email'],
          limit: 1
        });
        console.log('✅ Primer usuario obtenido');
        
        // Test 4: Verificar rol cliente
        const rolCliente = await Rol.findOne({ where: { nombre: 'cliente' } });
        console.log(`✅ Rol cliente: ${rolCliente ? 'Encontrado (ID: ' + rolCliente.id + ')' : 'No encontrado'}`);
        
        res.json({
          success: true,
          message: 'Test completado exitosamente',
          data: {
            conexion_bd: 'OK',
            total_usuarios: totalUsuarios,
            primer_usuario: primerUsuario,
            rol_cliente: rolCliente ? { id: rolCliente.id, nombre: rolCliente.nombre } : null
          },
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ Error en test:', error);
        res.status(500).json({
          success: false,
          error: 'Error en test básico',
          details: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  );