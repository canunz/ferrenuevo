-- Script para agregar la columna stock a la tabla productos
-- Ejecutar este script primero si la columna stock no existe

ALTER TABLE productos ADD COLUMN stock INT DEFAULT 0 AFTER precio;

-- Verificar que la columna se agregó correctamente
DESCRIBE productos; 