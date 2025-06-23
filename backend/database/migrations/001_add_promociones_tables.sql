-- ==========================================
-- MIGRACIONES PARA PROMOCIONES Y DESCUENTOS
-- ==========================================

USE ferremasnueva;

-- Tabla de promociones
CREATE TABLE IF NOT EXISTS promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo ENUM('porcentaje', 'monto_fijo', 'envio_gratis') NOT NULL,
    valor DECIMAL(10,2) NOT NULL DEFAULT 0,
    monto_minimo DECIMAL(10,2) DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activa', 'inactiva', 'programada', 'finalizada') DEFAULT 'activa',
    aplicable_a ENUM('todos', 'productos', 'categorias') DEFAULT 'todos',
    usos_totales INT DEFAULT 0,
    usos_limite INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_tipo (tipo)
);

-- Tabla de cupones (similar a promociones pero más específicos)
CREATE TABLE IF NOT EXISTS cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    tipo ENUM('porcentaje', 'monto_fijo') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    monto_minimo DECIMAL(10,2) DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'usado', 'vencido') DEFAULT 'activo',
    usos_totales INT DEFAULT 0,
    usos_limite INT DEFAULT 1,
    usuario_asignado_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_asignado_id) REFERENCES usuarios(id),
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_usuario (usuario_asignado_id)
);

-- Tabla para productos incluidos en promociones
CREATE TABLE IF NOT EXISTS promociones_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promocion_producto (promocion_id, producto_id)
);

-- Tabla para categorías incluidas en promociones
CREATE TABLE IF NOT EXISTS promociones_categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promocion_id INT NOT NULL,
    categoria_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promocion_categoria (promocion_id, categoria_id)
);

-- Tabla de historial de uso de promociones/cupones
CREATE TABLE IF NOT EXISTS historial_promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promocion_id INT NULL,
    cupon_id INT NULL,
    pedido_id INT NULL,
    usuario_id INT NOT NULL,
    descuento_aplicado DECIMAL(10,2) NOT NULL,
    monto_pedido DECIMAL(10,2) NOT NULL,
    fecha_uso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id),
    FOREIGN KEY (cupon_id) REFERENCES cupones(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_promocion (promocion_id),
    INDEX idx_cupon (cupon_id),
    INDEX idx_pedido (pedido_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_uso)
);

-- Insertar datos de ejemplo para promociones
INSERT INTO promociones (nombre, descripcion, codigo, tipo, valor, monto_minimo, fecha_inicio, fecha_fin, estado, aplicable_a) VALUES
('Descuento Mayorista 15%', 'Descuento especial para compras mayoristas', 'MAYOR15', 'porcentaje', 15.00, 200000.00, '2024-01-01', '2024-12-31', 'activa', 'todos'),
('Herramientas Eléctricas 20%', '20% de descuento en herramientas eléctricas', 'HERR20', 'porcentaje', 20.00, 50000.00, '2024-06-15', '2024-07-15', 'activa', 'categorias'),
('Black Friday 2024', 'Descuentos especiales por Black Friday', 'BLACK30', 'porcentaje', 30.00, 100000.00, '2024-11-29', '2024-12-02', 'programada', 'todos'),
('Envío Gratis Junio', 'Envío gratuito en pedidos sobre $150.000', 'ENVIO0', 'envio_gratis', 0.00, 150000.00, '2024-06-01', '2024-06-30', 'finalizada', 'todos');

-- Insertar datos de ejemplo para cupones
INSERT INTO cupones (codigo, descripcion, tipo, valor, monto_minimo, fecha_inicio, fecha_fin, estado, usos_limite, usuario_asignado_id) VALUES
('CLIENTE123', 'Cupón personalizado para cliente VIP', 'monto_fijo', 10000.00, 50000.00, '2024-06-01', '2024-12-31', 'activo', 5, 3),
('PRIMERA15', '15% de descuento para primera compra', 'porcentaje', 15.00, 30000.00, '2024-06-01', '2024-12-31', 'activo', 100, NULL);

-- Relacionar promoción con categoría (ejemplo: Herramientas Eléctricas)
INSERT INTO promociones_categorias (promocion_id, categoria_id) VALUES
(2, 2); -- Promoción "Herramientas Eléctricas 20%" con categoría "Herramientas Eléctricas"