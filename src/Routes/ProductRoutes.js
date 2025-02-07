const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const productController = require('../Controllers/ProductControllers'); 

// Definición de rutas y sus controladores

router.get('/', productController.getAllProductos); 

router.get('/:pid', productController.GetProductosById);

router.post('/', productController.añadirProducto);

router.put('/:pid', productController.ActualizarProducto);

router.delete('/:pid', productController.EliminarProducto);

module.exports = router;

=======
const productController = require('../controllers/productController');

// Definición de rutas y sus controladores
router.get('/', productController.getAllProducts); // Ruta para obtener todos los productos
router.get('/:pid', productController.getProductById); // Ruta para obtener un producto por ID
router.post('/', productController.addProduct); // Ruta para agregar un nuevo producto
router.put('/:pid', productController.updateProduct); // Ruta para actualizar un producto
router.delete('/:pid', productController.deleteProduct); // Ruta para eliminar un producto

module.exports = router;
>>>>>>> e5318dd2da95ba63baa0c93b5bfbdcaa49bc40f0
