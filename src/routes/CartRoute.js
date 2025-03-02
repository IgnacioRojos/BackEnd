const express = require('express'); 
const router = express.Router(); 
const CartController = require('../controllers/CartController');  




// Crear un carrito

router.post('/create', CartController.createCart);

// Obtener los productos de un carrito específico

router.get('/:cid', CartController.getCartProducts);

// Agregar un producto al carrito

router.post('/agregar/product/:cid/:pid', CartController.addProductToCart);

module.exports = router; 
