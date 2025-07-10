# Registro de Defectos - Sistema Ferremas

## Información General

**Proyecto:** Sistema de E-commerce Ferremas  
**Versión:** 1.0  
**Fecha de Creación:** Julio 2025  
**Responsable:** Equipo de Desarrollo  

## Resumen de Defectos

| Severidad | Abiertos | En Progreso | Resueltos | Cerrados |
|-----------|----------|--------------|-----------|----------|
| **Crítica** | 2 | 0 | 0 | 0 |
| **Alta** | 1 | 1 | 0 | 0 |
| **Media** | 3 | 2 | 1 | 0 |
| **Baja** | 2 | 1 | 0 | 0 |
| **Total** | 8 | 4 | 1 | 0 |

## Defectos Críticos

### DEF-001: Validación de stock en carrito
**ID:** DEF-001  
**Título:** Sistema permite agregar productos sin stock al carrito  
**Severidad:** Crítica  
**Prioridad:** Alta  
**Estado:** Abierto  
**Asignado a:** Equipo de Desarrollo  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 15/07/2025  

**Descripción:**
El sistema permite agregar productos que tienen stock 0 al carrito de compras, lo que puede causar problemas en el proceso de compra.

**Pasos para Reproducir:**
1. Buscar un producto con stock 0
2. Hacer clic en "Agregar al Carrito"
3. Verificar que se agrega al carrito

**Resultado Actual:**
- Producto se agrega al carrito sin validación
- No se muestra advertencia de stock insuficiente
- Usuario puede proceder al checkout

**Resultado Esperado:**
- No se debe permitir agregar productos sin stock
- Mostrar mensaje "Producto sin stock disponible"
- Deshabilitar botón "Agregar al Carrito"

**Impacto:**
- Usuarios pueden crear pedidos que no se pueden cumplir
- Pérdida de confianza en el sistema
- Problemas en el proceso de facturación

**Causa Raíz:**
Falta de validación de stock en el componente de carrito antes de agregar productos.

**Solución Propuesta:**
Implementar validación de stock en el frontend y backend antes de agregar productos al carrito.

---

### DEF-002: Validación de stock en pedidos
**ID:** DEF-002  
**Título:** No se valida stock suficiente al crear pedidos  
**Severidad:** Crítica  
**Prioridad:** Alta  
**Estado:** Abierto  
**Asignado a:** Equipo de Desarrollo  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 15/07/2025  

**Descripción:**
El sistema permite crear pedidos con cantidades que exceden el stock disponible, lo que puede causar problemas de cumplimiento.

**Pasos para Reproducir:**
1. Agregar productos al carrito con cantidad mayor al stock
2. Proceder al checkout
3. Confirmar pedido

**Resultado Actual:**
- Pedido se crea sin validación de stock
- No se verifica disponibilidad real
- Puede crear pedidos imposibles de cumplir

**Resultado Esperado:**
- Validar stock disponible antes de crear pedido
- Mostrar error si stock es insuficiente
- Ajustar cantidad automáticamente si es necesario

**Impacto:**
- Pedidos que no se pueden cumplir
- Problemas de inventario
- Pérdida de confianza del cliente

**Causa Raíz:**
Falta de validación de stock en el proceso de creación de pedidos.

**Solución Propuesta:**
Implementar validación de stock en el backend antes de confirmar pedidos.

---

## Defectos de Alta Severidad

### DEF-003: Problemas de rendimiento en búsqueda
**ID:** DEF-003  
**Título:** Búsqueda lenta con muchos productos  
**Severidad:** Alta  
**Prioridad:** Media  
**Estado:** En Progreso  
**Asignado a:** Equipo de Backend  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 20/07/2025  

**Descripción:**
La búsqueda de productos se vuelve lenta cuando hay más de 1000 productos en el catálogo.

**Pasos para Reproducir:**
1. Tener más de 1000 productos en el sistema
2. Realizar búsqueda por término común
3. Medir tiempo de respuesta

**Resultado Actual:**
- Tiempo de respuesta > 5 segundos
- Interfaz se congela temporalmente
- Experiencia de usuario degradada

**Resultado Esperado:**
- Tiempo de respuesta < 2 segundos
- Búsqueda fluida y responsiva
- Paginación de resultados

**Impacto:**
- Experiencia de usuario degradada
- Posible abandono del sitio
- Pérdida de ventas

**Causa Raíz:**
Falta de índices en base de datos y optimización de consultas.

**Solución Propuesta:**
- Implementar índices en base de datos
- Optimizar consultas SQL
- Implementar cache de búsquedas

---

## Defectos de Severidad Media

### DEF-004: Promociones no se aplican correctamente
**ID:** DEF-004  
**Título:** Promociones no se aplican en algunos casos  
**Severidad:** Media  
**Prioridad:** Media  
**Estado:** En Progreso  
**Asignado a:** Equipo de Desarrollo  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 18/07/2025  

**Descripción:**
Las promociones y descuentos no se aplican correctamente en ciertos escenarios, especialmente con productos de categorías específicas.

**Pasos para Reproducir:**
1. Crear promoción para categoría "Herramientas"
2. Agregar productos de esa categoría al carrito
3. Verificar aplicación de descuento

**Resultado Actual:**
- Descuento no se aplica en algunos casos
- Cálculo incorrecto del total
- Inconsistencia en aplicación

**Resultado Esperado:**
- Promociones se aplican consistentemente
- Cálculo correcto de totales
- Descuentos visibles claramente

**Impacto:**
- Usuarios pueden perder descuentos
- Confusión en precios
- Pérdida de confianza

**Causa Raíz:**
Lógica de aplicación de promociones no maneja todos los casos de borde.

**Solución Propuesta:**
Revisar y corregir la lógica de aplicación de promociones.

---

### DEF-005: Problemas de validación en formularios
**ID:** DEF-005  
**Título:** Validación inconsistente en formularios  
**Severidad:** Media  
**Prioridad:** Baja  
**Estado:** Abierto  
**Asignado a:** Equipo de Frontend  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 25/07/2025  

**Descripción:**
Los formularios tienen validaciones inconsistentes entre frontend y backend, causando confusión en los usuarios.

**Pasos para Reproducir:**
1. Llenar formulario con datos inválidos
2. Enviar formulario
3. Verificar mensajes de error

**Resultado Actual:**
- Validaciones diferentes entre frontend y backend
- Mensajes de error inconsistentes
- Experiencia confusa para el usuario

**Resultado Esperado:**
- Validaciones consistentes
- Mensajes de error claros
- Experiencia de usuario mejorada

**Impacto:**
- Confusión del usuario
- Pérdida de tiempo
- Frustración

**Causa Raíz:**
Falta de sincronización entre validaciones de frontend y backend.

**Solución Propuesta:**
Estandarizar validaciones y mensajes de error.

---

### DEF-006: Problemas de sesión en dispositivos móviles
**ID:** DEF-006  
**Título:** Sesiones se pierden en dispositivos móviles  
**Severidad:** Media  
**Prioridad:** Media  
**Estado:** Resuelto  
**Asignado a:** Equipo de Desarrollo  
**Fecha de Reporte:** 08/07/2025  
**Fecha de Resolución:** 09/07/2025  

**Descripción:**
Las sesiones de usuario se pierden frecuentemente en dispositivos móviles, especialmente en navegadores Safari.

**Pasos para Reproducir:**
1. Iniciar sesión en dispositivo móvil
2. Navegar por el sitio
3. Verificar pérdida de sesión

**Resultado Actual:**
- Sesiones se pierden después de 10-15 minutos
- Usuario debe volver a iniciar sesión
- Pérdida de datos del carrito

**Resultado Esperado:**
- Sesiones estables en dispositivos móviles
- Persistencia de datos del carrito
- Experiencia consistente

**Impacto:**
- Frustración del usuario
- Pérdida de ventas
- Abandono del sitio

**Causa Raíz:**
Problemas con cookies en navegadores móviles.

**Solución Implementada:**
Implementar almacenamiento local para datos de sesión y mejorar manejo de cookies.

---

## Defectos de Severidad Baja

### DEF-007: Problemas de visualización en pantallas pequeñas
**ID:** DEF-007  
**Título:** Interfaz no se adapta bien a pantallas pequeñas  
**Severidad:** Baja  
**Prioridad:** Baja  
**Estado:** Abierto  
**Asignado a:** Equipo de Frontend  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 30/07/2025  

**Descripción:**
La interfaz no se adapta correctamente a pantallas pequeñas, causando problemas de usabilidad.

**Pasos para Reproducir:**
1. Acceder al sitio desde dispositivo móvil
2. Navegar por diferentes páginas
3. Verificar elementos cortados o desalineados

**Resultado Actual:**
- Elementos se cortan en pantallas pequeñas
- Botones difíciles de tocar
- Texto difícil de leer

**Resultado Esperado:**
- Interfaz responsive
- Elementos bien dimensionados
- Texto legible

**Impacto:**
- Experiencia de usuario degradada
- Posible abandono del sitio
- Pérdida de ventas móviles

**Causa Raíz:**
Falta de diseño responsive completo.

**Solución Propuesta:**
Implementar diseño responsive completo y optimizar para móviles.

---

### DEF-008: Problemas de accesibilidad
**ID:** DEF-008  
**Título:** Falta de características de accesibilidad  
**Severidad:** Baja  
**Prioridad:** Baja  
**Estado:** En Progreso  
**Asignado a:** Equipo de Frontend  
**Fecha de Reporte:** 10/07/2025  
**Fecha Estimada de Resolución:** 01/08/2025  

**Descripción:**
El sitio web carece de características de accesibilidad básicas para usuarios con discapacidades.

**Pasos para Reproducir:**
1. Usar lector de pantalla
2. Navegar con teclado
3. Verificar contraste de colores

**Resultado Actual:**
- Falta de etiquetas ARIA
- Navegación por teclado limitada
- Contraste de colores insuficiente

**Resultado Esperado:**
- Etiquetas ARIA implementadas
- Navegación completa por teclado
- Contraste de colores adecuado

**Impacto:**
- Exclusión de usuarios con discapacidades
- No cumplimiento de estándares de accesibilidad
- Posibles problemas legales

**Causa Raíz:**
Falta de consideración de accesibilidad en el diseño.

**Solución Propuesta:**
Implementar características de accesibilidad según estándares WCAG.

---

## Análisis de Tendencias

### Defectos por Módulo

| Módulo | Defectos | Críticos | Altos | Medios | Bajos |
|--------|----------|----------|-------|--------|-------|
| Carrito | 1 | 1 | 0 | 0 | 0 |
| Pedidos | 1 | 1 | 0 | 0 | 0 |
| Productos | 1 | 0 | 1 | 0 | 0 |
| Promociones | 1 | 0 | 0 | 1 | 0 |
| Frontend | 2 | 0 | 0 | 1 | 1 |
| Accesibilidad | 1 | 0 | 0 | 0 | 1 |
| Sesiones | 1 | 0 | 0 | 1 | 0 |

### Análisis de Causas Raíz

| Causa | Frecuencia | Porcentaje |
|-------|------------|------------|
| Falta de validación | 2 | 25% |
| Problemas de rendimiento | 1 | 12.5% |
| Lógica de negocio | 1 | 12.5% |
| Problemas de frontend | 2 | 25% |
| Problemas de configuración | 1 | 12.5% |
| Falta de consideración UX | 1 | 12.5% |

## Plan de Acción

### Inmediato (Esta Semana)
1. **Resolver DEF-001 y DEF-002** (Críticos)
   - Implementar validación de stock en carrito
   - Implementar validación de stock en pedidos
   - Realizar pruebas de regresión

### Corto Plazo (Próximas 2 Semanas)
1. **Resolver DEF-003** (Alto)
   - Optimizar consultas de búsqueda
   - Implementar índices en base de datos
   - Realizar pruebas de rendimiento

2. **Resolver DEF-004** (Medio)
   - Revisar lógica de promociones
   - Corregir casos de borde
   - Probar con diferentes escenarios

### Mediano Plazo (Próximo Mes)
1. **Resolver DEF-005** (Medio)
   - Estandarizar validaciones
   - Mejorar mensajes de error
   - Documentar estándares

2. **Resolver DEF-007 y DEF-008** (Bajos)
   - Implementar diseño responsive
   - Agregar características de accesibilidad
   - Realizar pruebas de usabilidad

## Métricas de Calidad

### Tasa de Resolución
- **Defectos Resueltos:** 1/8 (12.5%)
- **Tiempo Promedio de Resolución:** 2 días
- **Defectos por Día:** 0.8

### Distribución por Severidad
- **Críticos:** 25%
- **Altos:** 12.5%
- **Medios:** 37.5%
- **Bajos:** 25%

## Conclusión

El sistema presenta **8 defectos** identificados durante las pruebas, con **2 defectos críticos** que requieren atención inmediata. La mayoría de los defectos están relacionados con validaciones y experiencia de usuario.

**Recomendación:** Resolver los defectos críticos antes de la puesta en producción, y continuar con los defectos de menor severidad en las siguientes iteraciones. 