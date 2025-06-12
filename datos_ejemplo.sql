-- Datos de ejemplo para la tabla roles
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Vendedor', 'Puede realizar ventas y consultar inventario'),
('Cliente', 'Usuario final que realiza compras'),
('Bodeguero', 'Gestiona el almacén y control de inventario');

-- Datos de ejemplo para la tabla usuarios
INSERT INTO usuarios (nombre, email, password, rol_id, activo) VALUES
('Juan Pérez', 'juan@ferremas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1),
('María García', 'maria@ferremas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 1),
('Carlos López', 'carlos@ferremas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 1),
('Roberto Sánchez', 'roberto@ferremas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, 1);

-- Datos de ejemplo para la tabla sucursales
INSERT INTO sucursales (nombre, direccion, telefono, email, activa) VALUES
('Sucursal Central', 'Av. Principal 123, Ciudad', '555-0001', 'central@ferremas.com', 1),
('Sucursal Norte', 'Calle Norte 456, Ciudad', '555-0002', 'norte@ferremas.com', 1),
('Sucursal Sur', 'Av. Sur 789, Ciudad', '555-0003', 'sur@ferremas.com', 1);

-- Datos de ejemplo para la tabla categorias
INSERT INTO categorias (nombre, descripcion, activo) VALUES
('Herramientas Manuales', 'Herramientas de uso manual', 1),
('Herramientas Eléctricas', 'Herramientas que funcionan con electricidad', 1),
('Pinturas', 'Productos de pintura y acabados', 1),
('Plomería', 'Artículos de plomería y fontanería', 1);

-- Datos de ejemplo para la tabla marcas
INSERT INTO marcas (nombre, descripcion, activo) VALUES
('Stanley', 'Herramientas profesionales', 1),
('DeWalt', 'Herramientas eléctricas profesionales', 1),
('Comex', 'Pinturas y acabados', 1),
('Truper', 'Herramientas y accesorios', 1);

-- Datos de ejemplo para la tabla productos
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo) VALUES
('Martillo 16oz', 'Martillo de acero con mango ergonómico', 29.99, 'MART-001', 1, 1, 1),
('Taladro Inalámbrico', 'Taladro 20V con batería incluida', 199.99, 'TAL-001', 2, 2, 1),
('Pintura Interior', 'Pintura látex para interiores 4L', 39.99, 'PINT-001', 3, 3, 1),
('Llave Ajustable', 'Llave ajustable 10"', 19.99, 'LLAV-001', 4, 4, 1);

-- Datos de ejemplo para la tabla inventario
INSERT INTO inventario (producto_id, sucursal_id, stock_actual, stock_minimo, stock_maximo, ubicacion) VALUES
(1, 1, 50, 10, 100, 'A-01-01'),
(2, 1, 20, 5, 50, 'B-02-01'),
(3, 1, 30, 8, 60, 'C-03-01'),
(4, 1, 40, 10, 80, 'D-04-01');

-- Datos de ejemplo para la tabla divisas
INSERT INTO divisas (codigo, nombre, simbolo, activo) VALUES
('MXN', 'Peso Mexicano', '$', 1),
('USD', 'Dólar Americano', 'US$', 1),
('EUR', 'Euro', '€', 1);

-- Datos de ejemplo para la tabla historial_precios
INSERT INTO historial_precios (divisa_id, fecha, valor, fuente) VALUES
(1, '2024-03-01', 1.000000, 'Banco de México'),
(2, '2024-03-01', 0.058000, 'Banco de México'),
(3, '2024-03-01', 0.053000, 'Banco de México');

-- Datos de ejemplo para la tabla metodos_pago
INSERT INTO metodos_pago (nombre, descripcion, activo) VALUES
('Efectivo', 'Pago en efectivo', 1),
('Tarjeta de Crédito', 'Pago con tarjeta de crédito', 1),
('Transferencia', 'Transferencia bancaria', 1),
('PayPal', 'Pago a través de PayPal', 1);

-- Datos de ejemplo para la tabla pedidos
INSERT INTO pedidos (numero_pedido, usuario_id, estado, subtotal, total, metodo_entrega, direccion_entrega) VALUES
('PED-001', 4, 'entregado', 49.98, 54.98, 'despacho_domicilio', 'Calle Ejemplo 123, Ciudad'),
('PED-002', 4, 'pendiente', 199.99, 219.99, 'retiro_tienda', NULL);

-- Datos de ejemplo para la tabla detalle_pedidos
INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 29.99, 29.99),
(1, 4, 1, 19.99, 19.99),
(2, 2, 1, 199.99, 199.99);

-- Datos de ejemplo para la tabla pagos
INSERT INTO pagos (pedido_id, metodo_pago_id, monto, estado, referencia_externa, fecha_pago) VALUES
(1, 2, 54.98, 'aprobado', 'TXN-001', '2024-03-01 10:00:00'),
(2, 1, 219.99, 'pendiente', NULL, NULL); 



--agregar las imagenes a la tabla productos

UPDATE productos SET imagen = 'taladro_electrico_dewalt_20v.jpg' WHERE id = 1;
UPDATE productos SET imagen = 'sierra_circular_bosch_725.jpg' WHERE id = 2;
UPDATE productos SET imagen = 'lijadora_orbital_makita.jpg' WHERE id = 3;
UPDATE productos SET imagen = 'taladro_percutor_black_decker.jpg' WHERE id = 4;
UPDATE productos SET imagen = 'martillo_stanley_16oz.jpg' WHERE id = 5;
UPDATE productos SET imagen = 'set_destornilladores_dewalt.jpg' WHERE id = 6;
UPDATE productos SET imagen = 'llave_inglesa_ajustable_12.jpg' WHERE id = 7;