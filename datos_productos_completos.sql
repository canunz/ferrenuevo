-- ==========================================
-- SCRIPT: DATOS DE PRODUCTOS COMPLETOS
-- ==========================================
-- Productos reales para todas las categorías de Ferremas

-- Limpiar productos existentes (opcional)
-- DELETE FROM productos WHERE id > 0;

-- ==========================================
-- 1. HERRAMIENTAS ELÉCTRICAS (categoria_id = 1)
-- ==========================================
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo, imagen, created_at, updated_at) VALUES
('Taladro Percutor Bosch Professional', 'Taladro percutor de 800W con sistema SDS-plus, ideal para concreto y mampostería', 125000, 'BOSCH-GBH-800', 1, 1, 1, 'taladro_percutor_bosch.jpg', NOW(), NOW()),
('Sierra Circular DeWalt DWE575', 'Sierra circular de 7-1/4" con 1400W, sistema de protección y guía láser', 98000, 'DEWALT-DWE575', 1, 2, 1, 'sierra_circular_dewalt.jpg', NOW(), NOW()),
('Lijadora Orbital Makita BO3710', 'Lijadora orbital de 3" con 120W, velocidad variable y sistema de extracción', 45000, 'MAKITA-BO3710', 1, 3, 1, 'lijadora_orbital_makita.jpg', NOW(), NOW()),
('Atornillador Black+Decker BDCDD12', 'Atornillador inalámbrico de 12V con batería de litio y 2 velocidades', 35000, 'BLACKDECKER-BDCDD12', 1, 4, 1, 'atornillador_black_decker.jpg', NOW(), NOW()),
('Esmeriladora Stanley STGS7115', 'Esmeriladora angular de 4-1/2" con 710W y protección contra arranque', 28000, 'STANLEY-STGS7115', 1, 5, 1, 'esmeriladora_stanley.jpg', NOW(), NOW()),
('Compresor de Aire Makita MAC2400', 'Compresor de aire de 2.5 HP con tanque de 4 galones, ideal para pintura', 180000, 'MAKITA-MAC2400', 1, 3, 1, 'compresor_makita.jpg', NOW(), NOW()),
('Soldadora Inverter DeWalt DWE1400', 'Soldadora inverter de 140A con arco estable y protección térmica', 220000, 'DEWALT-DWE1400', 1, 2, 1, 'soldadora_dewalt.jpg', NOW(), NOW()),
('Rotomartillo Bosch GBH 2-26', 'Rotomartillo de 800W con sistema SDS-plus y empuñadura antivibración', 150000, 'BOSCH-GBH-2-26', 1, 1, 1, 'rotomartillo_bosch.jpg', NOW(), NOW());

-- ==========================================
-- 2. HERRAMIENTAS MANUALES (categoria_id = 2)
-- ==========================================
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo, imagen, created_at, updated_at) VALUES
('Martillo Stanley 16oz', 'Martillo de carpintero con mango de fibra de vidrio y cabeza forjada', 15000, 'STANLEY-FMHT0-80016', 2, 5, 1, 'martillo_stanley_16oz.jpg', NOW(), NOW()),
('Set Destornilladores DeWalt', 'Set de 6 destornilladores con puntas Phillips y planas, mango ergonómico', 25000, 'DEWALT-DWHT0-40006', 2, 2, 1, 'set_destornilladores_dewalt.jpg', NOW(), NOW()),
('Llave Ajustable Stanley 12"', 'Llave ajustable de 12 pulgadas con mandíbula móvil y mango antideslizante', 18000, 'STANLEY-85-610', 2, 5, 1, 'llave_ajustable_stanley.jpg', NOW(), NOW()),
('Alicate Diagonal Bosch', 'Alicate diagonal de 6" con corte preciso y mango aislado', 12000, 'BOSCH-ALC-6', 2, 1, 1, 'alicate_bosch.jpg', NOW(), NOW()),
('Nivel de Burbuja Makita', 'Nivel de burbuja de 24" con viales de precisión y base magnética', 22000, 'MAKITA-NIV-24', 2, 3, 1, 'nivel_makita.jpg', NOW(), NOW()),
('Cinta Métrica Black+Decker', 'Cinta métrica de 5m con cierre automático y gancho magnético', 8000, 'BLACKDECKER-TAPE-5M', 2, 4, 1, 'cinta_metrica_black_decker.jpg', NOW(), NOW()),
('Serrucho Stanley 20"', 'Serrucho de carpintero con dientes endurecidos y mango ergonómico', 16000, 'STANLEY-SAW-20', 2, 5, 1, 'serrucho_stanley.jpg', NOW(), NOW()),
('Escuadra DeWalt 12"', 'Escuadra de acero inoxidable de 12" con graduaciones precisas', 14000, 'DEWALT-SQUARE-12', 2, 2, 1, 'escuadra_dewalt.jpg', NOW(), NOW());

-- ==========================================
-- 3. CONSTRUCCIÓN (categoria_id = 3)
-- ==========================================
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo, imagen, created_at, updated_at) VALUES
('Mezcladora de Cemento Makita', 'Mezcladora de cemento de 5 pies cúbicos con motor de 1/2 HP', 85000, 'MAKITA-MIX-5CF', 3, 3, 1, 'mezcladora_makita.jpg', NOW(), NOW()),
('Vibrador de Concreto Bosch', 'Vibrador de concreto de 1.5" con motor de 1.5 HP y manguera de 3m', 120000, 'MAKITA-VIB-1.5', 3, 1, 1, 'vibrador_bosch.jpg', NOW(), NOW()),
('Cortadora de Cerámica DeWalt', 'Cortadora de cerámica de 24" con guía láser y sistema de agua', 95000, 'DEWALT-D24000', 3, 2, 1, 'cortadora_ceramica_dewalt.jpg', NOW(), NOW()),
('Placa Compactadora Stanley', 'Placa compactadora de 70kg con motor de 6.5 HP y sistema antivibración', 180000, 'STANLEY-PLATE-70KG', 3, 5, 1, 'placa_compactadora_stanley.jpg', NOW(), NOW()),
('Hormigonera Black+Decker', 'Hormigonera de 130L con motor de 1/2 HP y sistema de inclinación', 75000, 'BLACKDECKER-MIX-130L', 3, 4, 1, 'hormigonera_black_decker.jpg', NOW(), NOW()),
('Sierra de Mesa Bosch', 'Sierra de mesa de 10" con 4100W y sistema de protección', 280000, 'BOSCH-TABLE-4100', 3, 1, 1, 'sierra_mesa_bosch.jpg', NOW(), NOW()),
('Taladro de Perforación Makita', 'Taladro de perforación de 1-1/2" con motor de 2 HP', 150000, 'MAKITA-DRILL-1.5', 3, 3, 1, 'taladro_perforacion_makita.jpg', NOW(), NOW()),
('Andamio Modular Stanley', 'Sistema de andamio modular con plataformas de 1.2m x 0.8m', 450000, 'STANLEY-SCAFFOLD-1.2', 3, 5, 1, 'andamio_stanley.jpg', NOW(), NOW());

-- ==========================================
-- 4. JARDINERÍA (categoria_id = 4)
-- ==========================================
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo, imagen, created_at, updated_at) VALUES
('Cortadora de Césped Black+Decker', 'Cortadora de césped eléctrica de 14" con sistema mulching', 85000, 'BLACKDECKER-LAWN-14', 4, 4, 1, 'cortadora_cesped_black_decker.jpg', NOW(), NOW()),
('Motosierra DeWalt 16"', 'Motosierra de gasolina de 16" con motor de 40cc y sistema antivibración', 180000, 'DEWALT-CHAIN-16', 4, 2, 1, 'motosierra_dewalt.jpg', NOW(), NOW()),
('Soplador de Hojas Makita', 'Soplador de hojas de 3.5 HP con velocidad variable y mochila', 95000, 'MAKITA-BLOWER-3.5', 4, 3, 1, 'soplador_makita.jpg', NOW(), NOW()),
('Podadora de Setos Stanley', 'Podadora de setos eléctrica de 18" con hoja de doble filo', 65000, 'STANLEY-HEDGE-18', 4, 5, 1, 'podadora_setos_stanley.jpg', NOW(), NOW()),
('Aspersor Rotativo Bosch', 'Aspersor rotativo de 360° con alcance ajustable hasta 12m', 25000, 'BOSCH-SPRINKLER-360', 4, 1, 1, 'aspersor_bosch.jpg', NOW(), NOW()),
('Desbrozadora Black+Decker', 'Desbrozadora eléctrica de 13" con hilo de corte automático', 55000, 'BLACKDECKER-TRIMMER-13', 4, 4, 1, 'desbrozadora_black_decker.jpg', NOW(), NOW()),
('Hidrolavadora DeWalt', 'Hidrolavadora de 2000 PSI con motor de 1.5 HP y 4 boquillas', 120000, 'DEWALT-PRESSURE-2000', 4, 2, 1, 'hidrolavadora_dewalt.jpg', NOW(), NOW()),
('Cultivador Makita', 'Cultivador de gasolina de 4 tiempos con 4 cuchillas rotativas', 95000, 'MAKITA-TILLER-4T', 4, 3, 1, 'cultivador_makita.jpg', NOW(), NOW());

-- ==========================================
-- 5. SEGURIDAD (categoria_id = 5)
-- ==========================================
INSERT INTO productos (nombre, descripcion, precio, codigo_sku, categoria_id, marca_id, activo, imagen, created_at, updated_at) VALUES
('Casco de Seguridad Stanley', 'Casco de seguridad clase E con ajuste de 6 puntos y visera', 18000, 'STANLEY-HELMET-E', 5, 5, 1, 'casco_stanley.jpg', NOW(), NOW()),
('Gafas de Protección DeWalt', 'Gafas de protección anti-impacto con protección UV y anti-rayado', 12000, 'DEWALT-GOGGLES-UV', 5, 2, 1, 'gafas_dewalt.jpg', NOW(), NOW()),
('Guantes de Trabajo Bosch', 'Guantes de trabajo con palma de cuero y refuerzo en nudillos', 15000, 'BOSCH-GLOVES-LEATHER', 5, 1, 1, 'guantes_bosch.jpg', NOW(), NOW()),
('Botas de Seguridad Makita', 'Botas de seguridad con punta de acero y suela antideslizante', 45000, 'MAKITA-BOOTS-STEEL', 5, 3, 1, 'botas_makita.jpg', NOW(), NOW()),
('Protección Auditiva Black+Decker', 'Protectores auditivos con reducción de ruido de 25dB', 8000, 'BLACKDECKER-EAR-25DB', 5, 4, 1, 'proteccion_auditiva_black_decker.jpg', NOW(), NOW()),
('Chaleco Reflectante Stanley', 'Chaleco reflectante clase 2 con cintas de 3M Scotchlite', 12000, 'STANLEY-VEST-CLASS2', 5, 5, 1, 'chaleco_stanley.jpg', NOW(), NOW()),
('Mascarilla N95 DeWalt', 'Mascarilla N95 con filtro de partículas y ajuste nasal', 5000, 'DEWALT-MASK-N95', 5, 2, 1, 'mascarilla_dewalt.jpg', NOW(), NOW()),
('Arnés de Seguridad Bosch', 'Arnés de seguridad clase 1 con 2 puntos de anclaje', 35000, 'BOSCH-HARNESS-CLASS1', 5, 1, 1, 'arnes_bosch.jpg', NOW(), NOW());

-- ==========================================
-- VERIFICAR INSERCIÓN
-- ==========================================
SELECT 
    p.id,
    p.nombre,
    p.precio,
    c.nombre as categoria,
    m.nombre as marca,
    p.activo
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
JOIN marcas m ON p.marca_id = m.id
ORDER BY p.categoria_id, p.id;

-- SQL para agregar más productos (5 por categoría)
-- Herramientas Eléctricas (Categoría 1)

INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, marca_id, imagen, estado, created_at, updated_at) VALUES
-- Herramientas Eléctricas (Categoría 1)
('Taladro Percutor DeWalt 20V', 'Taladro percutor inalámbrico de 20V con batería de litio, ideal para trabajos profesionales', 89990, 15, 1, 1, 'taladro_percutor_dewalt_20v.jpg', 1, NOW(), NOW()),
('Sierra Circular Bosch 1900W', 'Sierra circular profesional de 1900W con hoja de 190mm, perfecta para cortes precisos', 125000, 8, 1, 3, 'sierra_circular_bosch_1900w.jpg', 1, NOW(), NOW()),
('Lijadora Orbital Makita 5"', 'Lijadora orbital de 5 pulgadas con sistema de extracción de polvo, velocidad variable', 75000, 12, 1, 4, 'lijadora_orbital_makita_5.jpg', 1, NOW(), NOW()),
('Atornillador Black & Decker 12V', 'Atornillador inalámbrico de 12V con 20 posiciones de torque, ideal para bricolaje', 45000, 20, 1, 2, 'atornillador_black_decker_12v.jpg', 1, NOW(), NOW()),
('Esmeriladora Stanley 4.5"', 'Esmeriladora angular de 4.5 pulgadas con motor de 850W, para corte y desbaste', 55000, 10, 1, 5, 'esmeriladora_stanley_4.5.jpg', 1, NOW(), NOW()),

-- Herramientas Manuales (Categoría 2)
('Martillo Stanley 16oz', 'Martillo de carpintero de 16 onzas con mango de fibra de vidrio, cabeza forjada', 25000, 25, 2, 5, 'martillo_stanley_16oz.jpg', 1, NOW(), NOW()),
('Set Destornilladores DeWalt 6pc', 'Set de 6 destornilladores profesionales con puntas magnéticas y mangos ergonómicos', 35000, 18, 2, 1, 'set_destornilladores_dewalt_6pc.jpg', 1, NOW(), NOW()),
('Llave Ajustable Bosch 12"', 'Llave ajustable de 12 pulgadas con mandíbula móvil, acabado cromado', 28000, 15, 2, 3, 'llave_ajustable_bosch_12.jpg', 1, NOW(), NOW()),
('Alicate Universal Makita', 'Alicate universal de 8 pulgadas con cortador integrado, mango aislado', 22000, 22, 2, 4, 'alicate_universal_makita.jpg', 1, NOW(), NOW()),
('Nivel de Burbuja Black & Decker 24"', 'Nivel de burbuja de 24 pulgadas con 3 viales, marco de aluminio', 18000, 30, 2, 2, 'nivel_burbuja_black_decker_24.jpg', 1, NOW(), NOW()),

-- Construcción (Categoría 3)
('Carretilla Stanley 6 pies', 'Carretilla de construcción de 6 pies cúbicos con llanta neumática, estructura reforzada', 45000, 8, 3, 5, 'carretilla_stanley_6pies.jpg', 1, NOW(), NOW()),
('Paleta de Albañil DeWalt', 'Paleta de albañil de acero templado con mango ergonómico, tamaño estándar', 15000, 35, 3, 1, 'paleta_albañil_dewalt.jpg', 1, NOW(), NOW()),
('Cubo de Construcción Bosch 20L', 'Cubo de construcción de 20 litros con asa reforzada, material resistente', 12000, 40, 3, 3, 'cubo_construccion_bosch_20l.jpg', 1, NOW(), NOW()),
('Cinta Métrica Makita 5m', 'Cinta métrica de 5 metros con cierre automático, carcasa resistente', 8000, 50, 3, 4, 'cinta_metrica_makita_5m.jpg', 1, NOW(), NOW()),
('Escalera Black & Decker 6 escalones', 'Escalera de aluminio de 6 escalones con plataforma de trabajo, plegable', 85000, 6, 3, 2, 'escalera_black_decker_6escalones.jpg', 1, NOW(), NOW()),

-- Jardinería (Categoría 4)
('Cortadora de Césped Stanley', 'Cortadora de césped manual de 16 pulgadas con altura ajustable, cuchillas de acero', 95000, 5, 4, 5, 'cortadora_cesped_stanley.jpg', 1, NOW(), NOW()),
('Manguera DeWalt 25m', 'Manguera de jardín de 25 metros con refuerzo de malla, resistente a la presión', 35000, 12, 4, 1, 'manguera_dewalt_25m.jpg', 1, NOW(), NOW()),
('Tijera de Podar Bosch', 'Tijera de podar profesional con hojas de acero inoxidable, mango ergonómico', 28000, 15, 4, 3, 'tijera_podar_bosch.jpg', 1, NOW(), NOW()),
('Rastrillo Makita 16 dientes', 'Rastrillo de jardín de 16 dientes con mango de madera, ideal para hojas', 18000, 20, 4, 4, 'rastrillo_makita_16dientes.jpg', 1, NOW(), NOW()),
('Pala de Jardín Black & Decker', 'Pala de jardín con punta redondeada y mango de fibra de vidrio', 22000, 18, 4, 2, 'pala_jardin_black_decker.jpg', 1, NOW(), NOW()),

-- Seguridad (Categoría 5)
('Casco de Seguridad Stanley', 'Casco de seguridad industrial con ajuste automático, certificado ANSI', 25000, 25, 5, 5, 'casco_seguridad_stanley.jpg', 1, NOW(), NOW()),
('Guantes de Trabajo DeWalt', 'Guantes de trabajo resistentes con palma de cuero, talla L', 15000, 40, 5, 1, 'guantes_trabajo_dewalt.jpg', 1, NOW(), NOW()),
('Gafas de Seguridad Bosch', 'Gafas de seguridad con protección UV y anti-rayado, marco flexible', 12000, 35, 5, 3, 'gafas_seguridad_bosch.jpg', 1, NOW(), NOW()),
('Botas de Seguridad Makita', 'Botas de seguridad con punta de acero, suela antideslizante, talla 42', 65000, 10, 5, 4, 'botas_seguridad_makita.jpg', 1, NOW(), NOW()),
('Chaleco Reflectante Black & Decker', 'Chaleco de seguridad reflectante con cierre de velcro, talla única', 18000, 30, 5, 2, 'chaleco_reflectante_black_decker.jpg', 1, NOW(), NOW()),

-- Productos Genéricos (Categoría 6 - usando marca Genérica)
('Cinta Aislante Genérica 20m', 'Cinta aislante de 20 metros, resistencia 600V, color negro', 5000, 60, 1, 6, 'cinta_aislante_generica_20m.jpg', 1, NOW(), NOW()),
('Tornillos Phillips Genéricos 100pc', 'Set de 100 tornillos Phillips cabeza plana, 3x20mm, acero galvanizado', 8000, 45, 2, 6, 'tornillos_phillips_genericos_100pc.jpg', 1, NOW(), NOW()),
('Cemento Portland Genérico 25kg', 'Cemento Portland tipo I, bolsa de 25kg, ideal para construcción', 12000, 20, 3, 6, 'cemento_portland_generico_25kg.jpg', 1, NOW(), NOW()),
('Semillas de Tomate Genéricas', 'Semillas de tomate híbrido, paquete de 50 semillas, alta producción', 3000, 80, 4, 6, 'semillas_tomate_genericas.jpg', 1, NOW(), NOW()),
('Mascarilla Desechable Genérica', 'Mascarilla desechable de 3 capas, caja de 50 unidades', 15000, 100, 5, 6, 'mascarilla_desechable_generica.jpg', 1, NOW(), NOW()); 