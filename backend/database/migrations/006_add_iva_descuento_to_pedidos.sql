-- Migración para agregar campos de IVA y descuento a la tabla pedidos
-- Fecha: 2025-01-27

-- Agregar campos de IVA y descuento a la tabla pedidos
ALTER TABLE `pedidos` 
ADD COLUMN `iva` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `subtotal`,
ADD COLUMN `descuento` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `iva`,
ADD COLUMN `costo_envio` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `descuento`;

-- Actualizar el campo total para que sea calculado correctamente
-- El total ahora será: subtotal + iva + costo_envio - descuento
UPDATE `pedidos` SET 
  `iva` = `subtotal` * 0.19,
  `costo_envio` = CASE 
    WHEN `metodo_entrega` = 'despacho_domicilio' THEN 5990.00 
    ELSE 0.00 
  END,
  `total` = `subtotal` + (`subtotal` * 0.19) + 
    CASE WHEN `metodo_entrega` = 'despacho_domicilio' THEN 5990.00 ELSE 0.00 END - `descuento`;

-- Crear índices para mejorar el rendimiento
CREATE INDEX `idx_pedidos_iva` ON `pedidos` (`iva`);
CREATE INDEX `idx_pedidos_descuento` ON `pedidos` (`descuento`);
CREATE INDEX `idx_pedidos_costo_envio` ON `pedidos` (`costo_envio`); 