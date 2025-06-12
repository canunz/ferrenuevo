const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { body, query, validationResult } = require('express-validator');
const upload = require('../middleware/upload');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Errores de validación',
      details: errors.array(),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - categoria_id
 *         - marca_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción del producto
 *         precio:
 *           type: number
 *           description: Precio del producto
 *         precio_oferta:
 *           type: number
 *           description: Precio de oferta
 *         categoria_id:
 *           type: integer
 *           description: ID de la categoría
 *         marca_id:
 *           type: integer
 *           description: ID de la marca
 *         imagen_url:
 *           type: string
 *           description: URL de la imagen
 *         activo:
 *           type: boolean
 *           description: Si el producto está activo
 */

/**
 * @swagger
 * /api/v1/productos:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Productos por página
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    handleValidationErrors
  ],
  productosController.listarProductos
);

/**
 * @swagger
 * /api/v1/productos/buscar:
 *   get:
 *     summary: Buscar productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/buscar',
  [
    query('q').isLength({ min: 2 }).withMessage('El término de búsqueda debe tener al menos 2 caracteres'),
    handleValidationErrors
  ],
  productosController.buscarProductos
);

/**
 * @swagger
 * /api/v1/productos/categorias:
 *   get:
 *     summary: Listar todas las categorías
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 */
router.get('/categorias', productosController.listarCategorias);

/**
 * @swagger
 * /api/v1/productos/marcas:
 *   get:
 *     summary: Listar todas las marcas
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de marcas obtenida exitosamente
 */
router.get('/marcas', productosController.listarMarcas);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productosController.obtenerProducto);

/**
 * @swagger
 * /api/v1/productos:
 *   post:
 *     summary: Crear nuevo producto (Solo administradores)
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - categoria_id
 *               - marca_id
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               categoria_id:
 *                 type: integer
 *               marca_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/',
  upload.single('imagen'),
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser mayor a 0'),
    body('categoria_id').isInt().withMessage('La categoría es requerida'),
    body('marca_id').isInt().withMessage('La marca es requerida'),
    handleValidationErrors
  ],
  productosController.crearProducto
);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 */
router.put('/:id',
  upload.single('imagen'),
  [
    body('nombre').optional().notEmpty(),
    body('precio').optional().isFloat({ min: 0 }),
    handleValidationErrors
  ],
  productosController.actualizarProducto
);

module.exports = router;