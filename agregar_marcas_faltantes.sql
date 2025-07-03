-- Script para agregar marcas faltantes
-- Ejecutar este script antes de cargar productos

USE ferremasnueva;

-- Verificar marcas existentes
SELECT id, nombre FROM marcas ORDER BY id;

-- Agregar marcas faltantes
INSERT INTO marcas (nombre, descripcion, activo, created_at, updated_at) VALUES
('Bosch', 'Herramientas eléctricas profesionales alemanas', 1, NOW(), NOW()),
('Makita', 'Herramientas eléctricas japonesas de alta calidad', 1, NOW(), NOW()),
('Black+Decker', 'Herramientas para bricolaje y hogar', 1, NOW(), NOW()),
('Hyundai', 'Herramientas y equipos de construcción', 1, NOW(), NOW()),
('Genérica', 'Productos de marca genérica', 1, NOW(), NOW());

-- Verificar marcas después de la inserción
SELECT id, nombre FROM marcas ORDER BY id;

-- Mostrar todas las marcas disponibles
SELECT 
    m.id,
    m.nombre,
    m.descripcion,
    COUNT(p.id) as total_productos
FROM marcas m
LEFT JOIN productos p ON m.id = p.marca_id
WHERE m.activo = 1
GROUP BY m.id, m.nombre, m.descripcion
ORDER BY m.id; 