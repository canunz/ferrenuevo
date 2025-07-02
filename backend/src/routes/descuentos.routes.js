const express = require('express');
const router = express.Router();
const descuentosController = require('../controllers/descuentos.controller');

router.get('/', descuentosController.getAll);
router.post('/', descuentosController.create);
router.put('/:id', descuentosController.update);
router.delete('/:id', descuentosController.delete);
router.get('/producto/:producto_id', descuentosController.getByProducto);

module.exports = router; 