-- Agregar columna stock a la tabla productos
ALTER TABLE productos ADD COLUMN stock INT DEFAULT 0 AFTER precio;

-- SQL corregido para agregar productos (sin la columna stock que no existe)
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, imagen, activo, created_at, updated_at) VALUES
-- Herramientas Eléctricas (Categoría 1)
('Taladro Percutor DeWalt 20V', 'Taladro percutor inalámbrico de 20V con batería de litio, ideal para trabajos profesionales', 89990, 'TAL-DEW-20V-001', 1, 1, 'taladro_percutor_dewalt_20v.jpg', 1, NOW(), NOW()),
('Sierra Circular Bosch 1900W', 'Sierra circular profesional de 1900W con hoja de 190mm, perfecta para cortes precisos', 125000, 'SIE-BOS-1900W-001', 1, 3, 'sierra_circular_bosch_1900w.jpg', 1, NOW(), NOW()),
('Lijadora Orbital Makita 5"', 'Lijadora orbital de 5 pulgadas con sistema de extracción de polvo, velocidad variable', 75000, 'LIJ-MAK-5-001', 1, 4, 'lijadora_orbital_makita_5.jpg', 1, NOW(), NOW()),
('Atornillador Black & Decker 12V', 'Atornillador inalámbrico de 12V con 20 posiciones de torque, ideal para bricolaje', 45000, 'ATO-BLA-12V-001', 1, 2, 'atornillador_black_decker_12v.jpg', 1, NOW(), NOW()),
('Esmeriladora Stanley 4.5"', 'Esmeriladora angular de 4.5 pulgadas con motor de 850W, para corte y desbaste', 55000, 'ESM-STA-4.5-001', 1, 5, 'esmeriladora_stanley_4.5.jpg', 1, NOW(), NOW()),

-- Herramientas Manuales (Categoría 2)
('Martillo Stanley 16oz', 'Martillo de carpintero de 16 onzas con mango de fibra de vidrio, cabeza forjada', 25000, 'MAR-STA-16OZ-001', 2, 5, 'martillo_stanley_16oz.jpg', 1, NOW(), NOW()),
('Set Destornilladores DeWalt 6pc', 'Set de 6 destornilladores profesionales con puntas magnéticas y mangos ergonómicos', 35000, 'SET-DEW-6PC-001', 2, 1, 'set_destornilladores_dewalt_6pc.jpg', 1, NOW(), NOW()),
('Llave Ajustable Bosch 12"', 'Llave ajustable de 12 pulgadas con mandíbula móvil, acabado cromado', 28000, 'LLA-BOS-12-001', 2, 3, 'llave_ajustable_bosch_12.jpg', 1, NOW(), NOW()),
('Alicate Universal Makita', 'Alicate universal de 8 pulgadas con cortador integrado, mango aislado', 22000, 'ALI-MAK-8-001', 2, 4, 'alicate_universal_makita.jpg', 1, NOW(), NOW()),
('Nivel de Burbuja Black & Decker 24"', 'Nivel de burbuja de 24 pulgadas con 3 viales, marco de aluminio', 18000, 'NIV-BLA-24-001', 2, 2, 'nivel_burbuja_black_decker_24.jpg', 1, NOW(), NOW()),

-- Construcción (Categoría 3)
('Carretilla Stanley 6 pies', 'Carretilla de construcción de 6 pies cúbicos con llanta neumática, estructura reforzada', 45000, 'CAR-STA-6P-001', 3, 5, 'carretilla_stanley_6pies.jpg', 1, NOW(), NOW()),
('Paleta de Albañil DeWalt', 'Paleta de albañil de acero templado con mango ergonómico, tamaño estándar', 15000, 'PAL-DEW-ALB-001', 3, 1, 'paleta_albañil_dewalt.jpg', 1, NOW(), NOW()),
('Cubo de Construcción Bosch 20L', 'Cubo de construcción de 20 litros con asa reforzada, material resistente', 12000, 'CUB-BOS-20L-001', 3, 3, 'cubo_construccion_bosch_20l.jpg', 1, NOW(), NOW()),
('Cinta Métrica Makita 5m', 'Cinta métrica de 5 metros con cierre automático, carcasa resistente', 8000, 'CIN-MAK-5M-001', 3, 4, 'cinta_metrica_makita_5m.jpg', 1, NOW(), NOW()),
('Escalera Black & Decker 6 escalones', 'Escalera de aluminio de 6 escalones con plataforma de trabajo, plegable', 85000, 'ESC-BLA-6E-001', 3, 2, 'escalera_black_decker_6escalones.jpg', 1, NOW(), NOW()),

-- Jardinería (Categoría 4)
('Cortadora de Césped Stanley', 'Cortadora de césped manual de 16 pulgadas con altura ajustable, cuchillas de acero', 95000, 'COR-STA-CES-001', 4, 5, 'cortadora_cesped_stanley.jpg', 1, NOW(), NOW()),
('Manguera DeWalt 25m', 'Manguera de jardín de 25 metros con refuerzo de malla, resistente a la presión', 35000, 'MAN-DEW-25M-001', 4, 1, 'manguera_dewalt_25m.jpg', 1, NOW(), NOW()),
('Tijera de Podar Bosch', 'Tijera de podar profesional con hojas de acero inoxidable, mango ergonómico', 28000, 'TIJ-BOS-POD-001', 4, 3, 'tijera_podar_bosch.jpg', 1, NOW(), NOW()),
('Rastrillo Makita 16 dientes', 'Rastrillo de jardín de 16 dientes con mango de madera, ideal para hojas', 18000, 'RAS-MAK-16D-001', 4, 4, 'rastrillo_makita_16dientes.jpg', 1, NOW(), NOW()),
('Pala de Jardín Black & Decker', 'Pala de jardín con punta redondeada y mango de fibra de vidrio', 22000, 'PAL-BLA-JAR-001', 4, 2, 'pala_jardin_black_decker.jpg', 1, NOW(), NOW()),

-- Seguridad (Categoría 5)
('Casco de Seguridad Stanley', 'Casco de seguridad industrial con ajuste automático, certificado ANSI', 25000, 'CAS-STA-SEG-001', 5, 5, 'casco_seguridad_stanley.jpg', 1, NOW(), NOW()),
('Guantes de Trabajo DeWalt', 'Guantes de trabajo resistentes con palma de cuero, talla L', 15000, 'GUA-DEW-TRA-001', 5, 1, 'guantes_trabajo_dewalt.jpg', 1, NOW(), NOW()),
('Gafas de Seguridad Bosch', 'Gafas de seguridad con protección UV y anti-rayado, marco flexible', 12000, 'GAF-BOS-SEG-001', 5, 3, 'gafas_seguridad_bosch.jpg', 1, NOW(), NOW()),
('Botas de Seguridad Makita', 'Botas de seguridad con punta de acero, suela antideslizante, talla 42', 65000, 'BOT-MAK-SEG-001', 5, 4, 'botas_seguridad_makita.jpg', 1, NOW(), NOW()),
('Chaleco Reflectante Black & Decker', 'Chaleco de seguridad reflectante con cierre de velcro, talla única', 18000, 'CHA-BLA-REF-001', 5, 2, 'chaleco_reflectante_black_decker.jpg', 1, NOW(), NOW()),

-- Productos Genéricos (usando marca Genérica)
('Cinta Aislante Genérica 20m', 'Cinta aislante de 20 metros, resistencia 600V, color negro', 5000, 'CIN-GEN-20M-001', 1, 6, 'cinta_aislante_generica_20m.jpg', 1, NOW(), NOW()),
('Tornillos Phillips Genéricos 100pc', 'Set de 100 tornillos Phillips cabeza plana, 3x20mm, acero galvanizado', 8000, 'TOR-GEN-100PC-001', 2, 6, 'tornillos_phillips_genericos_100pc.jpg', 1, NOW(), NOW()),
('Cemento Portland Genérico 25kg', 'Cemento Portland tipo I, bolsa de 25kg, ideal para construcción', 12000, 'CEM-GEN-25KG-001', 3, 6, 'cemento_portland_generico_25kg.jpg', 1, NOW(), NOW()),
('Semillas de Tomate Genéricas', 'Semillas de tomate híbrido, paquete de 50 semillas, alta producción', 3000, 'SEM-GEN-TOM-001', 4, 6, 'semillas_tomate_genericas.jpg', 1, NOW(), NOW()),
('Mascarilla Desechable Genérica', 'Mascarilla desechable de 3 capas, caja de 50 unidades', 15000, 'MAS-GEN-50U-001', 5, 6, 'mascarilla_desechable_generica.jpg', 1, NOW(), NOW());

-- Actualizar el stock después de insertar los productos
UPDATE productos SET stock = 15 WHERE codigo_sku = 'TAL-DEW-20V-001';
UPDATE productos SET stock = 8 WHERE codigo_sku = 'SIE-BOS-1900W-001';
UPDATE productos SET stock = 12 WHERE codigo_sku = 'LIJ-MAK-5-001';
UPDATE productos SET stock = 20 WHERE codigo_sku = 'ATO-BLA-12V-001';
UPDATE productos SET stock = 10 WHERE codigo_sku = 'ESM-STA-4.5-001';

UPDATE productos SET stock = 25 WHERE codigo_sku = 'MAR-STA-16OZ-001';
UPDATE productos SET stock = 18 WHERE codigo_sku = 'SET-DEW-6PC-001';
UPDATE productos SET stock = 15 WHERE codigo_sku = 'LLA-BOS-12-001';
UPDATE productos SET stock = 22 WHERE codigo_sku = 'ALI-MAK-8-001';
UPDATE productos SET stock = 30 WHERE codigo_sku = 'NIV-BLA-24-001';

UPDATE productos SET stock = 8 WHERE codigo_sku = 'CAR-STA-6P-001';
UPDATE productos SET stock = 35 WHERE codigo_sku = 'PAL-DEW-ALB-001';
UPDATE productos SET stock = 40 WHERE codigo_sku = 'CUB-BOS-20L-001';
UPDATE productos SET stock = 50 WHERE codigo_sku = 'CIN-MAK-5M-001';
UPDATE productos SET stock = 6 WHERE codigo_sku = 'ESC-BLA-6E-001';

UPDATE productos SET stock = 5 WHERE codigo_sku = 'COR-STA-CES-001';
UPDATE productos SET stock = 12 WHERE codigo_sku = 'MAN-DEW-25M-001';
UPDATE productos SET stock = 15 WHERE codigo_sku = 'TIJ-BOS-POD-001';
UPDATE productos SET stock = 20 WHERE codigo_sku = 'RAS-MAK-16D-001';
UPDATE productos SET stock = 18 WHERE codigo_sku = 'PAL-BLA-JAR-001';

UPDATE productos SET stock = 25 WHERE codigo_sku = 'CAS-STA-SEG-001';
UPDATE productos SET stock = 40 WHERE codigo_sku = 'GUA-DEW-TRA-001';
UPDATE productos SET stock = 35 WHERE codigo_sku = 'GAF-BOS-SEG-001';
UPDATE productos SET stock = 10 WHERE codigo_sku = 'BOT-MAK-SEG-001';
UPDATE productos SET stock = 30 WHERE codigo_sku = 'CHA-BLA-REF-001';

UPDATE productos SET stock = 60 WHERE codigo_sku = 'CIN-GEN-20M-001';
UPDATE productos SET stock = 45 WHERE codigo_sku = 'TOR-GEN-100PC-001';
UPDATE productos SET stock = 20 WHERE codigo_sku = 'CEM-GEN-25KG-001';
UPDATE productos SET stock = 80 WHERE codigo_sku = 'SEM-GEN-TOM-001';
UPDATE productos SET stock = 100 WHERE codigo_sku = 'MAS-GEN-50U-001'; 