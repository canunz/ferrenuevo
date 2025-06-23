-- Tabla de reglas de descuento
CREATE TABLE IF NOT EXISTS reglas_descuento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('porcentaje', 'monto_fijo') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_activa (activa)
);

-- Tabla de promociones
CREATE TABLE IF NOT EXISTS promociones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('descuento', 'combo', 'regalo') NOT NULL,
    regla_descuento_id INT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (regla_descuento_id) REFERENCES reglas_descuento(id),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_activa (activa)
);

-- Tabla de productos en promoción
CREATE TABLE IF NOT EXISTS promociones_productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promocion_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_minima INT DEFAULT 1,
    cantidad_maxima INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_promocion (promocion_id),
    INDEX idx_producto (producto_id)
);

-- Tabla de categorías en promoción
CREATE TABLE IF NOT EXISTS promociones_categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promocion_id INT NOT NULL,
    categoria_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_promocion (promocion_id),
    INDEX idx_categoria (categoria_id)
);

-- Tabla de historial de aplicaciones de promociones
CREATE TABLE IF NOT EXISTS historial_promociones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    promocion_id INT NOT NULL,
    venta_id INT NOT NULL,
    monto_descuento DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (promocion_id) REFERENCES promociones(id),
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    INDEX idx_promocion (promocion_id),
    INDEX idx_venta (venta_id)
); 