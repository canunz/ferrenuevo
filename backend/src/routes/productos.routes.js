const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { body, query, validationResult } = require('express-validator');
const upload = require('../middleware/upload');
const uploadCsv = require('../middleware/uploadCsv');
const { verificarToken, verificarRol } = require('../middleware/auth');

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
 * /api/productos:
 *   get:
 *     summary: Listar productos
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de items por página
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       precio:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       categoria:
 *                         type: string
 */
router.get('/', [
  query('categoria').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], productosController.listarProductos);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - stock
 *               - categoria
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Martillo Profesional
 *               descripcion:
 *                 type: string
 *                 example: Martillo de acero forjado con mango ergonómico
 *               precio:
 *                 type: number
 *                 minimum: 0
 *                 example: 29.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               categoria:
 *                 type: string
 *                 example: Herramientas
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para crear productos
 */
router.post('/', verificarToken, verificarRol(['admin']), [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('categoria').notEmpty().withMessage('La categoría es requerida')
], productosController.crearProducto);

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
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto específico
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
 *         description: Detalles del producto
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productosController.obtenerProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *                 minimum: 0
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para actualizar productos
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', verificarToken, verificarRol(['admin']), [
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('precio').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('categoria').optional().notEmpty().withMessage('La categoría no puede estar vacía')
], productosController.actualizarProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para eliminar productos
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', verificarToken, verificarRol(['admin']), productosController.eliminarProducto);

/**
 * @swagger
 * /api/v1/productos/carga-masiva:
 *   post:
 *     summary: Carga masiva de productos desde un archivo CSV
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Productos cargados exitosamente
 */
router.post('/carga-masiva', uploadCsv.single('archivo'), productosController.cargaMasiva);

module.exports = router;