const { Pedido, DetallePedido, Producto, Usuario } = require('./src/models');
const { sequelize } = require('./src/models');

const crearPedidosReales = async () => {
  try {
    console.log('🚀 Iniciando creación de pedidos reales...');

    // Verificar que existan productos y usuarios
    const productos = await Producto.findAll({ where: { activo: true }, limit: 10 });
    const usuarios = await Usuario.findAll({ limit: 5 });

    if (productos.length === 0) {
      console.log('❌ No hay productos disponibles. Creando productos de ejemplo...');
      // Crear productos de ejemplo si no existen
      const productosEjemplo = [
        {
          nombre: 'Taladro Eléctrico DeWalt 20V',
          descripcion: 'Taladro inalámbrico profesional con batería de 20V',
          precio: 125000,
          stock: 25,
          categoria_id: 1,
          marca_id: 1,
          activo: true,
          imagen: '/assets/imagenes/productos/taladro_electrico_dewalt_20v.jpg'
        },
        {
          nombre: 'Sierra Circular Bosch 725',
          descripcion: 'Sierra circular profesional de 725W',
          precio: 200000,
          stock: 15,
          categoria_id: 1,
          marca_id: 2,
          activo: true,
          imagen: '/assets/imagenes/productos/sierra_circular_bosch_725.jpg'
        },
        {
          nombre: 'Martillo Stanley 16oz',
          descripcion: 'Martillo de carpintero profesional',
          precio: 45000,
          stock: 50,
          categoria_id: 2,
          marca_id: 5,
          activo: true,
          imagen: '/assets/imagenes/productos/martillo_stanley_16oz.jpg'
        },
        {
          nombre: 'Set Destornilladores DeWalt',
          descripcion: 'Set completo de destornilladores profesionales',
          precio: 85000,
          stock: 30,
          categoria_id: 2,
          marca_id: 1,
          activo: true,
          imagen: '/assets/imagenes/productos/set_destornilladores_dewalt.jpg'
        },
        {
          nombre: 'Lijadora Orbital Makita',
          descripcion: 'Lijadora orbital de 5 pulgadas',
          precio: 120000,
          stock: 12,
          categoria_id: 1,
          marca_id: 4,
          activo: true,
          imagen: '/assets/imagenes/productos/lijadora_orbital_makita.jpg'
        }
      ];

      for (const productoData of productosEjemplo) {
        await Producto.create(productoData);
      }
      console.log('✅ Productos de ejemplo creados');
    }

    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios disponibles. Creando usuarios de ejemplo...');
      // Crear usuarios de ejemplo si no existen
      const usuariosEjemplo = [
        {
          nombre: 'Juan Pérez',
          email: 'juan.perez@email.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
          telefono: '+56 9 1234 5678',
          rut: '12.345.678-9',
          rol: 'cliente',
          activo: true
        },
        {
          nombre: 'María González',
          email: 'maria.gonzalez@email.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          telefono: '+56 9 8765 4321',
          rut: '98.765.432-1',
          rol: 'cliente',
          activo: true
        },
        {
          nombre: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
          telefono: '+56 9 5555 1234',
          rut: '55.555.555-5',
          rol: 'cliente',
          activo: true
        }
      ];

      for (const usuarioData of usuariosEjemplo) {
        await Usuario.create(usuarioData);
      }
      console.log('✅ Usuarios de ejemplo creados');
    }

    // Obtener productos y usuarios actualizados
    const productosActualizados = await Producto.findAll({ where: { activo: true }, limit: 10 });
    const usuariosActualizados = await Usuario.findAll({ limit: 5 });

    console.log(`📦 Productos disponibles: ${productosActualizados.length}`);
    console.log(`👥 Usuarios disponibles: ${usuariosActualizados.length}`);

    // Crear pedidos reales
    const pedidosData = [
      {
        numero_pedido: 'PED-2024-001',
        usuario_id: usuariosActualizados[0].id,
        estado: 'entregado',
        subtotal: 250000,
        total: 253990,
        metodo_entrega: 'despacho_domicilio',
        direccion_entrega: 'Av. Providencia 1234, Providencia, Santiago',
        observaciones: 'Entregar en horario de oficina',
        productos: [
          { producto_id: productosActualizados[0].id, cantidad: 2, precio_unitario: 125000 },
        ]
      },
      {
        numero_pedido: 'PED-2024-002',
        usuario_id: usuariosActualizados[1].id,
        estado: 'enviado',
        subtotal: 220000,
        total: 220000,
        metodo_entrega: 'retiro_tienda',
        direccion_entrega: null,
        observaciones: null,
        productos: [
          { producto_id: productosActualizados[2].id, cantidad: 3, precio_unitario: 45000 },
          { producto_id: productosActualizados[3].id, cantidad: 1, precio_unitario: 85000 },
        ]
      },
      {
        numero_pedido: 'PED-2024-003',
        usuario_id: usuariosActualizados[2].id,
        estado: 'preparando',
        subtotal: 150000,
        total: 155990,
        metodo_entrega: 'despacho_domicilio',
        direccion_entrega: 'Calle Las Condes 890, Las Condes, Santiago',
        observaciones: 'Productos para proyecto de construcción',
        productos: [
          { producto_id: productosActualizados[4].id, cantidad: 1, precio_unitario: 120000 },
          { producto_id: productosActualizados[2].id, cantidad: 2, precio_unitario: 45000 },
        ]
      },
      {
        numero_pedido: 'PED-2024-004',
        usuario_id: usuariosActualizados[0].id,
        estado: 'pendiente',
        subtotal: 85000,
        total: 90990,
        metodo_entrega: 'despacho_domicilio',
        direccion_entrega: 'Av. Apoquindo 4567, Las Condes, Santiago',
        observaciones: 'Entregar antes del mediodía',
        productos: [
          { producto_id: productosActualizados[3].id, cantidad: 1, precio_unitario: 85000 },
        ]
      },
      {
        numero_pedido: 'PED-2024-005',
        usuario_id: usuariosActualizados[1].id,
        estado: 'aprobado',
        subtotal: 300000,
        total: 300000,
        metodo_entrega: 'retiro_tienda',
        direccion_entrega: null,
        observaciones: null,
        productos: [
          { producto_id: productosActualizados[1].id, cantidad: 1, precio_unitario: 200000 },
          { producto_id: productosActualizados[3].id, cantidad: 1, precio_unitario: 85000 },
          { producto_id: productosActualizados[2].id, cantidad: 1, precio_unitario: 45000 },
        ]
      }
    ];

    console.log('📝 Creando pedidos...');

    for (const pedidoData of pedidosData) {
      // Crear el pedido
      const pedido = await Pedido.create({
        numero_pedido: pedidoData.numero_pedido,
        usuario_id: pedidoData.usuario_id,
        estado: pedidoData.estado,
        subtotal: pedidoData.subtotal,
        total: pedidoData.total,
        metodo_entrega: pedidoData.metodo_entrega,
        direccion_entrega: pedidoData.direccion_entrega,
        observaciones: pedidoData.observaciones,
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Últimos 7 días
        updated_at: new Date()
      });

      console.log(`✅ Pedido creado: ${pedido.numero_pedido}`);

      // Crear los detalles del pedido
      for (const productoData of pedidoData.productos) {
        const subtotal = productoData.cantidad * productoData.precio_unitario;
        
        await DetallePedido.create({
          pedido_id: pedido.id,
          producto_id: productoData.producto_id,
          cantidad: productoData.cantidad,
          precio_unitario: productoData.precio_unitario,
          subtotal: subtotal,
          created_at: new Date(),
          updated_at: new Date()
        });
      }

      console.log(`📦 Detalles creados para: ${pedido.numero_pedido}`);
    }

    console.log('🎉 ¡Pedidos reales creados exitosamente!');
    console.log(`📊 Total de pedidos creados: ${pedidosData.length}`);

    // Mostrar estadísticas
    const totalPedidos = await Pedido.count();
    const pedidosPendientes = await Pedido.count({ where: { estado: 'pendiente' } });
    const pedidosEntregados = await Pedido.count({ where: { estado: 'entregado' } });

    console.log('\n📈 Estadísticas:');
    console.log(`- Total de pedidos: ${totalPedidos}`);
    console.log(`- Pedidos pendientes: ${pedidosPendientes}`);
    console.log(`- Pedidos entregados: ${pedidosEntregados}`);

  } catch (error) {
    console.error('❌ Error al crear pedidos:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada');
  }
};

// Ejecutar el script
crearPedidosReales(); 