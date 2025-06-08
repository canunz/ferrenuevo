// ============================================
// ARCHIVO: docs/swagger.js
// ============================================
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FERREMAS API',
      version: '1.0.0',
      description: `
        API RESTful para el sistema de comercio electrónico FERREMAS.
        
        **Funcionalidades principales:**
        - 🔐 Sistema de autenticación con JWT
        - 🛍️ Catálogo completo de productos
        - 📦 Gestión de pedidos y entregas
        - 💳 Integración con MercadoPago
        - 📊 Sistema de reportes empresariales
        - 💱 Conversión de divisas en tiempo real
        - 📦 Control de inventario por sucursal
        
        **Roles de usuario:**
        - **Cliente**: Navegar catálogo, realizar pedidos, hacer pagos
        - **Vendedor**: Aprobar/rechazar pedidos, gestionar ventas
        - **Bodeguero**: Preparar pedidos, gestionar inventario
        - **Contador**: Procesar pagos, generar reportes financieros
        - **Administrador**: Acceso completo al sistema
      `,
      contact: {
        name: 'Equipo FERREMAS',
        email: 'admin@ferremas.cl',
        url: 'https://ferremas.cl'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.ferremas.cl',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido al hacer login. Formato: `Bearer <token>`'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'juan@email.com'
            },
            rol: {
              type: 'string',
              enum: ['cliente', 'administrador', 'vendedor', 'bodeguero', 'contador'],
              description: 'Rol del usuario en el sistema',
              example: 'cliente'
            },
            activo: {
              type: 'boolean',
              description: 'Estado activo del usuario',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
              example: '2025-01-15T10:30:00Z'
            }
          }
        },
        Producto: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del producto',
              example: 1
            },
            nombre: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Taladro Eléctrico 20V'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción detallada del producto',
              example: 'Taladro inalámbrico con batería de litio'
            },
            precio: {
              type: 'number',
              format: 'float',
              description: 'Precio en pesos chilenos',
              example: 59990.00
            },
            codigo_sku: {
              type: 'string',
              description: 'Código SKU único del producto',
              example: 'TAL-20V-001'
            },
            categoria: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                nombre: { type: 'string', example: 'Herramientas Eléctricas' }
              }
            },
            marca: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'DeWalt' }
              }
            },
            activo: {
              type: 'boolean',
              description: 'Estado activo del producto',
              example: true
            }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del pedido',
              example: 1
            },
            numero_pedido: {
              type: 'string',
              description: 'Número único del pedido',
              example: 'PED-1640995200000-ABC1'
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'aprobado', 'rechazado', 'preparando', 'listo', 'enviado', 'entregado', 'cancelado'],
              description: 'Estado actual del pedido',
              example: 'pendiente'
            },
            subtotal: {
              type: 'number',
              format: 'float',
              description: 'Subtotal del pedido',
              example: 119980.00
            },
            total: {
              type: 'number',
              format: 'float',
              description: 'Total del pedido',
              example: 119980.00
            },
            metodo_entrega: {
              type: 'string',
              enum: ['retiro_tienda', 'despacho_domicilio'],
              description: 'Método de entrega seleccionado',
              example: 'retiro_tienda'
            },
            cliente: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                nombre: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@email.com' }
              }
            }
          }
        },
        Inventario: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del registro de inventario',
              example: 1
            },
            stock_actual: {
              type: 'integer',
              description: 'Stock actual disponible',
              example: 25
            },
            stock_minimo: {
              type: 'integer',
              description: 'Stock mínimo requerido',
              example: 5
            },
            stock_maximo: {
              type: 'integer',
              description: 'Stock máximo permitido',
              example: 50
            },
            ubicacion: {
              type: 'string',
              description: 'Ubicación física en la sucursal',
              example: 'Pasillo A-1'
            },
            producto: {
              $ref: '#/components/schemas/Producto'
            },
            sucursal: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'FERREMAS Centro' }
              }
            }
          }
        },
        Pago: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del pago',
              example: 1
            },
            monto: {
              type: 'number',
              format: 'float',
              description: 'Monto del pago',
              example: 59990.00
            },
            estado: {
              type: 'string',
              enum: ['pendiente', 'aprobado', 'rechazado', 'cancelado'],
              description: 'Estado del pago',
              example: 'aprobado'
            },
            referencia_externa: {
              type: 'string',
              description: 'Referencia externa del pago',
              example: 'MP_123456789'
            },
            fecha_pago: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora del pago',
              example: '2025-01-15T14:30:00Z'
            },
            metodo_pago: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                nombre: { type: 'string', example: 'MercadoPago' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Recurso no encontrado'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp del error',
              example: '2025-01-15T10:30:00Z'
            },
            detalles: {
              type: 'object',
              description: 'Detalles adicionales del error (opcional)'
            }
          }
        },
        RespuestaExitosa: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Mensaje descriptivo',
              example: 'Operación exitosa'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de la respuesta',
              example: '2025-01-15T10:30:00Z'
            },
            meta: {
              type: 'object',
              description: 'Metadatos (paginación, etc.)',
              properties: {
                page: { type: 'integer', example: 1 },
                limit: { type: 'integer', example: 10 },
                total: { type: 'integer', example: 100 },
                totalPages: { type: 'integer', example: 10 }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Token requerido',
                timestamp: '2025-01-15T10:30:00Z'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Sin permisos para acceder al recurso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Acceso denegado',
                timestamp: '2025-01-15T10:30:00Z'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Recurso no encontrado',
                timestamp: '2025-01-15T10:30:00Z'
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación de datos',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { type: 'string', example: 'Datos inválidos' },
                  message: { type: 'string', example: 'Los datos proporcionados no son válidos' },
                  detalles: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        campo: { type: 'string', example: 'email' },
                        valor: { type: 'string', example: 'email_invalido' },
                        mensaje: { type: 'string', example: 'Debe ser un email válido' }
                      }
                    }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: 'Error interno del servidor',
                timestamp: '2025-01-15T10:30:00Z'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Sistema',
        description: 'Endpoints del sistema y estado general'
      },
      {
        name: 'Autenticación',
        description: 'Gestión de usuarios y autenticación'
      },
      {
        name: 'Productos',
        description: 'Catálogo de productos y gestión'
      },
      {
        name: 'Pedidos',
        description: 'Gestión de pedidos y órdenes'
      },
      {
        name: 'Pagos',
        description: 'Procesamiento de pagos y transacciones'
      },
      {
        name: 'Inventario',
        description: 'Control de stock e inventario'
      },
      {
        name: 'Divisas',
        description: 'Conversión de monedas y divisas'
      },
      {
        name: 'Reportes',
        description: 'Reportes empresariales y analytics'
      }
    ],
    externalDocs: {
      description: 'Documentación completa del proyecto FERREMAS',
      url: 'https://docs.ferremas.cl'
    }
  },
  apis: [
    './src/routes/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;