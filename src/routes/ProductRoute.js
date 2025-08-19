const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Obtener todos los productos
router.get('/', ProductController.getAllProducts);

// Obtener un producto por su id
router.get('/:pid', ProductController.getProductById);

// Crear un nuevo producto
router.post('/', ProductController.addProduct);

// Actualizar un producto (se pasa el id en la URL)
router.put('/:pid', ProductController.updateProduct);

// Eliminar un producto (se pasa el id en la URL)
router.delete('/:pid', ProductController.deleteProduct);

// Ruta para renderizar la vista home (opcional, si la necesitas)
router.get('/home', ProductController.renderHome);

module.exports = router;


