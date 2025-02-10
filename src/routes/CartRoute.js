// src/routes/CartRoute.js

const express = require('express'); // Importar express
const router = express.Router(); // Crear un enrutador
const CartController = require('../controllers/CartController');  // Importar el controlador para los carritos

// Definición de rutas
// Crear un carrito
router.post('/', CartController.createCart);

// Obtener los productos de un carrito específico
router.get('/:cid', CartController.getCartProducts);

// Agregar un producto al carrito
router.post('/:cid/product/:pid', CartController.addProductToCart);

module.exports = router; // Exportar el enrutador
