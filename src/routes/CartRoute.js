const express = require('express'); 
const router = express.Router(); 
const CartController = require('../controllers/CartController');

// Crear un carrito
router.post('/create', CartController.createCart);

// Obtener los productos de un carrito específico
router.get('/:cid', CartController.getCartProducts);

// Agregar un producto al carrito (usando PUT, ya que es una modificación)
router.put('/api/carts/:cid/product/:pid', CartController.addProductToCart);


router.delete('/:cid/product/:pid', CartController.deleteProductFromCart);

// Vista para ver el carrito (corregida)
router.get('/cart/view', CartController.renderCartView);

module.exports = router;