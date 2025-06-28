-- Actualizar contraseñas de usuarios con hashes bcrypt correctos
-- Generado automáticamente el 25/06/2025

-- Usuario: catasoledad256@gmail.com
-- Contraseña: catasoledad256
UPDATE usuarios SET password = '$2b$10$QEy8C9/UnsWfTV1nqKbMKuU2u./OHgusKTv18ys7dWep.6octNy6.' WHERE email = 'catasoledad256@gmail.com';

-- Usuario: alexb321401@gmail.com  
-- Contraseña: emma2004
UPDATE usuarios SET password = '$2b$10$lr2LUu4xRX.NbY2F0IwWx.VlJMzJzd/47/BQvt.pHX5t/S0PrkfJ.' WHERE email = 'alexb321401@gmail.com';

-- Usuario: cjcatalinac@gmail.com
-- Contraseña: catalina123
UPDATE usuarios SET password = '$2b$10$HWXOF.O2df3zAXF7Kmv8WOnmod8S9bnvd9gSTUOaqqg591b9dkKhO' WHERE email = 'cjcatalinac@gmail.com';

-- Usuario: ferremasnueva@ferremas.cl
-- Contraseña: ferremas123
UPDATE usuarios SET password = '$2b$10$98sVt4WeHK2/42kGQn0REu7ceZEOazXd.w8RfLs/gJPPfWAReX9sy' WHERE email = 'ferremasnueva@ferremas.cl';

-- Verificar que se actualizaron correctamente
SELECT 
    id, 
    nombre, 
    email, 
    LEFT(password, 10) as password_preview,
    CASE 
        WHEN password LIKE '$2b$10$%' THEN 'Hash bcrypt válido'
        ELSE 'Hash inválido'
    END as estado_hash
FROM usuarios 
WHERE email IN (
    'catasoledad256@gmail.com',
    'alexb321401@gmail.com', 
    'cjcatalinac@gmail.com',
    'ferremasnueva@ferremas.cl'
)
ORDER BY id; 