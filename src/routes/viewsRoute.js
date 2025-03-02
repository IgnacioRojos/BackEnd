const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

// Ruta para la vista "home"
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts(); 
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al cargar la página de inicio');
    }
});

// Ruta para la vista "productTiempoReal"
router.get('/productTiempoReal', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render('productTiempoReal', { products });
});

module.exports = router;