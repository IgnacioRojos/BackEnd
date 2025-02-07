const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Definición de rutas y sus controladores
router.get('/', productController.getAllProducts); // Ruta para obtener todos los productos
router.get('/:pid', productController.getProductById); // Ruta para obtener un producto por ID
router.post('/', productController.addProduct); // Ruta para agregar un nuevo producto
router.put('/:pid', productController.updateProduct); // Ruta para actualizar un producto
router.delete('/:pid', productController.deleteProduct); // Ruta para eliminar un producto

module.exports = router;