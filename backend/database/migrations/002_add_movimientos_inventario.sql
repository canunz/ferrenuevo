-- ==========================================
-- MIGRACIONES PARA MOVIMIENTOS DE INVENTARIO
-- ==========================================

USE ferremasnueva;

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT NOT NULL,
    tipo ENUM('entrada', 'salida', 'ajuste') NOT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    observaciones TEXT,
    usuario_id INT NOT NULL,
    pedido_id INT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    INDEX idx_inventario (inventario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (fecha),
    INDEX idx_usuario (usuario_id)
);

-- Crear tabla alertas_stock si no existe
CREATE TABLE IF NOT EXISTS alertas_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    FOREIGN KEY (inventario_id) REFERENCES inventario(id)
);

-- Eliminar índices existentes (si existen)
ALTER TABLE inventario 
DROP INDEX idx_stock_bajo,
DROP INDEX idx_ultima_actualizacion;

-- Agregar índices
ALTER TABLE inventario 
ADD INDEX idx_stock_bajo (stock_actual, stock_minimo),
ADD INDEX idx_ultima_actualizacion (updated_at);

-- Eliminar el trigger si existe
DROP TRIGGER IF EXISTS trigger_alerta_stock_bajo;

-- Crear el trigger
DELIMITER //
CREATE TRIGGER trigger_alerta_stock_bajo
AFTER UPDATE ON inventario
FOR EACH ROW
BEGIN
    -- Solo crear alerta si el stock está bajo el mínimo
    IF NEW.stock_actual <= NEW.stock_minimo THEN
        INSERT INTO alertas_stock (inventario_id, tipo, mensaje)
        VALUES (
            NEW.id,
            'stock_bajo',
            CONCAT('Stock bajo: Producto ID ', NEW.producto_id, ' - Stock actual: ', NEW.stock_actual)
        );
    END IF;
END //
DELIMITER ;

-- Tabla de proveedores (mejorada)
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rut VARCHAR(12) UNIQUE,
    email VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    contacto_nombre VARCHAR(100),
    contacto_telefono VARCHAR(20),
    contacto_email VARCHAR(255),
    activo TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rut (rut),
    INDEX idx_activo (activo)
);

-- Verificar y agregar columnas faltantes a productos
SET @dbname = DATABASE();
SET @tablename = "productos";
SET @columnname = "codigo_barras";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD COLUMN codigo_barras VARCHAR(100) NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = "peso";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD COLUMN peso DECIMAL(8,3) NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = "dimensiones";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD COLUMN dimensiones VARCHAR(100) NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = "proveedor_id";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD COLUMN proveedor_id INT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @columnname = "precio_costo";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD COLUMN precio_costo DECIMAL(10,2) NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar la clave foránea si no existe
SET @constraintname = "fk_productos_proveedor";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND CONSTRAINT_NAME = @constraintname
  ) > 0,
  "SELECT 1",
  "ALTER TABLE productos ADD CONSTRAINT fk_productos_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;