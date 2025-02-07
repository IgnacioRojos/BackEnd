const express = require('express');
const router = express.Router();
const productController = require('../Controllers/ProductControllers'); 

// Definición de rutas y sus controladores

router.get('/', productController.getAllProductos); 

router.get('/:pid', productController.GetProductosById);

router.post('/', productController.añadirProducto);

router.put('/:pid', productController.ActualizarProducto);

router.delete('/:pid', productController.EliminarProducto);

module.exports = router;

