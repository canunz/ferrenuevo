# Casos de Prueba - Módulo de Productos

## 1. Creación de Productos

### CP-PROD-001: Creación exitosa de producto
**Prioridad:** Alta  
**Tipo:** Positivo  
**Precondiciones:** Usuario administrador logueado

**Pasos:**
1. Acceder a "Gestión de Productos"
2. Hacer clic en "Nuevo Producto"
3. Completar formulario:
   - Nombre: "Martillo Stanley 16oz"
   - Descripción: "Martillo profesional con mango ergonómico"
   - Precio: 25000
   - Categoría: "Herramientas"
   - Marca: "Stanley"
   - Stock: 50
   - Imagen: subir archivo válido
4. Hacer clic en "Guardar"

**Resultado Esperado:**
- Producto se crea exitosamente
- Se muestra mensaje de confirmación
- Producto aparece en el catálogo
- Imagen se sube correctamente

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-002: Creación sin campos obligatorios
**Prioridad:** Alta  
**Tipo:** Negativo  

**Pasos:**
1. Acceder a "Nuevo Producto"
2. Dejar campos obligatorios vacíos
3. Hacer clic en "Guardar"

**Resultado Esperado:**
- Se muestran errores de validación
- No se crea producto
- Formulario mantiene datos ingresados

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-003: Creación con precio negativo
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Completar formulario con precio -1000
2. Hacer clic en "Guardar"

**Resultado Esperado:**
- Se muestra error "Precio debe ser mayor a 0"
- No se crea producto

**Resultado Obtenido:** ✅ PASÓ

---

## 2. Edición de Productos

### CP-PROD-004: Edición exitosa de producto
**Prioridad:** Alta  
**Tipo:** Positivo  
**Precondiciones:** Producto existente en el sistema

**Pasos:**
1. Acceder a lista de productos
2. Hacer clic en "Editar" en producto existente
3. Modificar precio de 25000 a 28000
4. Hacer clic en "Guardar"

**Resultado Esperado:**
- Producto se actualiza exitosamente
- Se muestra mensaje de confirmación
- Cambios se reflejan en catálogo
- Historial de cambios se registra

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-005: Edición con stock inválido
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Editar producto existente
2. Cambiar stock a -5
3. Hacer clic en "Guardar"

**Resultado Esperado:**
- Se muestra error "Stock no puede ser negativo"
- No se actualiza producto

**Resultado Obtenido:** ✅ PASÓ

---

## 3. Eliminación de Productos

### CP-PROD-006: Eliminación exitosa de producto
**Prioridad:** Alta  
**Tipo:** Positivo  

**Pasos:**
1. Acceder a lista de productos
2. Hacer clic en "Eliminar"
3. Confirmar eliminación

**Resultado Esperado:**
- Producto se elimina exitosamente
- Se muestra mensaje de confirmación
- Producto desaparece del catálogo
- Se mantiene integridad referencial

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-007: Eliminación de producto con pedidos
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Intentar eliminar producto que tiene pedidos asociados
2. Confirmar eliminación

**Resultado Esperado:**
- Se muestra error "No se puede eliminar producto con pedidos"
- Producto no se elimina
- Se sugiere desactivar en lugar de eliminar

**Resultado Obtenido:** ✅ PASÓ

---

## 4. Búsqueda y Filtros

### CP-PROD-008: Búsqueda por nombre exitosa
**Prioridad:** Alta  
**Tipo:** Positivo  

**Pasos:**
1. Acceder al catálogo
2. Buscar "martillo"
3. Ver resultados

**Resultado Esperado:**
- Se muestran productos que contienen "martillo"
- Resultados ordenados por relevancia
- Contador de resultados mostrado

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-009: Filtro por categoría
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Seleccionar categoría "Herramientas"
2. Aplicar filtro

**Resultado Esperado:**
- Se muestran solo productos de esa categoría
- Filtro se mantiene activo
- Opción de limpiar filtros disponible

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-010: Filtro por rango de precios
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Establecer rango de precios: 10000 - 50000
2. Aplicar filtro

**Resultado Esperado:**
- Se muestran productos en ese rango
- Filtro se aplica correctamente
- Contador actualizado

**Resultado Obtenido:** ✅ PASÓ

---

## 5. Gestión de Categorías

### CP-PROD-011: Creación de categoría
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Acceder a "Gestión de Categorías"
2. Crear nueva categoría "Jardinería"
3. Guardar

**Resultado Esperado:**
- Categoría se crea exitosamente
- Aparece en lista de categorías
- Disponible para asignar a productos

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-012: Eliminación de categoría con productos
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Intentar eliminar categoría que tiene productos
2. Confirmar eliminación

**Resultado Esperado:**
- Se muestra error "Categoría tiene productos asociados"
- Categoría no se elimina
- Se sugiere reasignar productos primero

**Resultado Obtenido:** ✅ PASÓ

---

## 6. Gestión de Marcas

### CP-PROD-013: Creación de marca
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Acceder a "Gestión de Marcas"
2. Crear nueva marca "Makita"
3. Subir logo de marca
4. Guardar

**Resultado Esperado:**
- Marca se crea exitosamente
- Logo se sube correctamente
- Disponible para asignar a productos

**Resultado Obtenido:** ✅ PASÓ

---

## 7. Carga Masiva de Productos

### CP-PROD-014: Carga masiva exitosa
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Acceder a "Carga Masiva"
2. Subir archivo CSV con productos
3. Validar datos
4. Confirmar importación

**Resultado Esperado:**
- Productos se importan correctamente
- Se muestra reporte de importación
- Errores se reportan claramente

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-015: Carga masiva con errores
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Subir archivo CSV con datos inválidos
2. Validar datos

**Resultado Esperado:**
- Se muestran errores de validación
- No se importan productos
- Se sugiere corregir errores

**Resultado Obtenido:** ✅ PASÓ

---

## 8. Visualización de Productos

### CP-PROD-016: Vista detallada de producto
**Prioridad:** Alta  
**Tipo:** Positivo  

**Pasos:**
1. Hacer clic en producto del catálogo
2. Ver página de detalle

**Resultado Esperado:**
- Se muestra información completa del producto
- Imágenes se cargan correctamente
- Botón "Agregar al Carrito" disponible
- Información de stock visible

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-017: Producto sin stock
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Ver producto con stock 0
2. Intentar agregar al carrito

**Resultado Esperado:**
- Se muestra "Sin stock"
- Botón "Agregar al Carrito" deshabilitado
- Opción de notificación cuando haya stock

**Resultado Obtenido:** ✅ PASÓ

---

## 9. Casos de Borde

### CP-PROD-018: Producto con precio muy alto
**Prioridad:** Baja  
**Tipo:** Positivo  

**Pasos:**
1. Crear producto con precio 999999999
2. Verificar visualización

**Resultado Esperado:**
- Precio se formatea correctamente
- No hay problemas de overflow
- Interfaz se mantiene estable

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-019: Producto con nombre muy largo
**Prioridad:** Baja  
**Tipo:** Positivo  

**Pasos:**
1. Crear producto con nombre de 200 caracteres
2. Verificar visualización

**Resultado Esperado:**
- Nombre se trunca correctamente
- Tooltip muestra nombre completo
- Layout no se rompe

**Resultado Obtenido:** ✅ PASÓ

---

### CP-PROD-020: Búsqueda sin resultados
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Buscar término que no existe
2. Ver resultados

**Resultado Esperado:**
- Se muestra mensaje "No se encontraron productos"
- Se sugieren términos similares
- Opción de búsqueda ampliada

**Resultado Obtenido:** ✅ PASÓ

---

## Resumen de Resultados

| Caso de Prueba | Estado | Observaciones |
|----------------|--------|---------------|
| CP-PROD-001 | ✅ PASÓ | Creación de productos OK |
| CP-PROD-002 | ✅ PASÓ | Validación de campos obligatorios |
| CP-PROD-003 | ✅ PASÓ | Validación de precio negativo |
| CP-PROD-004 | ✅ PASÓ | Edición de productos OK |
| CP-PROD-005 | ✅ PASÓ | Validación de stock negativo |
| CP-PROD-006 | ✅ PASÓ | Eliminación de productos OK |
| CP-PROD-007 | ✅ PASÓ | Protección de integridad referencial |
| CP-PROD-008 | ✅ PASÓ | Búsqueda por nombre OK |
| CP-PROD-009 | ✅ PASÓ | Filtro por categoría OK |
| CP-PROD-010 | ✅ PASÓ | Filtro por precio OK |
| CP-PROD-011 | ✅ PASÓ | Gestión de categorías OK |
| CP-PROD-012 | ✅ PASÓ | Protección de categorías |
| CP-PROD-013 | ✅ PASÓ | Gestión de marcas OK |
| CP-PROD-014 | ✅ PASÓ | Carga masiva OK |
| CP-PROD-015 | ✅ PASÓ | Validación de carga masiva |
| CP-PROD-016 | ✅ PASÓ | Vista detallada OK |
| CP-PROD-017 | ✅ PASÓ | Manejo de stock cero |
| CP-PROD-018 | ✅ PASÓ | Casos de borde de precio |
| CP-PROD-019 | ✅ PASÓ | Casos de borde de nombre |
| CP-PROD-020 | ✅ PASÓ | Búsqueda sin resultados |

**Total:** 20 casos de prueba  
**Pasaron:** 20 (100%)  
**Fallaron:** 0 (0%)  
**Cobertura:** Completa del módulo de productos 