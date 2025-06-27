const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// IMPORTAR CONTROLADOR CORRECTAMENTE
const productosController = require('../controllers/productos.controller');

// Configuración de multer para imágenes
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/productos/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de multer para CSV
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/productos/bulk/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'productos-' + uniqueSuffix + '.csv');
  }
});

const uploadImage = multer({ 
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadCSV = multer({ 
  storage: csvStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos con promociones y ofertas
 */

/**
 * @swagger
 * /api/v1/productos:
 *   get:
 *     summary: Listar productos con promociones aplicadas
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
 *       - in: query
 *         name: precio_min
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: precio_max
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: solo_ofertas
 *         schema:
 *           type: boolean
 *         description: Mostrar solo productos en oferta
 *     responses:
 *       200:
 *         description: Lista de productos con promociones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     productos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           precio:
 *                             type: number
 *                           tiene_promocion:
 *                             type: boolean
 *                           precio_final:
 *                             type: number
 *                           descuento_porcentaje:
 *                             type: number
 *                           etiqueta_promocion:
 *                             type: string
 *                     estadisticas_promociones:
 *                       type: object
 *                       properties:
 *                         total_productos:
 *                           type: integer
 *                         productos_con_oferta:
 *                           type: integer
 *                         porcentaje_en_oferta:
 *                           type: integer
 *                         ahorro_total_disponible:
 *                           type: number
 */
router.get('/', productosController.listarProductos);

/**
 * @swagger
 * /api/v1/productos/ofertas:
 *   get:
 *     summary: Obtener SOLO productos en oferta
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
 *     responses:
 *       200:
 *         description: Lista de ofertas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     ofertas:
 *                       type: array
 *                       items:
 *                         type: object
 *                     estadisticas:
 *                       type: object
 *                       properties:
 *                         total_ofertas:
 *                           type: integer
 *                         ahorro_total:
 *                           type: number
 */
router.get('/ofertas', productosController.obtenerOfertas);

/**
 * @swagger
 * /api/v1/productos/categorias:
 *   get:
 *     summary: Listar categorías con estadísticas de promociones
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de categorías con estadísticas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       total_productos:
 *                         type: integer
 *                       productos_con_promocion:
 *                         type: integer
 *                       porcentaje_promocion:
 *                         type: integer
 */
router.get('/categorias', productosController.listarCategorias);

/**
 * @swagger
 * /api/v1/productos/marcas:
 *   get:
 *     summary: Listar marcas con información de promociones
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de marcas con promociones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       total_productos:
 *                         type: integer
 *                       tiene_promocion_marca:
 *                         type: boolean
 *                       descuento_marca:
 *                         type: integer
 *                       etiqueta_promocion:
 *                         type: string
 */
router.get('/marcas', productosController.listarMarcas);

/**
 * @swagger
 * /api/v1/productos/estadisticas-promociones:
 *   get:
 *     summary: Obtener estadísticas generales de promociones
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Estadísticas de promociones obtenidas exitosamente
 */
router.get('/estadisticas-promociones', (req, res) => {
  res.json({
    success: true,
    data: {
      promociones_activas: 6,
      productos_en_oferta: 85,
      ahorro_promedio: 22,
      mejor_descuento: 35,
      marcas_con_promocion: ['Stanley', 'Bosch', 'DeWalt', 'Makita'],
      proximas_ofertas: [
        {
          nombre: 'Cyber Week',
          inicio: '2024-12-03',
          descuento: 'Hasta $25.000 OFF'
        },
        {
          nombre: 'Fin de Año',
          inicio: '2024-12-15',
          descuento: '30% en productos seleccionados'
        }
      ]
    },
    message: 'Estadísticas de promociones actualizadas'
  });
});

/**
 * @swagger
 * /api/v1/productos/buscar:
 *   get:
 *     summary: Buscar productos por nombre o descripción
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda
 *       - in: query
 *         name: incluir_ofertas
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Incluir información de ofertas
 *     responses:
 *       200:
 *         description: Resultados de búsqueda con promociones
 */
router.get('/buscar', async (req, res) => {
  try {
    const { q, incluir_ofertas = true } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }

    // Simular búsqueda con promociones
    const termino = q.toLowerCase();
    const resultadosEjemplo = [];
    
    if (termino.includes('taladro')) {
      resultadosEjemplo.push({
        id: 8,
        nombre: 'Taladro Inalámbrico DeWalt 20V',
        precio: 89990,
        tiene_promocion: true,
        descuento_porcentaje: 18,
        precio_final: 73592,
        etiqueta_promocion: 'DEWALT18'
      });
    }
    
    if (termino.includes('sierra')) {
      resultadosEjemplo.push({
        id: 9,
        nombre: 'Sierra Caladora Bosch GST 160',
        precio: 65990,
        tiene_promocion: true,
        descuento_porcentaje: 20,
        precio_final: 52792,
        etiqueta_promocion: 'BOSCH20'
      });
    }

    res.json({
      success: true,
      data: {
        productos: resultadosEjemplo,
        termino_busqueda: q,
        total_encontrados: resultadosEjemplo.length,
        con_promociones: incluir_ofertas
      },
      message: `${resultadosEjemplo.length} productos encontrados para "${q}"`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   get:
 *     summary: Obtener un producto específico con promociones
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
 *         description: Detalles del producto con promociones aplicadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *                     tiene_promocion:
 *                       type: boolean
 *                     promocion_activa:
 *                       type: object
 *                     precio_final:
 *                       type: number
 *                     ahorro_total:
 *                       type: number
 *                     todas_promociones:
 *                       type: array
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
 *               codigo_sku:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               marca_id:
 *                 type: integer
 *               ficha_tecnica:
 *                 type: object
 *               stock_inicial:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', productosController.crearProducto);

/**
 * @swagger
 * /api/v1/productos/{id}:
 *   put:
 *     summary: Actualizar un producto existente
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
 *     summary: Eliminar un producto (soft delete)
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

// RUTAS ESPECIALES PARA ADMINISTRACIÓN

/**
 * @swagger
 * /api/v1/productos/carga-masiva:
 *   post:
 *     summary: Carga masiva de productos via CSV
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
 *                 description: Archivo CSV con productos
 *     responses:
 *       200:
 *         description: Carga masiva completada
 *       400:
 *         description: Archivo CSV requerido
 */
router.post('/carga-masiva', uploadCSV.single('archivo'), productosController.cargaMasiva);

/**
 * @swagger
 * /api/v1/productos/{id}/imagen:
 *   post:
 *     summary: Subir imagen para un producto
 *     tags: [Productos]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Imagen requerida
 *       404:
 *         description: Producto no encontrado
 */
router.post('/:id/imagen', uploadImage.single('imagen'), productosController.subirImagen);

/**
 * @swagger
 * /api/v1/productos/plantilla-csv:
 *   get:
 *     summary: Descargar plantilla CSV para carga masiva
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Plantilla CSV descargada
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/plantilla-csv', (req, res) => {
  const csvContent = `nombre,descripcion,precio,codigo_sku,categoria_id,marca_id,stock_inicial
"Producto Ejemplo","Descripción del producto",29990,"PROD-001",1,1,10
"Otro Producto","Otra descripción",45990,"PROD-002",2,2,5`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="plantilla-productos.csv"');
  res.send(csvContent);
});

module.exports = router;