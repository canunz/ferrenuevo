-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: ferremasnueva
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alertas_stock`
--

DROP TABLE IF EXISTS `alertas_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alertas_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventario_id` int NOT NULL,
  `tipo` enum('stock_bajo','stock_alto','stock_agotado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `leida` tinyint(1) DEFAULT '0',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_lectura` datetime DEFAULT NULL,
  `activa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_inventario` (`inventario_id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_activa` (`activa`),
  KEY `idx_leida` (`leida`),
  CONSTRAINT `alertas_stock_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alertas_stock`
--

LOCK TABLES `alertas_stock` WRITE;
/*!40000 ALTER TABLE `alertas_stock` DISABLE KEYS */;
INSERT INTO `alertas_stock` VALUES (3,274,'stock_bajo','Stock bajo: Producto ID 80 - Stock actual: 2',0,'2025-07-01 16:13:39',NULL,1),(4,274,'stock_bajo','Stock bajo: Producto ID 80 - Stock actual: 2',0,'2025-07-01 16:13:39',NULL,1),(5,276,'stock_bajo','Stock bajo: Producto ID 98 - Stock actual: 2',0,'2025-07-01 19:56:39',NULL,1),(6,276,'stock_bajo','Stock bajo: Producto ID 98 - Stock actual: 2',0,'2025-07-01 19:56:39',NULL,1),(7,277,'stock_bajo','Stock bajo: Producto ID 86 - Stock actual: 2',0,'2025-07-01 19:59:11',NULL,1),(8,277,'stock_bajo','Stock bajo: Producto ID 86 - Stock actual: 2',0,'2025-07-01 19:59:11',NULL,1),(9,276,'stock_bajo','Stock bajo: Producto ID 98 - Stock actual: 5',0,'2025-07-03 01:20:14',NULL,1),(10,277,'stock_bajo','Stock bajo: Producto ID 86 - Stock actual: 5',0,'2025-07-03 01:56:29',NULL,1);
/*!40000 ALTER TABLE `alertas_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `api_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permisos` json DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `ultimo_uso` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_key` (`api_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`),
  UNIQUE KEY `nombre_56` (`nombre`),
  UNIQUE KEY `nombre_57` (`nombre`),
  UNIQUE KEY `nombre_58` (`nombre`),
  UNIQUE KEY `nombre_59` (`nombre`),
  UNIQUE KEY `nombre_60` (`nombre`),
  UNIQUE KEY `nombre_61` (`nombre`),
  UNIQUE KEY `nombre_62` (`nombre`),
  UNIQUE KEY `nombre_63` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Herramientas El├®ctricas','Taladros, sierras, lijadoras y herramientas con motor',1,'2025-06-06 15:32:22','2025-06-06 15:32:22'),(2,'Herramientas Manuales','Martillos, destornilladores, llaves y herramientas b├ísicas',1,'2025-06-06 15:32:22','2025-06-06 15:32:22'),(3,'Construcci├│n','Materiales y herramientas para construcci├│n y alba├▒iler├¡a',1,'2025-06-06 15:32:22','2025-06-06 15:32:22'),(4,'Jardiner├¡a','Herramientas y equipos para jard├¡n y espacios verdes',1,'2025-06-06 15:32:22','2025-06-06 15:32:22'),(5,'Seguridad','Equipos de protecci├│n personal y seguridad laboral',1,'2025-06-06 15:32:22','2025-06-06 15:32:22'),(6,'Productos Gen├®ricos','Productos sin marca espec├¡fica',1,'2025-07-02 20:12:56','2025-07-02 20:12:56');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuraciones_sistema`
--

DROP TABLE IF EXISTS `configuraciones_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuraciones_sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` text COLLATE utf8mb4_unicode_ci,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo_dato` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `es_publica` tinyint(1) DEFAULT '0',
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `configuraciones_sistema_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuraciones_sistema`
--

LOCK TABLES `configuraciones_sistema` WRITE;
/*!40000 ALTER TABLE `configuraciones_sistema` DISABLE KEYS */;
INSERT INTO `configuraciones_sistema` VALUES (1,'sitio_nombre','Ferremas','Nombre del sitio web','string',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(2,'sitio_descripcion','Tu ferreter├¡a de confianza','Descripci├│n del sitio','string',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(3,'moneda_principal','CLP','Moneda principal del sistema','string',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(4,'iva_porcentaje','19','Porcentaje de IVA','number',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(5,'descuento_maximo','50','Descuento m├íximo permitido (%)','number',0,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(6,'productos_por_pagina','12','Productos mostrados por p├ígina','number',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(7,'carrito_tiempo_expiracion','60','Tiempo de expiraci├│n del carrito (minutos)','number',0,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(8,'promociones_activas','true','Activar sistema de promociones','boolean',1,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(9,'api_externa_activa','true','Activar integraciones externas','boolean',0,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15'),(10,'webhook_timeout','30','Timeout para webhooks (segundos)','number',0,NULL,'2025-06-24 15:58:15','2025-06-24 15:58:15');
/*!40000 ALTER TABLE `configuraciones_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cupones`
--

DROP TABLE IF EXISTS `cupones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cupones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('porcentaje','monto_fijo') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `monto_minimo` decimal(10,2) DEFAULT '0.00',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('activo','inactivo','usado','vencido') COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `usos_totales` int DEFAULT '0',
  `usos_limite` int DEFAULT '1',
  `usuario_asignado_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `idx_codigo` (`codigo`),
  KEY `idx_estado` (`estado`),
  KEY `idx_usuario` (`usuario_asignado_id`),
  CONSTRAINT `cupones_ibfk_1` FOREIGN KEY (`usuario_asignado_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cupones`
--

LOCK TABLES `cupones` WRITE;
/*!40000 ALTER TABLE `cupones` DISABLE KEYS */;
INSERT INTO `cupones` VALUES (1,'CLIENTE123','Cup├│n personalizado para cliente VIP','monto_fijo',10000.00,50000.00,'2024-06-01','2024-12-31','activo',0,5,3,'2025-06-17 11:07:56','2025-06-17 11:07:56'),(2,'PRIMERA15','15% de descuento para primera compra','porcentaje',15.00,30000.00,'2024-06-01','2024-12-31','activo',0,100,NULL,'2025-06-17 11:07:56','2025-06-17 11:07:56'),(3,'BLACK10','CUPON','porcentaje',29999.00,399999.00,'2025-07-21','2025-07-10','activo',0,1,NULL,'2025-07-02 22:15:11','2025-07-02 22:15:11'),(4,'BLACK1','CUPON','porcentaje',29990.00,489597.00,'2025-07-15','2025-07-26','activo',0,1,NULL,'2025-07-03 00:09:49','2025-07-03 00:09:49'),(5,'STANLEY25','CUPON','porcentaje',39998.00,50000.00,'2025-07-23','2025-07-24','activo',0,1,NULL,'2025-07-03 00:56:31','2025-07-03 00:56:31');
/*!40000 ALTER TABLE `cupones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuentos`
--

DROP TABLE IF EXISTS `descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `tipo` enum('porcentaje','monto_fijo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'porcentaje',
  `valor` decimal(10,2) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('activa','inactiva') COLLATE utf8mb4_unicode_ci DEFAULT 'activa',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `descuentos_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuentos`
--

LOCK TABLES `descuentos` WRITE;
/*!40000 ALTER TABLE `descuentos` DISABLE KEYS */;
INSERT INTO `descuentos` VALUES (1,73,'porcentaje',30.00,'2025-07-08','2025-07-17','activa','2025-07-02 16:40:07','2025-07-02 16:40:07'),(2,73,'monto_fijo',1000.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:42:50','2025-07-02 16:42:50'),(3,73,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:44:53','2025-07-02 16:44:53'),(4,74,'monto_fijo',3000.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:48:27','2025-07-02 16:48:27'),(5,75,'porcentaje',40.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:48:53','2025-07-02 16:48:53'),(6,73,'monto_fijo',1000.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:52:05','2025-07-02 16:52:05'),(7,76,'porcentaje',50.00,'2025-07-02','2025-07-03','activa','2025-07-02 16:59:22','2025-07-02 16:59:22'),(8,77,'monto_fijo',10000.00,'2025-07-02','2025-07-03','activa','2025-07-02 17:16:23','2025-07-02 17:16:23'),(9,108,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-02 21:33:22','2025-07-02 21:33:22'),(10,3,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-02 22:06:56','2025-07-02 22:06:56'),(11,104,'porcentaje',60.00,'2025-07-02','2025-07-03','activa','2025-07-02 22:32:04','2025-07-02 22:32:04'),(12,102,'porcentaje',20.00,'2025-07-02','2025-07-03','activa','2025-07-02 22:48:30','2025-07-02 22:48:30'),(13,77,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:09:14','2025-07-03 00:09:14'),(14,77,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:09:23','2025-07-03 00:09:23'),(15,108,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:14:16','2025-07-03 00:14:16'),(16,76,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:21:05','2025-07-03 00:21:05'),(17,76,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:27:39','2025-07-03 00:27:39'),(18,105,'porcentaje',30.00,'2025-07-02','2025-07-03','activa','2025-07-03 00:32:05','2025-07-03 00:32:05');
/*!40000 ALTER TABLE `descuentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedidos`
--

DROP TABLE IF EXISTS `detalle_pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_pedidos_ibfk_121` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `detalle_pedidos_ibfk_122` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedidos`
--

LOCK TABLES `detalle_pedidos` WRITE;
/*!40000 ALTER TABLE `detalle_pedidos` DISABLE KEYS */;
INSERT INTO `detalle_pedidos` VALUES (8,8,3,3,45000.00,135000.00,'2025-06-30 01:23:05','2025-06-30 01:23:05'),(11,9,3,2,45000.00,90000.00,'2025-06-30 01:23:05','2025-06-30 01:23:05'),(15,11,3,1,45000.00,45000.00,'2025-06-30 01:23:05','2025-06-30 01:23:05'),(17,13,73,1,89990.00,89990.00,'2025-07-01 13:15:12','2025-07-01 13:15:12'),(18,14,73,1,89990.00,89990.00,'2025-07-01 13:20:45','2025-07-01 13:20:45'),(19,15,73,2,89990.00,179980.00,'2025-07-01 13:30:24','2025-07-01 13:30:24'),(20,16,73,1,89990.00,89990.00,'2025-07-01 13:38:47','2025-07-01 13:38:47'),(21,17,76,1,22500.00,22500.00,'2025-07-02 04:32:10','2025-07-02 04:32:10'),(22,18,77,1,45000.00,45000.00,'2025-07-02 17:17:23','2025-07-02 17:17:23'),(23,19,76,1,22500.00,22500.00,'2025-07-02 17:26:45','2025-07-02 17:26:45'),(24,20,81,1,22000.00,22000.00,'2025-07-02 22:27:45','2025-07-02 22:27:45'),(25,21,80,1,11200.00,11200.00,'2025-07-03 00:59:09','2025-07-03 00:59:09'),(26,22,108,1,32990.00,32990.00,'2025-07-03 01:59:53','2025-07-03 01:59:53'),(27,22,77,1,41250.00,41250.00,'2025-07-03 01:59:53','2025-07-03 01:59:53');
/*!40000 ALTER TABLE `detalle_pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_factura`
--

DROP TABLE IF EXISTS `detalles_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `factura_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `descuento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `iva` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL,
  `producto_nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `producto_codigo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `producto_descripcion` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  KEY `producto_id` (`producto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_factura`
--

LOCK TABLES `detalles_factura` WRITE;
/*!40000 ALTER TABLE `detalles_factura` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisas`
--

DROP TABLE IF EXISTS `divisas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `simbolo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `codigo_2` (`codigo`),
  UNIQUE KEY `codigo_3` (`codigo`),
  UNIQUE KEY `codigo_4` (`codigo`),
  UNIQUE KEY `codigo_5` (`codigo`),
  UNIQUE KEY `codigo_6` (`codigo`),
  UNIQUE KEY `codigo_7` (`codigo`),
  UNIQUE KEY `codigo_8` (`codigo`),
  UNIQUE KEY `codigo_9` (`codigo`),
  UNIQUE KEY `codigo_10` (`codigo`),
  UNIQUE KEY `codigo_11` (`codigo`),
  UNIQUE KEY `codigo_12` (`codigo`),
  UNIQUE KEY `codigo_13` (`codigo`),
  UNIQUE KEY `codigo_14` (`codigo`),
  UNIQUE KEY `codigo_15` (`codigo`),
  UNIQUE KEY `codigo_16` (`codigo`),
  UNIQUE KEY `codigo_17` (`codigo`),
  UNIQUE KEY `codigo_18` (`codigo`),
  UNIQUE KEY `codigo_19` (`codigo`),
  UNIQUE KEY `codigo_20` (`codigo`),
  UNIQUE KEY `codigo_21` (`codigo`),
  UNIQUE KEY `codigo_22` (`codigo`),
  UNIQUE KEY `codigo_23` (`codigo`),
  UNIQUE KEY `codigo_24` (`codigo`),
  UNIQUE KEY `codigo_25` (`codigo`),
  UNIQUE KEY `codigo_26` (`codigo`),
  UNIQUE KEY `codigo_27` (`codigo`),
  UNIQUE KEY `codigo_28` (`codigo`),
  UNIQUE KEY `codigo_29` (`codigo`),
  UNIQUE KEY `codigo_30` (`codigo`),
  UNIQUE KEY `codigo_31` (`codigo`),
  UNIQUE KEY `codigo_32` (`codigo`),
  UNIQUE KEY `codigo_33` (`codigo`),
  UNIQUE KEY `codigo_34` (`codigo`),
  UNIQUE KEY `codigo_35` (`codigo`),
  UNIQUE KEY `codigo_36` (`codigo`),
  UNIQUE KEY `codigo_37` (`codigo`),
  UNIQUE KEY `codigo_38` (`codigo`),
  UNIQUE KEY `codigo_39` (`codigo`),
  UNIQUE KEY `codigo_40` (`codigo`),
  UNIQUE KEY `codigo_41` (`codigo`),
  UNIQUE KEY `codigo_42` (`codigo`),
  UNIQUE KEY `codigo_43` (`codigo`),
  UNIQUE KEY `codigo_44` (`codigo`),
  UNIQUE KEY `codigo_45` (`codigo`),
  UNIQUE KEY `codigo_46` (`codigo`),
  UNIQUE KEY `codigo_47` (`codigo`),
  UNIQUE KEY `codigo_48` (`codigo`),
  UNIQUE KEY `codigo_49` (`codigo`),
  UNIQUE KEY `codigo_50` (`codigo`),
  UNIQUE KEY `codigo_51` (`codigo`),
  UNIQUE KEY `codigo_52` (`codigo`),
  UNIQUE KEY `codigo_53` (`codigo`),
  UNIQUE KEY `codigo_54` (`codigo`),
  UNIQUE KEY `codigo_55` (`codigo`),
  UNIQUE KEY `codigo_56` (`codigo`),
  UNIQUE KEY `codigo_57` (`codigo`),
  UNIQUE KEY `codigo_58` (`codigo`),
  UNIQUE KEY `codigo_59` (`codigo`),
  UNIQUE KEY `codigo_60` (`codigo`),
  UNIQUE KEY `codigo_61` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisas`
--

LOCK TABLES `divisas` WRITE;
/*!40000 ALTER TABLE `divisas` DISABLE KEYS */;
INSERT INTO `divisas` VALUES (1,'CLP','Peso Chileno','$',1,'2025-06-06 15:32:39','2025-06-06 15:32:39'),(2,'USD','D├│lar Estadounidense','US$',1,'2025-06-06 15:32:39','2025-06-06 15:32:39'),(3,'EUR','Euro','Ôé¼',1,'2025-06-06 15:32:39','2025-06-06 15:32:39'),(4,'UF','Unidad de Fomento','UF',1,'2025-06-06 15:32:39','2025-06-06 15:32:39');
/*!40000 ALTER TABLE `divisas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_diarias`
--

DROP TABLE IF EXISTS `estadisticas_diarias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_diarias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `productos_vendidos` int DEFAULT '0',
  `total_ventas` decimal(15,2) DEFAULT '0.00',
  `promociones_aplicadas` int DEFAULT '0',
  `descuento_total` decimal(15,2) DEFAULT '0.00',
  `usuarios_nuevos` int DEFAULT '0',
  `pedidos_completados` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_fecha` (`fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_diarias`
--

LOCK TABLES `estadisticas_diarias` WRITE;
/*!40000 ALTER TABLE `estadisticas_diarias` DISABLE KEYS */;
/*!40000 ALTER TABLE `estadisticas_diarias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturas`
--

DROP TABLE IF EXISTS `facturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_factura` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pedido_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `fecha_emision` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
  `iva` decimal(10,2) NOT NULL DEFAULT '0.00',
  `descuento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `estado` enum('pendiente','pagada','vencida','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `metodo_pago` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `cliente_nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cliente_rut` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_direccion` text COLLATE utf8mb4_unicode_ci,
  `cliente_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_factura` (`numero_factura`),
  KEY `pedido_id` (`pedido_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `estado` (`estado`),
  KEY `fecha_emision` (`fecha_emision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturas`
--

LOCK TABLES `facturas` WRITE;
/*!40000 ALTER TABLE `facturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `facturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_precios`
--

DROP TABLE IF EXISTS `historial_precios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_precios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `divisa_id` int NOT NULL,
  `fecha` date NOT NULL,
  `valor` decimal(15,6) NOT NULL,
  `fuente` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Banco Central de Chile',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `producto_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_divisa_fecha` (`divisa_id`,`fecha`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `historial_precios_ibfk_115` FOREIGN KEY (`divisa_id`) REFERENCES `divisas` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `historial_precios_ibfk_116` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_precios`
--

LOCK TABLES `historial_precios` WRITE;
/*!40000 ALTER TABLE `historial_precios` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_precios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_promociones`
--

DROP TABLE IF EXISTS `historial_promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_promociones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int DEFAULT NULL,
  `cupon_id` int DEFAULT NULL,
  `pedido_id` int DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `descuento_aplicado` decimal(10,2) NOT NULL,
  `monto_pedido` decimal(10,2) NOT NULL,
  `fecha_uso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_promocion` (`promocion_id`),
  KEY `idx_cupon` (`cupon_id`),
  KEY `idx_pedido` (`pedido_id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_fecha` (`fecha_uso`),
  CONSTRAINT `historial_promociones_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`),
  CONSTRAINT `historial_promociones_ibfk_2` FOREIGN KEY (`cupon_id`) REFERENCES `cupones` (`id`),
  CONSTRAINT `historial_promociones_ibfk_3` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
  CONSTRAINT `historial_promociones_ibfk_4` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_promociones`
--

LOCK TABLES `historial_promociones` WRITE;
/*!40000 ALTER TABLE `historial_promociones` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `sucursal_id` int NOT NULL,
  `stock_actual` int NOT NULL DEFAULT '0',
  `stock_minimo` int NOT NULL DEFAULT '0',
  `stock_maximo` int NOT NULL DEFAULT '0',
  `ubicacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_producto_sucursal` (`producto_id`,`sucursal_id`),
  UNIQUE KEY `inventario_producto_id_sucursal_id` (`producto_id`,`sucursal_id`),
  KEY `idx_stock_bajo` (`stock_actual`,`stock_minimo`),
  KEY `idx_ultima_actualizacion` (`updated_at`),
  KEY `inventario_stock_actual_stock_minimo` (`stock_actual`,`stock_minimo`),
  KEY `sucursal_id` (`sucursal_id`),
  CONSTRAINT `inventario_ibfk_121` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `inventario_ibfk_122` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=279 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (4,3,1,26,2,20,'Estante A3-Inferior','2025-06-06 15:32:59','2025-07-01 19:46:14'),(13,3,3,20,5,100,NULL,NULL,NULL),(14,3,2,20,5,100,NULL,NULL,NULL),(265,81,1,100038,5,100,'Bodega Principal','2025-07-01 02:09:36','2025-07-01 20:11:12'),(266,76,1,120,5,100,'Bodega Principal','2025-07-01 02:12:05','2025-07-01 02:12:05'),(267,73,1,6080,5,100,'Bodega Principal','2025-07-01 03:21:57','2025-07-01 14:19:28'),(268,77,1,12000,5,100,'Bodega Principal','2025-07-01 03:26:49','2025-07-01 03:26:49'),(269,96,1,8,5,100,'Bodega Principal','2025-07-01 15:58:03','2025-07-01 15:58:03'),(270,83,1,18,5,100,'Bodega Principal','2025-07-01 15:58:10','2025-07-01 15:58:10'),(271,93,1,200,5,100,'Bodega Principal','2025-07-01 15:58:19','2025-07-01 15:58:19'),(272,100,1,79,5,100,'Bodega Principal','2025-07-01 15:58:38','2025-07-01 15:58:54'),(273,97,1,10,5,100,'Bodega Principal','2025-07-01 15:59:13','2025-07-01 15:59:13'),(274,80,1,20,5,100,'Bodega Principal','2025-07-01 16:13:39','2025-07-01 16:14:02'),(275,75,1,220,5,100,'Bodega Principal','2025-07-01 19:45:13','2025-07-01 19:52:01'),(276,98,1,8,5,100,'Bodega Principal','2025-07-01 19:56:39','2025-07-03 01:20:14'),(277,86,1,8,5,100,'Bodega Principal','2025-07-01 19:59:11','2025-07-03 01:56:29'),(278,108,1,8,5,100,'Bodega Principal','2025-07-03 01:19:59','2025-07-03 01:19:59');
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trigger_alerta_stock_bajo` AFTER UPDATE ON `inventario` FOR EACH ROW BEGIN
    -- Solo crear alerta si el stock est├í bajo el m├¡nimo
    IF NEW.stock_actual <= NEW.stock_minimo THEN
        INSERT INTO alertas_stock (inventario_id, tipo, mensaje)
        VALUES (
            NEW.id,
            'stock_bajo',
            CONCAT('Stock bajo: Producto ID ', NEW.producto_id, ' - Stock actual: ', NEW.stock_actual)
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `logs_actividad`
--

DROP TABLE IF EXISTS `logs_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_actividad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `accion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tabla_afectada` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registro_id` int DEFAULT NULL,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logs_usuario` (`usuario_id`),
  KEY `idx_logs_fecha` (`created_at`),
  KEY `idx_logs_tabla` (`tabla_afectada`),
  CONSTRAINT `logs_actividad_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_actividad`
--

LOCK TABLES `logs_actividad` WRITE;
/*!40000 ALTER TABLE `logs_actividad` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs_actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marcas`
--

DROP TABLE IF EXISTS `marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marcas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `imagen` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`),
  UNIQUE KEY `nombre_56` (`nombre`),
  UNIQUE KEY `nombre_57` (`nombre`),
  UNIQUE KEY `nombre_58` (`nombre`),
  UNIQUE KEY `nombre_59` (`nombre`),
  UNIQUE KEY `nombre_60` (`nombre`),
  UNIQUE KEY `nombre_61` (`nombre`),
  UNIQUE KEY `nombre_62` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marcas`
--

LOCK TABLES `marcas` WRITE;
/*!40000 ALTER TABLE `marcas` DISABLE KEYS */;
INSERT INTO `marcas` VALUES (1,'DeWalt','Herramientas profesionales de alta calidad',1,'2025-06-06 15:32:28','2025-06-06 15:32:28','dewalt.png'),(2,'Black & Decker','Herramientas para el hogar y bricolaje',1,'2025-06-06 15:32:28','2025-06-06 15:32:28','black_decker.png'),(3,'Bosch','Tecnolog├¡a alemana en herramientas',1,'2025-06-06 15:32:28','2025-06-06 15:32:28','bosch.png'),(4,'Makita','Herramientas japonesas de precisi├│n',1,'2025-06-06 15:32:28','2025-06-06 15:32:28','makita.png'),(5,'Stanley','Herramientas manuales confiables',1,'2025-06-06 15:32:28','2025-06-06 15:32:28','stanley.png'),(6,'Generica','Marca gen├®rica para herramientas sin marca espec├¡fica',1,'2025-06-23 12:31:41','2025-06-23 12:31:41',NULL),(7,'Hyundai','Herramientas y equipos de la marca Hyundai',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(8,'Milwaukee','Herramientas el├®ctricas profesionales Milwaukee',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(9,'Ryobi','Herramientas para bricolaje Ryobi',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(10,'Hilti','Herramientas profesionales de construcci├│n Hilti',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(12,'Hitachi','Herramientas el├®ctricas Hitachi',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(13,'Festool','Herramientas profesionales de alta precisi├│n',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(14,'Metabo','Herramientas el├®ctricas Metabo',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL),(15,'Einhell','Herramientas para bricolaje Einhell',1,'2025-07-02 20:14:28','2025-07-02 20:14:28',NULL);
/*!40000 ALTER TABLE `marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodos_pago`
--

DROP TABLE IF EXISTS `metodos_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`),
  UNIQUE KEY `nombre_56` (`nombre`),
  UNIQUE KEY `nombre_57` (`nombre`),
  UNIQUE KEY `nombre_58` (`nombre`),
  UNIQUE KEY `nombre_59` (`nombre`),
  UNIQUE KEY `nombre_60` (`nombre`),
  UNIQUE KEY `nombre_61` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodos_pago`
--

LOCK TABLES `metodos_pago` WRITE;
/*!40000 ALTER TABLE `metodos_pago` DISABLE KEYS */;
INSERT INTO `metodos_pago` VALUES (1,'Webpay','Pagos online con tarjetas y billeteras digitales',1,'2025-06-06 15:32:33','2025-06-06 15:32:33'),(2,'Transferencia Bancaria','Transferencia bancaria directa',1,'2025-06-06 15:32:33','2025-06-06 15:32:33'),(3,'Efectivo','Pago en efectivo en tienda',1,'2025-06-06 15:32:33','2025-06-06 15:32:33'),(4,'Tarjeta de D├®bito','Pago con tarjeta de d├®bito en tienda',1,'2025-06-06 15:32:33','2025-06-06 15:32:33'),(5,'Tarjeta de Cr├®dito','Pago con tarjeta de cr├®dito',1,'2025-06-06 15:32:33','2025-06-06 15:32:33'),(6,'Transbank','Pago con Webpay/Transbank',1,'2025-07-01 13:26:27','2025-07-01 13:26:27');
/*!40000 ALTER TABLE `metodos_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientoinventarios`
--

DROP TABLE IF EXISTS `movimientoinventarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientoinventarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventarioId` int NOT NULL,
  `tipo` enum('ingreso','egreso','ajuste') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad` int NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuarioId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `inventarioId` (`inventarioId`),
  CONSTRAINT `movimientoinventarios_ibfk_1` FOREIGN KEY (`inventarioId`) REFERENCES `inventario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientoinventarios`
--

LOCK TABLES `movimientoinventarios` WRITE;
/*!40000 ALTER TABLE `movimientoinventarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientoinventarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimientos_inventario`
--

DROP TABLE IF EXISTS `movimientos_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_inventario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventario_id` int NOT NULL,
  `tipo` enum('entrada','salida','ajuste') COLLATE utf8mb4_unicode_ci NOT NULL,
  `cantidad` int NOT NULL,
  `stock_anterior` int NOT NULL,
  `stock_nuevo` int NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `usuario_id` int NOT NULL,
  `pedido_id` int DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `idx_inventario` (`inventario_id`),
  KEY `idx_tipo` (`tipo`),
  KEY `idx_fecha` (`fecha`),
  KEY `idx_usuario` (`usuario_id`),
  CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario` (`id`),
  CONSTRAINT `movimientos_inventario_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `movimientos_inventario_ibfk_3` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_inventario`
--

LOCK TABLES `movimientos_inventario` WRITE;
/*!40000 ALTER TABLE `movimientos_inventario` DISABLE KEYS */;
INSERT INTO `movimientos_inventario` VALUES (4,265,'entrada',50000,50005,100005,'Ingreso manual de stock','',3,NULL,'2025-07-01 02:11:54'),(5,266,'entrada',60,60,120,'Ingreso manual de stock','',3,NULL,'2025-07-01 02:12:05'),(6,265,'salida',-5,100005,100000,'Egreso manual de stock','',3,NULL,'2025-07-01 02:12:19'),(7,267,'entrada',40,40,80,'Ingreso manual de stock','',3,NULL,'2025-07-01 03:21:57'),(8,268,'entrada',6000,6000,12000,'Ingreso manual de stock','',3,NULL,'2025-07-01 03:26:49'),(9,267,'entrada',3000,3080,6080,'Ingreso manual de stock','',3,NULL,'2025-07-01 14:19:28'),(10,269,'entrada',4,4,8,'Ingreso manual de stock','',3,NULL,'2025-07-01 15:58:03'),(11,270,'entrada',9,9,18,'Ingreso manual de stock','',3,NULL,'2025-07-01 15:58:10'),(12,271,'entrada',100,100,200,'Ingreso manual de stock','',3,NULL,'2025-07-01 15:58:19'),(13,272,'entrada',40,40,80,'Ingreso manual de stock','',3,NULL,'2025-07-01 15:58:38'),(14,272,'salida',-1,80,79,'Egreso manual de stock','',3,NULL,'2025-07-01 15:58:54'),(15,273,'entrada',5,5,10,'Ingreso manual de stock','',3,NULL,'2025-07-01 15:59:13'),(16,274,'entrada',1,1,2,'Ingreso manual de stock','',3,NULL,'2025-07-01 16:13:39'),(17,274,'entrada',9,11,20,'Ingreso manual de stock','',3,NULL,'2025-07-01 16:14:02'),(18,275,'entrada',70,70,140,'Ingreso manual de stock','',3,NULL,'2025-07-01 19:45:13'),(19,4,'entrada',9,17,26,'Ingreso manual de stock','',3,NULL,'2025-07-01 19:46:14'),(20,275,'entrada',40,180,220,'Ingreso manual de stock','',3,NULL,'2025-07-01 19:52:01'),(21,276,'entrada',1,1,2,'Ingreso manual de stock','',3,NULL,'2025-07-01 19:56:39'),(22,277,'entrada',1,1,2,'Ingreso manual de stock','',3,NULL,'2025-07-01 19:59:11'),(23,265,'entrada',5,100005,100010,'Ingreso manual de stock','',3,NULL,'2025-07-01 20:04:07'),(24,265,'entrada',6,100016,100022,'Ingreso manual de stock','',3,NULL,'2025-07-01 20:04:19'),(25,265,'entrada',5,100027,100032,'Ingreso manual de stock','',3,NULL,'2025-07-01 20:06:24'),(26,278,'entrada',4,4,8,'Ingreso manual de stock','',3,NULL,'2025-07-03 01:19:59'),(27,276,'entrada',3,5,8,'Ingreso manual de stock','',3,NULL,'2025-07-03 01:20:14'),(28,277,'entrada',3,5,8,'Ingreso manual de stock','',3,NULL,'2025-07-03 01:56:29');
/*!40000 ALTER TABLE `movimientos_inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos`
--

DROP TABLE IF EXISTS `pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int DEFAULT NULL,
  `metodo_pago_id` int DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `estado` enum('pendiente','aprobado','rechazado','cancelado') COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  `referencia_externa` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
INSERT INTO `pagos` VALUES (1,16,6,107088.00,'aprobado',NULL,NULL,NULL,'2025-07-01 13:39:22','2025-07-01 13:39:22'),(2,19,6,26775.00,'aprobado','01ab198107bb4fe2e48f6430f4f6494ad95ddb97a2fec6dc591c2cd5c4424555',NULL,'2025-07-02 17:50:30','2025-07-02 17:50:30','2025-07-02 17:50:30'),(3,20,6,26180.00,'aprobado','01abea17f0d5cb4a0a81f6ec9b9a8bbf1c1b6b2aba587de1b8deba37e7ebe640',NULL,'2025-07-02 22:28:10','2025-07-02 22:28:10','2025-07-02 22:28:10'),(4,21,6,18328.00,'aprobado','01ab5a595982961a6992c151dfaa0d6ef02837dfbb5a908ae516b4011ddd643e',NULL,'2025-07-03 00:59:39','2025-07-03 00:59:39','2025-07-03 00:59:39');
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_pedido` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado','preparando','listo','enviado','entregado','cancelado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `subtotal` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_entrega` enum('retiro_tienda','despacho_domicilio') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'retiro_tienda',
  `direccion_entrega` text COLLATE utf8mb4_unicode_ci,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `cliente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_pedido` (`numero_pedido`),
  UNIQUE KEY `numero_pedido_2` (`numero_pedido`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'PED-110013-428',3,'pendiente',50000.00,50000.00,'despacho_domicilio','Av. Providencia 123',NULL,'2025-06-06 17:01:50','2025-06-06 17:01:50',NULL),(2,'ORD-1750862478717',1,'pendiente',219200.00,219200.00,'despacho_domicilio','ega├▒a','','2025-06-25 11:41:18','2025-06-25 11:41:18',NULL),(3,'ORD-1750870892916',9,'pendiente',647600.00,647600.00,'despacho_domicilio','ega├▒a','','2025-06-25 14:01:32','2025-06-25 14:01:32',NULL),(4,'ORD-1750982203344',9,'pendiente',90440.00,90440.00,'retiro_tienda','ega├▒a','','2025-06-26 20:56:43','2025-06-26 20:56:43',NULL),(5,'ORD-1751072345919',3,'pendiente',221580.00,221580.00,'despacho_domicilio','ega├▒a','','2025-06-27 21:59:05','2025-06-27 21:59:05',NULL),(6,'ORD-1751243745117',3,'pendiente',231100.00,231100.00,'despacho_domicilio','ega├▒a','','2025-06-30 00:35:45','2025-06-30 00:35:45',NULL),(7,'PED-2024-001',1,'entregado',250000.00,253990.00,'despacho_domicilio','Av. Providencia 1234, Providencia, Santiago','Entregar en horario de oficina','2025-06-27 04:47:32','2025-06-30 01:23:05',NULL),(8,'PED-2024-002',2,'enviado',220000.00,220000.00,'retiro_tienda',NULL,NULL,'2025-06-27 21:51:50','2025-06-30 01:23:05',NULL),(9,'PED-2024-003',3,'preparando',150000.00,155990.00,'despacho_domicilio','Calle Las Condes 890, Las Condes, Santiago','Productos para proyecto de construcci├│n','2025-06-27 16:34:13','2025-06-30 01:23:05',NULL),(10,'PED-2024-004',1,'pendiente',85000.00,90990.00,'despacho_domicilio','Av. Apoquindo 4567, Las Condes, Santiago','Entregar antes del mediod├¡a','2025-06-25 09:03:11','2025-06-30 01:23:05',NULL),(11,'PED-2024-005',2,'aprobado',300000.00,300000.00,'retiro_tienda',NULL,NULL,'2025-06-29 16:30:36','2025-06-30 01:23:05',NULL),(12,'ORD-1751248488142',3,'pendiente',219200.00,219200.00,'despacho_domicilio','ega├▒a','','2025-06-30 01:54:48','2025-06-30 01:54:48',NULL),(13,'ORD-1751375712277',3,'pendiente',112088.00,112088.00,'despacho_domicilio','ega├▒a','','2025-07-01 13:15:12','2025-07-01 13:15:12',NULL),(14,'ORD-1751376045253',3,'pendiente',112088.00,112088.00,'despacho_domicilio','ega├▒a','','2025-07-01 13:20:45','2025-07-01 13:20:45',NULL),(15,'ORD-1751376624235',3,'pendiente',214176.00,214176.00,'retiro_tienda','ega├▒a','','2025-07-01 13:30:24','2025-07-01 13:30:24',NULL),(16,'ORD-1751377127162',3,'aprobado',107088.00,107088.00,'retiro_tienda','ega├▒a','','2025-07-01 13:38:47','2025-07-01 13:39:22',NULL),(17,'ORD-1751430730526',3,'pendiente',26775.00,26775.00,'retiro_tienda','ega├▒a','','2025-07-02 04:32:10','2025-07-02 04:32:10',NULL),(18,'ORD-1751476643577',3,'pendiente',58550.00,58550.00,'despacho_domicilio','ega├▒a','','2025-07-02 17:17:23','2025-07-02 17:17:23',NULL),(19,'ORD-1751477205485',3,'aprobado',26775.00,26775.00,'retiro_tienda','ega├▒a','','2025-07-02 17:26:45','2025-07-02 17:50:30',NULL),(20,'ORD-1751495265058',3,'aprobado',26180.00,26180.00,'retiro_tienda','cruz de los mares','','2025-07-02 22:27:45','2025-07-02 22:28:10',NULL),(21,'ORD-1751504349554',3,'aprobado',18328.00,18328.00,'despacho_domicilio','ega├▒a','','2025-07-03 00:59:09','2025-07-03 00:59:39',NULL),(22,'ORD-1751507993341',3,'pendiente',93346.00,93346.00,'despacho_domicilio','ega├▒a','','2025-07-03 01:59:53','2025-07-03 01:59:53',NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_imagenes`
--

DROP TABLE IF EXISTS `producto_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_imagenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `url_imagen` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_principal` tinyint(1) DEFAULT '0',
  `orden` int DEFAULT '0',
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_producto_imagenes_producto` (`producto_id`),
  CONSTRAINT `producto_imagenes_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_imagenes`
--

LOCK TABLES `producto_imagenes` WRITE;
/*!40000 ALTER TABLE `producto_imagenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `codigo_sku` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria_id` int NOT NULL,
  `marca_id` int NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `imagen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ficha_tecnica` json DEFAULT NULL,
  `descuento` decimal(5,2) NOT NULL DEFAULT '0.00',
  `voltaje` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `peso` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dimensiones` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `potencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `velocidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `torque` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bateria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_carga` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_ruido` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificaciones` text COLLATE utf8mb4_unicode_ci,
  `archivo_ficha_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marca` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `garantia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_sku` (`codigo_sku`),
  UNIQUE KEY `codigo_sku_2` (`codigo_sku`),
  KEY `categoria_id` (`categoria_id`),
  KEY `marca_id` (`marca_id`),
  CONSTRAINT `productos_ibfk_123` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_124` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (3,'Lijadora Orbital Makita','Lijadora orbital de 200W con sistema de aspiraci├│n de polvo',45990.00,0,'MKT-LIJ-ORB-001',1,4,1,'2025-06-06 15:32:46','2025-07-01 17:19:27','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(73,'Taladro Percutor DeWalt 10V','Taladro percutor inal├ímbrico de 20V con bater├¡a de litio, ideal para trabajos profesionales',89990.00,15,'TAL-DEW-20V-001',1,1,1,'2025-06-30 20:52:35','2025-07-02 19:59:03','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"ruta\": \"/uploads/fichas_tecnicas/ficha-1751342680634-177040361.pdf\", \"nombre\": \"cotizacion-COT-1750117196381 (5).pdf\", \"archivo\": \"ficha-1751342680634-177040361.pdf\", \"mimetype\": \"application/pdf\", \"materiales\": \"fierro\", \"dimensiones\": \"104\", \"fecha_subida\": \"2025-07-01T04:04:40.651Z\", \"caracteristicas\": \"pesado\"}',60.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(74,'Sierra Circular Bosch 1900W','Sierra circular profesional de 1900W con hoja de 190mm, perfecta para cortes precisos',125000.00,8,'SIE-BOS-1900W-001',1,3,1,'2025-06-30 20:52:35','2025-07-01 20:20:20','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"ruta\": \"/uploads/fichas_tecnicas/ficha-1751401220457-950922434.pdf\", \"nombre\": \"Hoja de c├â┬ílculo sin t├â┬¡tulo - Hoja 1 (1).pdf\", \"archivo\": \"ficha-1751401220457-950922434.pdf\", \"mimetype\": \"application/pdf\", \"fecha_subida\": \"2025-07-01T20:20:20.464Z\"}',20.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(75,'Lijadora Orbital Makita 5\"','Lijadora orbital de 5 pulgadas con sistema de extracci├│n de polvo, velocidad variable',75000.00,12,'LIJ-MAK-5-001',1,4,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(76,'Atornillador Black & Decker 12V','Atornillador inal├ímbrico de 12V con 20 posiciones de torque, ideal para bricolaje',45000.00,20,'ATO-BLA-12V-001',1,2,1,'2025-06-30 20:52:35','2025-07-03 01:08:01','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,15.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(77,'Esmeriladora Stanley 4.5\"','Esmeriladora angular de 4.5 pulgadas con motor de 850W, para corte y desbaste',55000.00,10,'ESM-STA-4.5-001',1,5,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(78,'Martillo Stanley 16oz','Martillo de carpintero de 16 onzas con mango de fibra de vidrio, cabeza forjada',25000.00,25,'MAR-STA-16OZ-001',2,5,1,'2025-06-30 20:52:35','2025-07-02 22:48:50','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"FIERRO\", \"dimensiones\": \"400\", \"caracteristicas\": \"PESADO\"}',10.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(79,'Set Destornilladores DeWalt 6pc','Set de 6 destornilladores profesionales con puntas magn├®ticas y mangos ergon├│micos',35000.00,18,'SET-DEW-6PC-001',2,1,1,'2025-06-30 20:52:35','2025-07-03 00:16:53','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"METAL\", \"dimensiones\": \"500\", \"caracteristicas\": \"PESADO\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(80,'Llave Ajustable Bosch 12\"','Llave ajustable de 12 pulgadas con mand├¡bula m├│vil, acabado cromado',28000.00,15,'LLA-BOS-12-001',2,3,1,'2025-06-30 20:52:35','2025-07-03 00:22:54','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"metal muy reforzado\", \"dimensiones\": \"29x1\", \"caracteristicas\": \"LLAVE AJUSTABLE\"}',60.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(81,'Alicate Universal Makita','Alicate universal de 8 pulgadas con cortador integrado, mango aislado',22000.00,22,'ALI-MAK-8-001',2,4,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(82,'Nivel de Burbuja Black & Decker 24\"','Nivel de burbuja de 24 pulgadas con 3 viales, marco de aluminio',18000.00,30,'NIV-BLA-24-001',2,2,1,'2025-06-30 20:52:35','2025-07-02 13:45:03','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,60.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(83,'Carretilla Stanley 6 pies','Carretilla de construcci├│n de 6 pies c├║bicos con llanta neum├ítica, estructura reforzada',45000.00,8,'CAR-STA-6P-001',3,5,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,25.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(84,'Paleta de Alba├▒il DeWalt','Paleta de alba├▒il de acero templado con mango ergon├│mico, tama├▒o est├índar',15000.00,35,'PAL-DEW-ALB-001',3,1,1,'2025-06-30 20:52:35','2025-07-02 13:45:16','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,90.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(85,'Cubo de Construcci├│n Bosch 20L','Cubo de construcci├│n de 20 litros con asa reforzada, material resistente',12000.00,40,'CUB-BOS-20L-001',3,3,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(86,'Cinta M├®trica Makita 5m','Cinta m├®trica de 5 metros con cierre autom├ítico, carcasa resistente',8000.00,50,'CIN-MAK-5M-001',3,4,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(87,'Escalera Black & Decker 6 escalones','Escalera de aluminio de 6 escalones con plataforma de trabajo, plegable',85000.00,6,'ESC-BLA-6E-001',3,2,1,'2025-06-30 20:52:35','2025-07-03 01:58:33','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,30.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(88,'Cortadora de C├®sped Stanley','Cortadora de c├®sped manual de 16 pulgadas con altura ajustable, cuchillas de acero',95000.00,5,'COR-STA-CES-001',4,5,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,30.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(89,'Manguera DeWalt 25m','Manguera de jard├¡n de 25 metros con refuerzo de malla, resistente a la presi├│n',35000.00,12,'MAN-DEW-25M-001',4,1,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(90,'Tijera de Podar Bosch','Tijera de podar profesional con hojas de acero inoxidable, mango ergon├│mico',28000.00,15,'TIJ-BOS-POD-001',4,3,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(91,'Rastrillo Makita 16 dientes','Rastrillo de jard├¡n de 16 dientes con mango de madera, ideal para hojas',18000.00,20,'RAS-MAK-16D-001',4,4,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(92,'Pala de Jard├¡n Black & Decker','Pala de jard├¡n con punta redondeada y mango de fibra de vidrio',22000.00,18,'PAL-BLA-JAR-001',4,2,1,'2025-06-30 20:52:35','2025-07-03 00:35:29','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,30.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(93,'Casco de Seguridad Stanley','Casco de seguridad industrial con ajuste autom├ítico, certificado ANSI',25000.00,25,'CAS-STA-SEG-001',5,5,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(94,'Guantes de Trabajo DeWalt','Guantes de trabajo resistentes con palma de cuero, talla L',15000.00,40,'GUA-DEW-TRA-001',5,1,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(95,'Gafas de Seguridad Bosch','Gafas de seguridad con protecci├│n UV y anti-rayado, marco flexible',12000.00,35,'GAF-BOS-SEG-001',5,3,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(96,'Botas de Seguridad Makita','Botas de seguridad con punta de acero, suela antideslizante, talla 42',65000.00,10,'BOT-MAK-SEG-001',5,4,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(97,'Chaleco Reflectante Black & Decker','Chaleco de seguridad reflectante con cierre de velcro, talla ├║nica',18000.00,30,'CHA-BLA-REF-001',5,2,1,'2025-06-30 20:52:35','2025-07-03 00:35:43','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,20.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(98,'Cinta Aislante Gen├®rica 20m','Cinta aislante de 20 metros, resistencia 600V, color negro',5000.00,60,'CIN-GEN-20M-001',1,6,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(99,'Tornillos Phillips Gen├®ricos 100pc','Set de 100 tornillos Phillips cabeza plana, 3x20mm, acero galvanizado',8000.00,45,'TOR-GEN-100PC-001',2,6,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(100,'Cemento Portland Gen├®rico 25kg','Cemento Portland tipo I, bolsa de 25kg, ideal para construcci├│n',12000.00,20,'CEM-GEN-25KG-001',3,6,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(101,'Semillas de Tomate Gen├®ricas','Semillas de tomate h├¡brido, paquete de 50 semillas, alta producci├│n',3000.00,80,'SEM-GEN-TOM-001',4,6,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(102,'Mascarilla Desechable Gen├®rica','Mascarilla desechable de 3 capas, caja de 50 unidades',15000.00,100,'MAS-GEN-50U-001',5,6,1,'2025-06-30 20:52:35','2025-06-30 20:52:35','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop',NULL,0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(103,'Taladro Percutor DeWalt 20V','Taladro percutor inal├ímbrico de 20V, ideal para trabajos de perforaci├│n en concreto, madera y metal. Incluye bater├¡a y cargador.',20000.00,0,'DW20V-001',1,1,1,'2025-07-02 19:48:42','2025-07-02 19:58:50','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"fierro\", \"dimensiones\": \"102\", \"caracteristicas\": \"muy pesado\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(104,'Taladro Percutor Bosch','Taladro percutor con velocidad variable y reversa.',64990.00,0,'BOS-TAL001',1,1,1,'2025-07-02 20:07:27','2025-07-03 01:55:51','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"Metal y pl├ístico\", \"dimensiones\": \"30x25x10 cm\", \"caracteristicas\": \"Velocidad variable, reversa, mandril de 13mm\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(105,'Sierra Circular DeWalt','Sierra circular 7 1/4\'\' con potente motor de 1800W.',89990.00,0,'DEW-SIE002',1,2,1,'2025-07-02 20:07:27','2025-07-03 01:55:51','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"Aluminio y acero\", \"dimensiones\": \"35x30x20 cm\", \"caracteristicas\": \"Motor 1800W, gu├¡a de corte, protector de hoja\"}',30.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(106,'Martillo Stanley 16oz','Martillo de acero forjado con mango antideslizante.',15990.00,0,'STA-MAR003',2,3,1,'2025-07-02 20:07:27','2025-07-03 01:55:51','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"Acero\", \"dimensiones\": \"33x13x3 cm\", \"caracteristicas\": \"Mango ergon├│mico, cabeza pulida, resistente a impactos\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(107,'Lijadora Orbital Makita','Lijadora profesional para acabados finos y r├ípidos.',45990.00,0,'MAK-LIJ004',1,4,1,'2025-07-02 20:07:27','2025-07-03 01:55:51','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"Pl├ístico y metal\", \"dimensiones\": \"28x12x10 cm\", \"caracteristicas\": \"Placa base met├ílica, bolsa recolectora de polvo\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(108,'Atornillador Inal├ímbrico Black+Decker','Atornillador inal├ímbrico con bater├¡a de litio.',32990.00,0,'BLD-ATO005',1,5,1,'2025-07-02 20:07:27','2025-07-03 01:55:51','https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=400&fit=crop','{\"materiales\": \"Pl├ístico reforzado\", \"dimensiones\": \"20x15x6 cm\", \"caracteristicas\": \"Bater├¡a 12V, luz LED, dise├▒o compacto\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(114,'Nivel L├íser Bosch','Nivel l├íser autonivelante de l├¡neas cruzadas.',74990.00,0,'BOS-NIV012',5,1,1,'2025-07-03 00:16:12','2025-07-03 00:22:20',NULL,'{\"materiales\": \"Pl├ístico ABS, vidrio ├│ptico\", \"dimensiones\": \"10x6x10 cm\", \"caracteristicas\": \"Alcance 10m, base magn├®tica, incluye estuche\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(115,'Pistola de Calor Makita','Pistola de calor con control de temperatura.',38990.00,0,'MAK-PIS013',6,4,1,'2025-07-03 00:16:12','2025-07-03 00:22:20',NULL,'{\"materiales\": \"Pl├ístico y acero\", \"dimensiones\": \"25x20x10 cm\", \"caracteristicas\": \"2 niveles de calor, mango ergon├│mico\"}',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion_categorias`
--

DROP TABLE IF EXISTS `promocion_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion_categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promocion_categoria` (`promocion_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  KEY `idx_promocion_categorias_promocion` (`promocion_id`),
  CONSTRAINT `promocion_categorias_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promocion_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion_categorias`
--

LOCK TABLES `promocion_categorias` WRITE;
/*!40000 ALTER TABLE `promocion_categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `promocion_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion_marcas`
--

DROP TABLE IF EXISTS `promocion_marcas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion_marcas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `marca_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promocion_marca` (`promocion_id`,`marca_id`),
  KEY `marca_id` (`marca_id`),
  KEY `idx_promocion_marcas_promocion` (`promocion_id`),
  CONSTRAINT `promocion_marcas_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promocion_marcas_ibfk_2` FOREIGN KEY (`marca_id`) REFERENCES `marcas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion_marcas`
--

LOCK TABLES `promocion_marcas` WRITE;
/*!40000 ALTER TABLE `promocion_marcas` DISABLE KEYS */;
/*!40000 ALTER TABLE `promocion_marcas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promocion_productos`
--

DROP TABLE IF EXISTS `promocion_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promocion_productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promocion_producto` (`promocion_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  KEY `idx_promocion_productos_promocion` (`promocion_id`),
  CONSTRAINT `promocion_productos_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promocion_productos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promocion_productos`
--

LOCK TABLES `promocion_productos` WRITE;
/*!40000 ALTER TABLE `promocion_productos` DISABLE KEYS */;
INSERT INTO `promocion_productos` VALUES (32,39,73,'2025-07-01 19:05:27'),(33,40,74,'2025-07-01 19:46:52'),(34,41,75,'2025-07-01 19:47:13'),(35,42,75,'2025-07-01 19:47:35'),(38,45,77,'2025-07-02 01:57:13'),(39,46,77,'2025-07-02 01:57:23'),(40,47,77,'2025-07-02 01:57:47'),(42,49,77,'2025-07-02 02:01:12'),(45,51,77,'2025-07-02 02:08:02'),(46,52,77,'2025-07-02 02:09:06'),(47,53,77,'2025-07-02 02:17:51'),(48,54,76,'2025-07-02 02:18:33'),(49,55,76,'2025-07-02 02:24:10'),(50,56,76,'2025-07-02 03:40:04'),(51,44,81,'2025-07-02 04:30:11'),(52,44,96,'2025-07-02 04:30:56'),(53,42,83,'2025-07-02 04:34:25'),(54,45,81,'2025-07-02 05:00:12'),(55,46,93,'2025-07-02 05:01:11'),(56,44,100,'2025-07-02 12:51:51'),(57,68,73,'2025-07-02 16:13:27'),(58,69,73,'2025-07-02 16:37:36'),(59,70,73,'2025-07-02 16:38:34');
/*!40000 ALTER TABLE `promocion_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones`
--

DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `codigo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` enum('porcentaje','monto_fijo','envio_gratis') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT '0.00',
  `monto_minimo` decimal(10,2) DEFAULT '0.00',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `codigo_cupon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minimo_compra` decimal(10,2) DEFAULT '0.00',
  `maximo_descuento` decimal(10,2) DEFAULT NULL,
  `limite_usos` int DEFAULT NULL,
  `estado` enum('activa','inactiva','programada','finalizada') COLLATE utf8mb4_unicode_ci DEFAULT 'activa',
  `aplicable_a` enum('todos','productos','categorias') COLLATE utf8mb4_unicode_ci DEFAULT 'todos',
  `usos_totales` int DEFAULT '0',
  `usos_limite` int DEFAULT NULL,
  `usos_actuales` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tipo_descuento` enum('porcentaje','fijo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'porcentaje',
  `valor_descuento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `codigo_cupon` (`codigo_cupon`),
  KEY `idx_codigo` (`codigo`),
  KEY `idx_estado` (`estado`),
  KEY `idx_fechas` (`fecha_inicio`,`fecha_fin`),
  KEY `idx_tipo` (`tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones`
--

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
INSERT INTO `promociones` VALUES (39,'Promoci├│n Taladro Percutor DeWalt 20V','Descuento especial para Taladro Percutor DeWalt 20V',NULL,'porcentaje',0.00,0.00,'2025-07-01','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 15:05:27','2025-07-01 15:05:27','porcentaje',20.00,1),(40,'Promoci├│n Sierra Circular Bosch 1900W','Descuento especial para Sierra Circular Bosch 1900W',NULL,'porcentaje',0.00,0.00,'2025-07-01','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 15:46:52','2025-07-01 15:46:52','porcentaje',50.00,1),(41,'Promoci├│n Lijadora Orbital Makita 5\"','Descuento especial para Lijadora Orbital Makita 5\"',NULL,'porcentaje',0.00,0.00,'2025-07-01','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 15:47:12','2025-07-01 15:47:12','porcentaje',15.00,1),(42,'Promoci├│n Lijadora Orbital Makita 5\"','Descuento especial para Lijadora Orbital Makita 5\"',NULL,'porcentaje',0.00,0.00,'2025-07-01','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 15:47:35','2025-07-01 15:47:35','porcentaje',30.00,1),(44,'Promoci├│n Atornillador Black & Decker 12V','Descuento especial para Atornillador Black & Decker 12V',NULL,'porcentaje',0.00,0.00,'2025-07-01','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 15:51:23','2025-07-01 15:51:23','porcentaje',40.00,1),(45,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"',NULL,'porcentaje',0.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 21:57:13','2025-07-01 21:57:13','porcentaje',25.00,1),(46,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"',NULL,'porcentaje',0.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 21:57:23','2025-07-01 21:57:23','porcentaje',25.00,1),(47,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"',NULL,'porcentaje',0.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 21:57:47','2025-07-01 21:57:47','porcentaje',15.00,1),(49,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"','PROMO_1751421672417_ZHMR1','porcentaje',20.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:01:12','2025-07-01 22:01:12','porcentaje',20.00,1),(51,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"','PROMO_1751422082366_BUU22','porcentaje',48.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:08:02','2025-07-01 22:08:02','porcentaje',48.00,1),(52,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"','PROMO_1751422146060_QKFF6','porcentaje',40.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:09:06','2025-07-01 22:09:06','porcentaje',40.00,1),(53,'Promoci├│n Esmeriladora Stanley 4.5\"','Descuento especial para Esmeriladora Stanley 4.5\"','PROMO_1751422671116_OJY1R','porcentaje',40.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:17:51','2025-07-01 22:17:51','porcentaje',40.00,1),(54,'Promoci├│n Atornillador Black & Decker 12V','Descuento especial para Atornillador Black & Decker 12V','PROMO_1751422713184_8ROD9','porcentaje',20.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:18:33','2025-07-01 22:18:33','porcentaje',20.00,1),(55,'Promoci├│n Atornillador Black & Decker 12V','Descuento especial para Atornillador Black & Decker 12V','PROMO_1751423050863_XJXWZ','porcentaje',40.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 22:24:10','2025-07-01 22:24:10','porcentaje',40.00,1),(56,'Promoci├│n Atornillador Black & Decker 12V','Descuento especial para Atornillador Black & Decker 12V','PROMO_1751427604002_TOEIP','porcentaje',50.00,0.00,'2025-07-02','2025-08-01',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-01 23:40:04','2025-07-01 23:40:04','porcentaje',50.00,1),(67,'BLACK','BLACK','BLACK','porcentaje',40.00,0.00,'2025-07-15','2025-08-07',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-02 14:51:33','2025-07-02 14:51:33','porcentaje',0.00,1),(68,'Promo Taladro Percutor DeWalt 20V','',NULL,'porcentaje',0.00,0.00,'2025-08-07','2025-07-31',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-02 12:13:27','2025-07-02 12:13:27','porcentaje',40.00,1),(69,'Promo Taladro Percutor DeWalt 20V','promo de taladro',NULL,'porcentaje',0.00,0.00,'2025-07-15','2025-07-10',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-02 12:37:36','2025-07-02 12:37:36','porcentaje',30.00,1),(70,'Promo Taladro Percutor DeWalt 20V','promo taladro',NULL,'porcentaje',0.00,0.00,'2025-07-08','2025-07-10',NULL,0.00,NULL,NULL,'activa','todos',0,NULL,0,'2025-07-02 12:38:34','2025-07-02 12:38:34','porcentaje',30.00,1);
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones_categorias`
--

DROP TABLE IF EXISTS `promociones_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones_categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promocion_categoria` (`promocion_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `promociones_categorias_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promociones_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones_categorias`
--

LOCK TABLES `promociones_categorias` WRITE;
/*!40000 ALTER TABLE `promociones_categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `promociones_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones_productos`
--

DROP TABLE IF EXISTS `promociones_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones_productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_promocion_producto` (`promocion_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `promociones_productos_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promociones_productos_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones_productos`
--

LOCK TABLES `promociones_productos` WRITE;
/*!40000 ALTER TABLE `promociones_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `promociones_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promociones_usadas`
--

DROP TABLE IF EXISTS `promociones_usadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promociones_usadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promocion_id` int NOT NULL,
  `pedido_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `descuento_aplicado` decimal(10,2) DEFAULT '0.00',
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `promocion_id` (`promocion_id`),
  CONSTRAINT `promociones_usadas_ibfk_1` FOREIGN KEY (`promocion_id`) REFERENCES `promociones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promociones_usadas`
--

LOCK TABLES `promociones_usadas` WRITE;
/*!40000 ALTER TABLE `promociones_usadas` DISABLE KEYS */;
/*!40000 ALTER TABLE `promociones_usadas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rut` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `contacto_nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contacto_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  KEY `idx_rut` (`rut`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reglas_descuento`
--

DROP TABLE IF EXISTS `reglas_descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reglas_descuento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('porcentaje','monto_fijo') COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `activa` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fechas` (`fecha_inicio`,`fecha_fin`),
  KEY `idx_activa` (`activa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reglas_descuento`
--

LOCK TABLES `reglas_descuento` WRITE;
/*!40000 ALTER TABLE `reglas_descuento` DISABLE KEYS */;
/*!40000 ALTER TABLE `reglas_descuento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas_stock`
--

DROP TABLE IF EXISTS `reservas_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `cantidad_reservada` int NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referencia_id` int DEFAULT NULL,
  `expira_at` timestamp NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `reservas_stock_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas_stock`
--

LOCK TABLES `reservas_stock` WRITE;
/*!40000 ALTER TABLE `reservas_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `nombre_2` (`nombre`),
  UNIQUE KEY `nombre_3` (`nombre`),
  UNIQUE KEY `nombre_4` (`nombre`),
  UNIQUE KEY `nombre_5` (`nombre`),
  UNIQUE KEY `nombre_6` (`nombre`),
  UNIQUE KEY `nombre_7` (`nombre`),
  UNIQUE KEY `nombre_8` (`nombre`),
  UNIQUE KEY `nombre_9` (`nombre`),
  UNIQUE KEY `nombre_10` (`nombre`),
  UNIQUE KEY `nombre_11` (`nombre`),
  UNIQUE KEY `nombre_12` (`nombre`),
  UNIQUE KEY `nombre_13` (`nombre`),
  UNIQUE KEY `nombre_14` (`nombre`),
  UNIQUE KEY `nombre_15` (`nombre`),
  UNIQUE KEY `nombre_16` (`nombre`),
  UNIQUE KEY `nombre_17` (`nombre`),
  UNIQUE KEY `nombre_18` (`nombre`),
  UNIQUE KEY `nombre_19` (`nombre`),
  UNIQUE KEY `nombre_20` (`nombre`),
  UNIQUE KEY `nombre_21` (`nombre`),
  UNIQUE KEY `nombre_22` (`nombre`),
  UNIQUE KEY `nombre_23` (`nombre`),
  UNIQUE KEY `nombre_24` (`nombre`),
  UNIQUE KEY `nombre_25` (`nombre`),
  UNIQUE KEY `nombre_26` (`nombre`),
  UNIQUE KEY `nombre_27` (`nombre`),
  UNIQUE KEY `nombre_28` (`nombre`),
  UNIQUE KEY `nombre_29` (`nombre`),
  UNIQUE KEY `nombre_30` (`nombre`),
  UNIQUE KEY `nombre_31` (`nombre`),
  UNIQUE KEY `nombre_32` (`nombre`),
  UNIQUE KEY `nombre_33` (`nombre`),
  UNIQUE KEY `nombre_34` (`nombre`),
  UNIQUE KEY `nombre_35` (`nombre`),
  UNIQUE KEY `nombre_36` (`nombre`),
  UNIQUE KEY `nombre_37` (`nombre`),
  UNIQUE KEY `nombre_38` (`nombre`),
  UNIQUE KEY `nombre_39` (`nombre`),
  UNIQUE KEY `nombre_40` (`nombre`),
  UNIQUE KEY `nombre_41` (`nombre`),
  UNIQUE KEY `nombre_42` (`nombre`),
  UNIQUE KEY `nombre_43` (`nombre`),
  UNIQUE KEY `nombre_44` (`nombre`),
  UNIQUE KEY `nombre_45` (`nombre`),
  UNIQUE KEY `nombre_46` (`nombre`),
  UNIQUE KEY `nombre_47` (`nombre`),
  UNIQUE KEY `nombre_48` (`nombre`),
  UNIQUE KEY `nombre_49` (`nombre`),
  UNIQUE KEY `nombre_50` (`nombre`),
  UNIQUE KEY `nombre_51` (`nombre`),
  UNIQUE KEY `nombre_52` (`nombre`),
  UNIQUE KEY `nombre_53` (`nombre`),
  UNIQUE KEY `nombre_54` (`nombre`),
  UNIQUE KEY `nombre_55` (`nombre`),
  UNIQUE KEY `nombre_56` (`nombre`),
  UNIQUE KEY `nombre_57` (`nombre`),
  UNIQUE KEY `nombre_58` (`nombre`),
  UNIQUE KEY `nombre_59` (`nombre`),
  UNIQUE KEY `nombre_60` (`nombre`),
  UNIQUE KEY `nombre_61` (`nombre`),
  UNIQUE KEY `nombre_62` (`nombre`),
  UNIQUE KEY `nombre_63` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'administrador','Administrador del sistema con acceso completo','2025-06-06 15:32:09','2025-06-06 15:32:09'),(2,'cliente','Cliente de la tienda online','2025-06-06 15:32:09','2025-06-06 15:32:09'),(3,'vendedor','Vendedor encargado de gestionar pedidos','2025-06-06 15:32:09','2025-06-06 15:32:09'),(4,'bodeguero','Encargado de bodega y inventario','2025-06-06 15:32:09','2025-06-06 15:32:09'),(5,'contador','Contador encargado de finanzas y reportes','2025-06-06 15:32:09','2025-06-06 15:32:09');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20240608-create-movimiento-inventario.js'),('20240609-add-descuento-to-productos.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursales`
--

DROP TABLE IF EXISTS `sucursales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `activa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursales`
--

LOCK TABLES `sucursales` WRITE;
/*!40000 ALTER TABLE `sucursales` DISABLE KEYS */;
INSERT INTO `sucursales` VALUES (1,'FERREMAS Centro','Av. Libertador Bernardo O\'Higgins 123, Santiago Centro','+56912345678','centro@ferremas.cl','2025-06-06 15:32:15','2025-06-06 15:32:15',1),(2,'FERREMAS Las Condes','Av. Apoquindo 456, Las Condes','+56987654321','lascondes@ferremas.cl','2025-06-06 15:32:15','2025-06-06 15:32:15',1),(3,'FERREMAS Maip├║','Av. Am├®rico Vespucio 789, Maip├║','+56955667788','maipu@ferremas.cl','2025-06-06 15:32:15','2025-06-06 15:32:15',1);
/*!40000 ALTER TABLE `sucursales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol_id` int NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `rut` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  UNIQUE KEY `email_61` (`email`),
  UNIQUE KEY `email_62` (`email`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador Actualizado','admin.nuevo@ferremas.cl','$2a$10$U1/thbpxaok0ULh4UyyjTe3AzZejJszoPzg5nbAo3xhSI3MGd9W4m',1,1,'2025-06-06 15:40:44','2025-06-06 15:53:26',NULL),(2,'admin','catasoledad256@gmail.com','$2b$10$QEy8C9/UnsWfTV1nqKbMKuU2u./OHgusKTv18ys7dWep.6octNy6.',1,1,'2025-06-06 15:40:44','2025-06-06 15:40:44',NULL),(3,'Administrador FERREMAS','admin@ferremas.cl','$2a$10$F6t24XcvreE27i6GrfOWlOXX5CCu7Lixln0G5cEwwnUW9V3l2D1qW',1,1,'2025-06-06 16:13:34','2025-07-01 02:04:52',NULL),(7,'Catalina C.','cjcatalinac@gmail.com','$2b$10$HWXOF.O2df3zAXF7Kmv8WOnmod8S9bnvd9gSTUOaqqg591b9dkKhO',2,1,'2025-06-12 20:53:53','2025-06-12 20:53:53',NULL),(8,'Ferremas Nueva','ferremasnueva@ferremas.cl','$2b$10$98sVt4WeHK2/42kGQn0REu7ceZEOazXd.w8RfLs/gJPPfWAReX9sy',2,1,'2025-06-18 13:30:44','2025-06-18 13:30:44',NULL),(9,'cata','catasoledad2@gmail.com','$2b$10$lr2LUu4xRX.NbY2F0IwWx.VlJMzJzd/47/BQvt.pHX5t/S0PrkfJ.',2,1,'2025-06-25 12:21:22','2025-06-30 03:22:45',NULL),(11,'cata','catasoledad6@gmail.com','$2a$10$1UmiNLzyxkERkPMaUPZjkOQ.AUa7/O8L0IdKV.lw5URsB5kgoY/XK',2,1,'2025-07-03 01:52:15','2025-07-03 01:52:15',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhook_logs`
--

DROP TABLE IF EXISTS `webhook_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhook_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `webhook_id` int NOT NULL,
  `evento` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` json DEFAULT NULL,
  `response_status` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_webhook_logs_webhook` (`webhook_id`),
  KEY `idx_webhook_logs_fecha` (`created_at`),
  CONSTRAINT `webhook_logs_ibfk_1` FOREIGN KEY (`webhook_id`) REFERENCES `webhooks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhook_logs`
--

LOCK TABLES `webhook_logs` WRITE;
/*!40000 ALTER TABLE `webhook_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhook_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhooks`
--

DROP TABLE IF EXISTS `webhooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `webhooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eventos` json NOT NULL,
  `secret` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhooks`
--

LOCK TABLES `webhooks` WRITE;
/*!40000 ALTER TABLE `webhooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhooks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02 23:08:20
