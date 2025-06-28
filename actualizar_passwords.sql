-- Actualizar contraseñas de usuarios con hashes bcrypt correctos
UPDATE usuarios SET password = '$2b$10$mGJfM8eVARkbbFQb0PAYmOhrl3gPXvcFAy/kiYT49d6mnsgdGySTu' WHERE email = 'catasoledad256@gmail.com';
UPDATE usuarios SET password = '$2b$10$oTzNWkSHscI51b8ATSa5CuEPlu/cJQttc99Bx8ErqmY5xXSzLz1Me' WHERE email = 'alexb321401@gmail.com';

-- Verificar que se actualizaron correctamente
SELECT id, nombre, email, LEFT(password, 10) as password_preview FROM usuarios WHERE email IN ('catasoledad256@gmail.com', 'alexb321401@gmail.com'); 