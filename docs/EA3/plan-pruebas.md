# Plan de Pruebas - Sistema Ferremas

## 1. Información General

**Proyecto:** Sistema de E-commerce Ferremas  
**Versión:** 1.0  
**Fecha de Creación:** Julio 2025  
**Responsable:** Equipo de Desarrollo  

## 2. Objetivos de las Pruebas

### Objetivos Principales
- Verificar que todas las funcionalidades del sistema operen correctamente
- Validar la integración entre frontend y backend
- Asegurar la calidad de la experiencia de usuario
- Verificar la seguridad del sistema
- Validar la integración con servicios externos (Transbank, Banco Central)

### Objetivos Específicos
- **Funcionalidad:** Todas las características del sistema funcionan según especificaciones
- **Usabilidad:** Interfaz intuitiva y fácil de usar
- **Rendimiento:** Sistema responde en tiempos aceptables
- **Seguridad:** Protección adecuada de datos y transacciones
- **Compatibilidad:** Funciona en navegadores principales

## 3. Alcance de las Pruebas

### Módulos a Probar

#### 3.1 Autenticación y Usuarios
- Registro de usuarios
- Inicio de sesión
- Recuperación de contraseña
- Gestión de perfiles
- Control de acceso y roles

#### 3.2 Gestión de Productos
- Creación de productos
- Edición de productos
- Eliminación de productos
- Búsqueda y filtros
- Gestión de categorías y marcas
- Carga masiva de productos

#### 3.3 Carrito de Compras
- Agregar productos al carrito
- Modificar cantidades
- Eliminar productos
- Calcular totales
- Aplicar descuentos y promociones

#### 3.4 Gestión de Pedidos
- Creación de pedidos
- Seguimiento de estado
- Historial de compras
- Gestión de facturas

#### 3.5 Sistema de Pagos
- Integración con Transbank
- Procesamiento de pagos
- Confirmación de transacciones
- Manejo de errores de pago

#### 3.6 Inventario
- Control de stock
- Alertas de inventario bajo
- Movimientos de inventario
- Ajustes de stock

#### 3.7 Reportes y Dashboard
- Reportes de ventas
- Reportes de inventario
- Dashboard en tiempo real
- Exportación de datos

#### 3.8 Integraciones Externas
- API del Banco Central
- Servicios de Transbank
- APIs de terceros

## 4. Tipos de Pruebas

### 4.1 Pruebas Unitarias
- **Objetivo:** Verificar que cada componente funcione individualmente
- **Herramientas:** Jest, Mocha
- **Cobertura:** Mínimo 80% del código

### 4.2 Pruebas de Integración
- **Objetivo:** Verificar la comunicación entre componentes
- **Enfoque:** APIs, base de datos, servicios externos
- **Herramientas:** Postman, Supertest

### 4.3 Pruebas de Sistema
- **Objetivo:** Verificar el sistema completo
- **Enfoque:** Flujos de usuario completos
- **Herramientas:** Cypress, Selenium

### 4.4 Pruebas de Usabilidad
- **Objetivo:** Verificar la experiencia de usuario
- **Enfoque:** Navegación, diseño, accesibilidad
- **Método:** Pruebas manuales con usuarios

### 4.5 Pruebas de Seguridad
- **Objetivo:** Verificar la protección del sistema
- **Enfoque:** Autenticación, autorización, datos sensibles
- **Herramientas:** OWASP ZAP, análisis manual

### 4.6 Pruebas de Rendimiento
- **Objetivo:** Verificar el comportamiento bajo carga
- **Enfoque:** Tiempo de respuesta, concurrencia
- **Herramientas:** Apache JMeter, Artillery

## 5. Entorno de Pruebas

### 5.1 Entorno de Desarrollo
- **Base de Datos:** MySQL local
- **Backend:** Node.js/Express
- **Frontend:** React
- **Servicios:** Mock de APIs externas

### 5.2 Entorno de Pruebas
- **Base de Datos:** MySQL de pruebas
- **Backend:** Servidor de pruebas
- **Frontend:** Build de producción
- **Servicios:** APIs de sandbox

### 5.3 Entorno de Producción
- **Base de Datos:** MySQL de producción
- **Backend:** Servidor de producción
- **Frontend:** CDN
- **Servicios:** APIs reales

## 6. Criterios de Aceptación

### 6.1 Criterios Funcionales
- Todas las funcionalidades principales funcionan correctamente
- No hay errores críticos en el sistema
- La integración con servicios externos es exitosa
- Los reportes generan datos correctos

### 6.2 Criterios de Rendimiento
- Tiempo de respuesta < 3 segundos para operaciones normales
- Sistema soporta mínimo 100 usuarios concurrentes
- Disponibilidad del 99.5%

### 6.3 Criterios de Seguridad
- Autenticación segura implementada
- Datos sensibles encriptados
- Protección contra ataques comunes
- Cumplimiento de estándares de seguridad

## 7. Cronograma de Pruebas

### Fase 1: Pruebas Unitarias (Semana 1)
- Desarrollo de casos de prueba unitarios
- Ejecución y corrección de errores
- Documentación de resultados

### Fase 2: Pruebas de Integración (Semana 2)
- Pruebas de APIs
- Pruebas de base de datos
- Pruebas de servicios externos

### Fase 3: Pruebas de Sistema (Semana 3)
- Pruebas end-to-end
- Pruebas de usabilidad
- Pruebas de seguridad

### Fase 4: Pruebas de Rendimiento (Semana 4)
- Pruebas de carga
- Optimización de rendimiento
- Documentación final

## 8. Roles y Responsabilidades

### 8.1 Líder de Pruebas
- Coordinar todas las actividades de prueba
- Revisar y aprobar casos de prueba
- Reportar progreso y problemas

### 8.2 Desarrolladores
- Desarrollar pruebas unitarias
- Corregir defectos encontrados
- Participar en pruebas de integración

### 8.3 Tester
- Ejecutar casos de prueba
- Reportar defectos
- Validar correcciones

### 8.4 Usuario Final
- Participar en pruebas de usabilidad
- Proporcionar feedback
- Validar funcionalidades críticas

## 9. Criterios de Salida

### 9.1 Criterios de Salida Exitosos
- Todos los casos de prueba críticos pasan
- No hay defectos críticos abiertos
- Cobertura de código ≥ 80%
- Aprobación del cliente/usuario final

### 9.2 Criterios de Salida Fallidos
- Más del 5% de casos críticos fallan
- Defectos críticos sin resolver
- Cobertura de código < 70%
- Rechazo del cliente/usuario final

## 10. Riesgos y Mitigación

### 10.1 Riesgos Identificados
- **Riesgo:** Falta de tiempo para pruebas completas
  **Mitigación:** Priorizar casos críticos, automatizar pruebas

- **Riesgo:** Problemas con APIs externas
  **Mitigación:** Usar mocks, tener planes de contingencia

- **Riesgo:** Cambios de último momento
  **Mitigación:** Proceso de cambio controlado, pruebas de regresión

- **Riesgo:** Falta de datos de prueba
  **Mitigación:** Crear datos de prueba completos, scripts de generación

## 11. Documentación de Resultados

### 11.1 Reportes a Generar
- Reporte de ejecución de pruebas
- Reporte de defectos
- Reporte de cobertura
- Reporte de rendimiento
- Reporte final de pruebas

### 11.2 Métricas a Medir
- Tasa de paso de pruebas
- Tasa de detección de defectos
- Cobertura de código
- Tiempo de ejecución
- Costo de corrección de defectos 