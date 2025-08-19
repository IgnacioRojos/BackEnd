const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');

// Crear un carrito
router.post('/create', CartController.createCart);

// Obtener los productos de un carrito específico
router.get('/:cid', CartController.getCartProducts);

// Agregar un producto al carrito (PUT)
router.put('/:cid/product/:pid', CartController.addProductToCart);

// Eliminar un producto del carrito (DELETE)
router.delete('/:cid/products/:pid', CartController.deleteProductFromCart);

// Vista para ver el carrito (GET)
router.get('/view/:cid', CartController.renderCartView);


module.exports = router;
