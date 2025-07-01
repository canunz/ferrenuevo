-- Script para probar descuentos manuales
-- Primero agregar la columna stock si no existe (sintaxis MySQL correcta)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = DATABASE() 
     AND TABLE_NAME = 'productos' 
     AND COLUMN_NAME = 'stock') = 0,
    'ALTER TABLE productos ADD COLUMN stock INT DEFAULT 0 AFTER precio',
    'SELECT "Columna stock ya existe" as mensaje'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Actualizar algunos productos con descuentos manuales para probar
UPDATE productos SET descuento = 15 WHERE codigo_sku = 'TAL-DEW-20V-001';
UPDATE productos SET descuento = 20 WHERE codigo_sku = 'SIE-BOS-1900W-001';
UPDATE productos SET descuento = 10 WHERE codigo_sku = 'MAR-STA-16OZ-001';
UPDATE productos SET descuento = 25 WHERE codigo_sku = 'CAR-STA-6P-001';
UPDATE productos SET descuento = 30 WHERE codigo_sku = 'COR-STA-CES-001';

-- Verificar los productos con descuentos
SELECT 
    id,
    nombre,
    precio,
    descuento,
    ROUND(precio * (1 - descuento/100)) as precio_con_descuento,
    codigo_sku
FROM productos 
WHERE descuento > 0 
ORDER BY descuento DESC;

-- Mostrar todos los productos con sus descuentos
SELECT 
    p.id,
    p.nombre,
    p.precio,
    p.descuento,
    c.nombre as categoria,
    m.nombre as marca,
    CASE 
        WHEN p.descuento > 0 THEN 'Descuento Manual'
        ELSE 'Sin descuento'
    END as tipo_descuento
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN marcas m ON p.marca_id = m.id
ORDER BY p.descuento DESC, p.nombre; 