-- Verificar usuarios existentes
SELECT id, nombre, email, rol_id, activo, created_at 
FROM usuarios 
ORDER BY id;

-- Verificar roles existentes
SELECT id, nombre, descripcion 
FROM roles 
ORDER BY id; 