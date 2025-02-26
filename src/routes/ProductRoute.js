const express = require('express');  
const router = express.Router();  
const ProductController = require('../controllers/ProductController'); 

// Definición de rutas:

// Obtener todos los productos
router.get('/', ProductController.getAllProducts);

// Obtener un producto por su id
router.get('/encontrar', ProductController.getProductById);

// Crear un nuevo producto
router.post('/product', ProductController.addProduct);


// Actualizar un producto
router.put('/update', ProductController.updateProduct);

// Eliminar un producto
router.delete('/delete', ProductController.deleteProduct);

module.exports = router; 


