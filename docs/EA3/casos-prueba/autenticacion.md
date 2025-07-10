# Casos de Prueba - Módulo de Autenticación

## 1. Registro de Usuario

### CP-AUTH-001: Registro exitoso de usuario
**Prioridad:** Alta  
**Tipo:** Positivo  
**Precondiciones:** Usuario no registrado en el sistema

**Pasos:**
1. Acceder a la página de registro
2. Completar formulario con datos válidos:
   - Nombre: "Juan Pérez"
   - Email: "juan.perez@email.com"
   - Contraseña: "Password123!"
   - Confirmar contraseña: "Password123!"
3. Hacer clic en "Registrarse"

**Resultado Esperado:**
- Usuario se registra exitosamente
- Se muestra mensaje de confirmación
- Se redirige al login
- Se envía email de confirmación

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-002: Registro con email duplicado
**Prioridad:** Alta  
**Tipo:** Negativo  
**Precondiciones:** Usuario ya registrado con email "juan.perez@email.com"

**Pasos:**
1. Acceder a la página de registro
2. Completar formulario con email existente
3. Hacer clic en "Registrarse"

**Resultado Esperado:**
- Se muestra error "Email ya registrado"
- No se crea nuevo usuario
- Formulario mantiene datos excepto contraseña

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-003: Registro con contraseña débil
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Acceder a la página de registro
2. Completar formulario con contraseña "123"
3. Hacer clic en "Registrarse"

**Resultado Esperado:**
- Se muestra error "Contraseña debe tener al menos 8 caracteres"
- No se registra usuario

**Resultado Obtenido:** ✅ PASÓ

---

## 2. Inicio de Sesión

### CP-AUTH-004: Login exitoso
**Prioridad:** Alta  
**Tipo:** Positivo  
**Precondiciones:** Usuario registrado en el sistema

**Pasos:**
1. Acceder a la página de login
2. Ingresar credenciales válidas:
   - Email: "juan.perez@email.com"
   - Contraseña: "Password123!"
3. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- Usuario inicia sesión exitosamente
- Se redirige al dashboard
- Se muestra información del usuario
- Se genera token de sesión

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-005: Login con credenciales incorrectas
**Prioridad:** Alta  
**Tipo:** Negativo  

**Pasos:**
1. Acceder a la página de login
2. Ingresar contraseña incorrecta
3. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- Se muestra error "Credenciales incorrectas"
- No se inicia sesión
- Formulario mantiene email

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-006: Login con email inexistente
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Acceder a la página de login
2. Ingresar email no registrado
3. Hacer clic en "Iniciar Sesión"

**Resultado Esperado:**
- Se muestra error "Usuario no encontrado"
- No se inicia sesión

**Resultado Obtenido:** ✅ PASÓ

---

## 3. Recuperación de Contraseña

### CP-AUTH-007: Solicitud de recuperación exitosa
**Prioridad:** Media  
**Tipo:** Positivo  
**Precondiciones:** Usuario registrado

**Pasos:**
1. Acceder a "Olvidé mi contraseña"
2. Ingresar email válido
3. Hacer clic en "Enviar"

**Resultado Esperado:**
- Se envía email con link de recuperación
- Se muestra mensaje de confirmación
- Link expira en 24 horas

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-008: Recuperación con email inexistente
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Acceder a "Olvidé mi contraseña"
2. Ingresar email no registrado
3. Hacer clic en "Enviar"

**Resultado Esperado:**
- Se muestra mensaje genérico de confirmación (por seguridad)
- No se envía email

**Resultado Obtenido:** ✅ PASÓ

---

## 4. Gestión de Perfiles

### CP-AUTH-009: Actualización de perfil exitosa
**Prioridad:** Media  
**Tipo:** Positivo  
**Precondiciones:** Usuario logueado

**Pasos:**
1. Acceder a "Mi Perfil"
2. Modificar información personal
3. Hacer clic en "Guardar"

**Resultado Esperado:**
- Se actualiza información del usuario
- Se muestra mensaje de confirmación
- Cambios se reflejan inmediatamente

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-010: Cambio de contraseña exitoso
**Prioridad:** Media  
**Tipo:** Positivo  

**Pasos:**
1. Acceder a "Cambiar Contraseña"
2. Ingresar contraseña actual
3. Ingresar nueva contraseña
4. Confirmar nueva contraseña
5. Hacer clic en "Cambiar"

**Resultado Esperado:**
- Se actualiza contraseña
- Se muestra mensaje de confirmación
- Se mantiene sesión activa

**Resultado Obtenido:** ✅ PASÓ

---

## 5. Control de Acceso y Roles

### CP-AUTH-011: Acceso a funcionalidades según rol
**Prioridad:** Alta  
**Tipo:** Positivo  

**Casos de Prueba:**
- **Cliente:** Acceso a catálogo, carrito, historial
- **Admin:** Acceso completo al sistema
- **Vendedor:** Acceso a ventas y inventario

**Resultado Esperado:**
- Cada rol ve solo las funcionalidades permitidas
- Menús se adaptan según permisos
- Acceso denegado a funcionalidades no autorizadas

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-012: Protección de rutas privadas
**Prioridad:** Alta  
**Tipo:** Negativo  

**Pasos:**
1. Intentar acceder a ruta privada sin autenticación
2. Intentar acceder a ruta de admin como cliente

**Resultado Esperado:**
- Se redirige al login
- Se muestra mensaje de acceso denegado
- No se puede acceder a funcionalidades restringidas

**Resultado Obtenido:** ✅ PASÓ

---

## 6. Cierre de Sesión

### CP-AUTH-013: Cierre de sesión exitoso
**Prioridad:** Alta  
**Tipo:** Positivo  
**Precondiciones:** Usuario logueado

**Pasos:**
1. Hacer clic en "Cerrar Sesión"
2. Confirmar acción

**Resultado Esperado:**
- Se cierra sesión
- Se elimina token
- Se redirige al login
- No se puede acceder a rutas privadas

**Resultado Obtenido:** ✅ PASÓ

---

## 7. Casos de Borde

### CP-AUTH-014: Sesión expirada
**Prioridad:** Media  
**Tipo:** Negativo  

**Pasos:**
1. Mantener sesión inactiva por 30 minutos
2. Intentar realizar acción

**Resultado Esperado:**
- Se redirige al login
- Se muestra mensaje "Sesión expirada"
- Datos de formulario se mantienen

**Resultado Obtenido:** ✅ PASÓ

---

### CP-AUTH-015: Múltiples sesiones
**Prioridad:** Baja  
**Tipo:** Positivo  

**Pasos:**
1. Iniciar sesión en múltiples dispositivos
2. Cerrar sesión en uno
3. Verificar estado en otros

**Resultado Esperado:**
- Se permite múltiples sesiones
- Cierre en un dispositivo no afecta otros
- Cada sesión es independiente

**Resultado Obtenido:** ✅ PASÓ

---

## Resumen de Resultados

| Caso de Prueba | Estado | Observaciones |
|----------------|--------|---------------|
| CP-AUTH-001 | ✅ PASÓ | Registro funciona correctamente |
| CP-AUTH-002 | ✅ PASÓ | Validación de email duplicado OK |
| CP-AUTH-003 | ✅ PASÓ | Validación de contraseña OK |
| CP-AUTH-004 | ✅ PASÓ | Login exitoso |
| CP-AUTH-005 | ✅ PASÓ | Manejo de credenciales incorrectas |
| CP-AUTH-006 | ✅ PASÓ | Email inexistente manejado |
| CP-AUTH-007 | ✅ PASÓ | Recuperación de contraseña OK |
| CP-AUTH-008 | ✅ PASÓ | Seguridad en recuperación |
| CP-AUTH-009 | ✅ PASÓ | Actualización de perfil OK |
| CP-AUTH-010 | ✅ PASÓ | Cambio de contraseña OK |
| CP-AUTH-011 | ✅ PASÓ | Control de roles implementado |
| CP-AUTH-012 | ✅ PASÓ | Protección de rutas OK |
| CP-AUTH-013 | ✅ PASÓ | Cierre de sesión OK |
| CP-AUTH-014 | ✅ PASÓ | Manejo de sesión expirada |
| CP-AUTH-015 | ✅ PASÓ | Múltiples sesiones OK |

**Total:** 15 casos de prueba  
**Pasaron:** 15 (100%)  
**Fallaron:** 0 (0%)  
**Cobertura:** Completa del módulo de autenticación 