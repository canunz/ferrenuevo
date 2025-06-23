const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');

/**
 * @swagger
 * /api/v1/productos:
 *   get:
 *     summary: Listar productos
 *     tags: [Productos]
 *     parameters:
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
 *           default: 12
 *         description: Cantidad de items por página
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filtrar por categoría
 *       - in: query
 *         name: marca_id
 *         schema:
 *           type: integer
 *         description: Filtrar por marca
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 */
router.get('/', productosController.listarProductos);

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
 * /api/v1/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 */
router.post('/', productosController.crearProducto);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   put:
 *     summary: Actualizar un producto
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
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', productosController.actualizarProducto);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
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
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', productosController.eliminarProducto);

/**
 * @swagger
 * /api/v1/productos/carga-masiva:
 *   post:
 *     summary: Carga masiva de productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Carga masiva completada
 */
router.post('/carga-masiva', productosController.cargaMasiva);

module.exports = router; 