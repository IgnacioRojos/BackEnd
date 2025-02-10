const express = require('express'); 
const router = express.Router(); 
const CartController = require('../controllers/CartController');  

// Definición de rutas:


// Crear un carrito
router.post('/', CartController.createCart);

// Obtener los productos de un carrito específico
router.get('/:cid', CartController.getCartProducts);

// Agregar un producto al carrito
router.post('/:cid/product/:pid', CartController.addProductToCart);

module.exports = router; 
