const express = require('express');

const router = express.Router();

const carritoController = require('../Controllers/CartControllers');

// Definición de rutas y sus controladores

router.post('/', carritoController.crearCart); // Ruta para crear un nuevo carrito

router.get('/:cid', carritoController.getCartId); // Ruta para obtener un carrito por ID

router.post('/:cid/product/:pid', carritoController.agregarProductoCart); // Ruta para agregar un producto al carrito

module.exports = router;