const express = require('express');  
const router = express.Router();  
const ProductController = require('../controllers/ProductController'); 

// Definición de rutas:

// Obtener todos los productos
router.get('/', ProductController.getAllProducts);

// Obtener un producto por su id
router.get('/:pid', ProductController.getProductById);

// Crear un nuevo producto
router.post('/', ProductController.addProduct);

// Actualizar un producto
router.put('/:pid', ProductController.updateProduct);

// Eliminar un producto
router.delete('/:pid', ProductController.deleteProduct);

module.exports = router; 


