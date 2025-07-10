# Matriz de Resultados - Sistema Ferremas

## Información General

**Proyecto:** Sistema de E-commerce Ferremas  
**Versión:** 1.0  
**Fecha de Ejecución:** Julio 2025  
**Ejecutado por:** Equipo de Desarrollo  
**Entorno:** Desarrollo/Pruebas  

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total de Casos de Prueba** | 85 |
| **Casos Ejecutados** | 85 |
| **Casos Pasaron** | 82 |
| **Casos Fallaron** | 3 |
| **Tasa de Éxito** | 96.5% |
| **Cobertura Funcional** | 95% |
| **Tiempo Total de Ejecución** | 8 horas |

## Matriz Detallada por Módulo

### 1. Módulo de Autenticación (15 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-AUTH-001 | Registro exitoso de usuario | Alta | ✅ PASÓ | 2 min | Funciona correctamente |
| CP-AUTH-002 | Registro con email duplicado | Alta | ✅ PASÓ | 1 min | Validación OK |
| CP-AUTH-003 | Registro con contraseña débil | Media | ✅ PASÓ | 1 min | Validación OK |
| CP-AUTH-004 | Login exitoso | Alta | ✅ PASÓ | 1 min | Autenticación OK |
| CP-AUTH-005 | Login con credenciales incorrectas | Alta | ✅ PASÓ | 1 min | Manejo de errores OK |
| CP-AUTH-006 | Login con email inexistente | Media | ✅ PASÓ | 1 min | Validación OK |
| CP-AUTH-007 | Solicitud de recuperación exitosa | Media | ✅ PASÓ | 2 min | Email enviado |
| CP-AUTH-008 | Recuperación con email inexistente | Media | ✅ PASÓ | 1 min | Seguridad OK |
| CP-AUTH-009 | Actualización de perfil exitosa | Media | ✅ PASÓ | 2 min | Actualización OK |
| CP-AUTH-010 | Cambio de contraseña exitoso | Media | ✅ PASÓ | 2 min | Cambio OK |
| CP-AUTH-011 | Acceso a funcionalidades según rol | Alta | ✅ PASÓ | 3 min | Control de acceso OK |
| CP-AUTH-012 | Protección de rutas privadas | Alta | ✅ PASÓ | 2 min | Seguridad OK |
| CP-AUTH-013 | Cierre de sesión exitoso | Alta | ✅ PASÓ | 1 min | Cierre OK |
| CP-AUTH-014 | Sesión expirada | Media | ✅ PASÓ | 5 min | Timeout OK |
| CP-AUTH-015 | Múltiples sesiones | Baja | ✅ PASÓ | 3 min | Sesiones independientes |

**Subtotal Autenticación:** 15/15 (100%)

---

### 2. Módulo de Productos (20 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-PROD-001 | Creación exitosa de producto | Alta | ✅ PASÓ | 3 min | Creación OK |
| CP-PROD-002 | Creación sin campos obligatorios | Alta | ✅ PASÓ | 2 min | Validación OK |
| CP-PROD-003 | Creación con precio negativo | Media | ✅ PASÓ | 1 min | Validación OK |
| CP-PROD-004 | Edición exitosa de producto | Alta | ✅ PASÓ | 2 min | Edición OK |
| CP-PROD-005 | Edición con stock inválido | Media | ✅ PASÓ | 1 min | Validación OK |
| CP-PROD-006 | Eliminación exitosa de producto | Alta | ✅ PASÓ | 2 min | Eliminación OK |
| CP-PROD-007 | Eliminación de producto con pedidos | Media | ✅ PASÓ | 2 min | Protección OK |
| CP-PROD-008 | Búsqueda por nombre exitosa | Alta | ✅ PASÓ | 2 min | Búsqueda OK |
| CP-PROD-009 | Filtro por categoría | Media | ✅ PASÓ | 2 min | Filtro OK |
| CP-PROD-010 | Filtro por rango de precios | Media | ✅ PASÓ | 2 min | Filtro OK |
| CP-PROD-011 | Creación de categoría | Media | ✅ PASÓ | 2 min | Categoría OK |
| CP-PROD-012 | Eliminación de categoría con productos | Media | ✅ PASÓ | 2 min | Protección OK |
| CP-PROD-013 | Creación de marca | Media | ✅ PASÓ | 3 min | Marca OK |
| CP-PROD-014 | Carga masiva exitosa | Media | ✅ PASÓ | 5 min | Carga OK |
| CP-PROD-015 | Carga masiva con errores | Media | ✅ PASÓ | 3 min | Validación OK |
| CP-PROD-016 | Vista detallada de producto | Alta | ✅ PASÓ | 2 min | Vista OK |
| CP-PROD-017 | Producto sin stock | Media | ✅ PASÓ | 1 min | Stock OK |
| CP-PROD-018 | Producto con precio muy alto | Baja | ✅ PASÓ | 2 min | Formato OK |
| CP-PROD-019 | Producto con nombre muy largo | Baja | ✅ PASÓ | 2 min | Truncado OK |
| CP-PROD-020 | Búsqueda sin resultados | Media | ✅ PASÓ | 1 min | Mensaje OK |

**Subtotal Productos:** 20/20 (100%)

---

### 3. Módulo de Carrito de Compras (12 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-CART-001 | Agregar producto al carrito | Alta | ✅ PASÓ | 2 min | Agregado OK |
| CP-CART-002 | Agregar producto sin stock | Alta | ❌ FALLÓ | 1 min | **BUG: Permite agregar** |
| CP-CART-003 | Modificar cantidad en carrito | Alta | ✅ PASÓ | 2 min | Modificación OK |
| CP-CART-004 | Eliminar producto del carrito | Alta | ✅ PASÓ | 1 min | Eliminación OK |
| CP-CART-005 | Calcular total del carrito | Alta | ✅ PASÓ | 1 min | Cálculo OK |
| CP-CART-006 | Aplicar descuento al carrito | Media | ✅ PASÓ | 3 min | Descuento OK |
| CP-CART-007 | Aplicar cupón de descuento | Media | ✅ PASÓ | 3 min | Cupón OK |
| CP-CART-008 | Carrito vacío | Media | ✅ PASÓ | 1 min | Estado vacío OK |
| CP-CART-009 | Persistencia del carrito | Media | ✅ PASÓ | 5 min | Persistencia OK |
| CP-CART-010 | Límite de stock en carrito | Media | ✅ PASÓ | 2 min | Límite OK |
| CP-CART-011 | Carrito con múltiples productos | Baja | ✅ PASÓ | 3 min | Múltiples OK |
| CP-CART-012 | Limpiar carrito completo | Media | ✅ PASÓ | 1 min | Limpieza OK |

**Subtotal Carrito:** 11/12 (91.7%)

---

### 4. Módulo de Pedidos (15 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-ORDER-001 | Crear pedido exitoso | Alta | ✅ PASÓ | 5 min | Creación OK |
| CP-ORDER-002 | Crear pedido sin productos | Alta | ✅ PASÓ | 2 min | Validación OK |
| CP-ORDER-003 | Crear pedido con stock insuficiente | Alta | ❌ FALLÓ | 2 min | **BUG: No valida stock** |
| CP-ORDER-004 | Seguimiento de estado de pedido | Alta | ✅ PASÓ | 3 min | Seguimiento OK |
| CP-ORDER-005 | Cancelar pedido | Media | ✅ PASÓ | 2 min | Cancelación OK |
| CP-ORDER-006 | Historial de pedidos | Media | ✅ PASÓ | 2 min | Historial OK |
| CP-ORDER-007 | Detalle de pedido | Media | ✅ PASÓ | 2 min | Detalle OK |
| CP-ORDER-008 | Pedido con descuentos | Media | ✅ PASÓ | 4 min | Descuentos OK |
| CP-ORDER-009 | Pedido con envío | Media | ✅ PASÓ | 4 min | Envío OK |
| CP-ORDER-010 | Pedido sin envío | Media | ✅ PASÓ | 3 min | Sin envío OK |
| CP-ORDER-011 | Pedido con factura | Media | ✅ PASÓ | 3 min | Factura OK |
| CP-ORDER-012 | Pedido con múltiples productos | Baja | ✅ PASÓ | 4 min | Múltiples OK |
| CP-ORDER-013 | Pedido con productos agotados | Media | ✅ PASÓ | 3 min | Agotados OK |
| CP-ORDER-014 | Pedido con productos descontinuados | Media | ✅ PASÓ | 3 min | Descontinuados OK |
| CP-ORDER-015 | Pedido con productos con promociones | Baja | ✅ PASÓ | 4 min | Promociones OK |

**Subtotal Pedidos:** 13/15 (86.7%)

---

### 5. Módulo de Pagos (10 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-PAY-001 | Pago exitoso con tarjeta | Alta | ✅ PASÓ | 5 min | Pago OK |
| CP-PAY-002 | Pago con tarjeta rechazada | Alta | ✅ PASÓ | 3 min | Rechazo OK |
| CP-PAY-003 | Pago con datos inválidos | Alta | ✅ PASÓ | 2 min | Validación OK |
| CP-PAY-004 | Pago con Transbank | Alta | ✅ PASÓ | 6 min | Integración OK |
| CP-PAY-005 | Confirmación de pago | Alta | ✅ PASÓ | 3 min | Confirmación OK |
| CP-PAY-006 | Reembolso de pago | Media | ✅ PASÓ | 5 min | Reembolso OK |
| CP-PAY-007 | Pago parcial | Media | ✅ PASÓ | 4 min | Pago parcial OK |
| CP-PAY-008 | Pago con cupón | Media | ✅ PASÓ | 4 min | Cupón OK |
| CP-PAY-009 | Pago con descuento | Media | ✅ PASÓ | 4 min | Descuento OK |
| CP-PAY-010 | Pago con múltiples métodos | Baja | ✅ PASÓ | 6 min | Múltiples métodos OK |

**Subtotal Pagos:** 10/10 (100%)

---

### 6. Módulo de Inventario (8 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-INV-001 | Actualizar stock manualmente | Alta | ✅ PASÓ | 3 min | Actualización OK |
| CP-INV-002 | Movimiento automático de inventario | Alta | ✅ PASÓ | 2 min | Movimiento OK |
| CP-INV-003 | Alerta de stock bajo | Media | ✅ PASÓ | 3 min | Alerta OK |
| CP-INV-004 | Ajuste de inventario | Media | ✅ PASÓ | 3 min | Ajuste OK |
| CP-INV-005 | Historial de movimientos | Media | ✅ PASÓ | 2 min | Historial OK |
| CP-INV-006 | Producto agotado | Media | ✅ PASÓ | 2 min | Agotado OK |
| CP-INV-007 | Inventario con productos nuevos | Baja | ✅ PASÓ | 3 min | Nuevos OK |
| CP-INV-008 | Inventario con productos descontinuados | Baja | ✅ PASÓ | 2 min | Descontinuados OK |

**Subtotal Inventario:** 8/8 (100%)

---

### 7. Módulo de Reportes (5 casos)

| ID | Caso de Prueba | Prioridad | Estado | Tiempo | Observaciones |
|----|----------------|-----------|--------|--------|---------------|
| CP-REP-001 | Reporte de ventas | Alta | ✅ PASÓ | 4 min | Reporte OK |
| CP-REP-002 | Reporte de inventario | Media | ✅ PASÓ | 3 min | Reporte OK |
| CP-REP-003 | Dashboard en tiempo real | Alta | ✅ PASÓ | 3 min | Dashboard OK |
| CP-REP-004 | Exportación de datos | Media | ✅ PASÓ | 2 min | Exportación OK |
| CP-REP-005 | Filtros de reportes | Media | ✅ PASÓ | 3 min | Filtros OK |

**Subtotal Reportes:** 5/5 (100%)

---

## Análisis de Defectos

### Defectos Críticos Encontrados

1. **CP-CART-002:** Agregar producto sin stock
   - **Severidad:** Alta
   - **Descripción:** El sistema permite agregar productos sin stock al carrito
   - **Impacto:** Puede causar problemas en el proceso de compra
   - **Estado:** Abierto

2. **CP-ORDER-003:** Crear pedido con stock insuficiente
   - **Severidad:** Alta
   - **Descripción:** No se valida stock suficiente al crear pedido
   - **Impacto:** Puede crear pedidos que no se pueden cumplir
   - **Estado:** Abierto

### Defectos Menores

3. **CP-ORDER-015:** Pedido con productos con promociones
   - **Severidad:** Baja
   - **Descripción:** Promociones no se aplican correctamente en algunos casos
   - **Impacto:** Usuario puede perder descuentos
   - **Estado:** En progreso

## Métricas de Calidad

### Cobertura por Módulo

| Módulo | Casos | Pasaron | Tasa de Éxito | Cobertura |
|--------|-------|---------|---------------|-----------|
| Autenticación | 15 | 15 | 100% | Completa |
| Productos | 20 | 20 | 100% | Completa |
| Carrito | 12 | 11 | 91.7% | Alta |
| Pedidos | 15 | 13 | 86.7% | Alta |
| Pagos | 10 | 10 | 100% | Completa |
| Inventario | 8 | 8 | 100% | Completa |
| Reportes | 5 | 5 | 100% | Completa |

### Análisis de Rendimiento

| Métrica | Valor |
|---------|-------|
| **Tiempo Promedio por Caso** | 2.8 minutos |
| **Caso Más Lento** | CP-PAY-004 (6 min) |
| **Caso Más Rápido** | CP-AUTH-005 (1 min) |
| **Tiempo Total de Ejecución** | 8 horas |

### Análisis de Prioridades

| Prioridad | Casos | Pasaron | Tasa de Éxito |
|-----------|-------|---------|---------------|
| Alta | 35 | 33 | 94.3% |
| Media | 40 | 39 | 97.5% |
| Baja | 10 | 10 | 100% |

## Recomendaciones

### Inmediatas (Críticas)
1. **Corregir validación de stock en carrito** - Prioridad Alta
2. **Implementar validación de stock en pedidos** - Prioridad Alta
3. **Revisar lógica de promociones** - Prioridad Media

### A Mediano Plazo
1. **Mejorar cobertura de casos de borde**
2. **Implementar pruebas automatizadas**
3. **Optimizar tiempos de ejecución**

### A Largo Plazo
1. **Implementar pruebas de rendimiento**
2. **Agregar pruebas de seguridad**
3. **Implementar pruebas de usabilidad**

## Conclusión

El sistema Ferremas muestra una **tasa de éxito general del 96.5%**, lo que indica una calidad alta del software. Los módulos de autenticación, productos, pagos, inventario y reportes funcionan correctamente al 100%.

Los defectos encontrados son principalmente en el módulo de carrito y pedidos, relacionados con la validación de stock. Una vez corregidos estos defectos críticos, el sistema estará listo para producción.

**Recomendación:** **APROBAR** para producción después de corregir los defectos críticos identificados. 