/*const express = require('express');

const router = express.Router();

const productController = require('../controllers/ProductController'); 

// Definición de rutas y sus controladores

router.get('/', productController.getAllProductos); 

router.get('/:pid', productController.GetProductosById);

router.post('/', productController.añadirProducto);

router.put('/:pid', productController.ActualizarProducto);

router.delete('/:pid', productController.EliminarProducto);

module.exports = router;
*/

/*const productController = require('../controllers/productController');

// Definición de rutas y sus controladores
router.get('/', productController.getAllProducts); // Ruta para obtener todos los productos
router.get('/:pid', productController.getProductById); // Ruta para obtener un producto por ID
router.post('/', productController.addProduct); // Ruta para agregar un nuevo producto
router.put('/:pid', productController.updateProduct); // Ruta para actualizar un producto
router.delete('/:pid', productController.deleteProduct); // Ruta para eliminar un producto

module.exports = router;*/
// src/routes/ProductRoute.js

const express = require('express');  // Importación de express
const router = express.Router();  // Crear un enrutador
const ProductController = require('../controllers/ProductController'); // Importar el controlador para productos

// Definición de rutas
// Obtener todos los productos
router.get('/', ProductController.getAllProducts);

// Obtener un producto por su id
router.get('/:pid', ProductController.getProductById);

// Crear un nuevo producto
router.post('/', ProductController.createProduct);

// Actualizar un producto
router.put('/:pid', ProductController.updateProduct);

// Eliminar un producto
router.delete('/:pid', ProductController.deleteProduct);

module.exports = router; // Exportar el enrutador


