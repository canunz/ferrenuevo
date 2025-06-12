# Casos de Prueba - Formulario de Productos

## TC-001: Validación de Campos Requeridos
- **ID del Caso de Prueba**: TC-001
- **Módulo**: Gestión de Productos
- **Funcionalidad**: Validación de campos obligatorios
- **Prioridad**: Alta
- **Estado**: Pendiente

### Prerequisitos
- Acceso al sistema como administrador
- Navegador web actualizado
- Conexión a internet estable

### Datos de Prueba
- **Entrada**: 
  - Nombre: vacío
  - Precio: vacío
  - Stock: vacío
  - Categoría: no seleccionada
  - Marca: no seleccionada
- **Resultado Esperado**: 
  - Mensajes de error para cada campo requerido
  - Formulario no se envía

### Pasos de Ejecución
1. Acceder al formulario de creación de producto
2. Dejar todos los campos requeridos vacíos
3. Intentar enviar el formulario
4. Verificar mensajes de error

### Resultado Actual
- **Estado**: No Ejecutado
- **Observaciones**: Pendiente de ejecución

## TC-002: Validación de Imagen
- **ID del Caso de Prueba**: TC-002
- **Módulo**: Gestión de Productos
- **Funcionalidad**: Carga de imagen de producto
- **Prioridad**: Alta
- **Estado**: Pendiente

### Prerequisitos
- Acceso al sistema como administrador
- Imágenes de prueba en diferentes formatos
- Imágenes de prueba con diferentes tamaños

### Datos de Prueba
- **Entrada**: 
  - Imagen PNG de 6MB
  - Imagen JPG de 2MB
  - Archivo PDF
- **Resultado Esperado**: 
  - Rechazo de imagen > 5MB
  - Aceptación de imagen válida
  - Rechazo de archivo no imagen

### Pasos de Ejecución
1. Acceder al formulario de producto
2. Intentar cargar imagen de 6MB
3. Intentar cargar imagen válida de 2MB
4. Intentar cargar archivo PDF

### Resultado Actual
- **Estado**: No Ejecutado
- **Observaciones**: Pendiente de ejecución 