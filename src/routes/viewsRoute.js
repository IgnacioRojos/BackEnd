const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();
const CartManager = require("../managers/CartManager"); // Importa el CartManager
const cartManager = new CartManager();

// Ruta para mostrar los productos con paginación, ordenación y filtros
router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = 'asc', query = '', category } = req.query;
        
        let filter = { $and: [] };

        if (category) filter.$and.push({ category });
        if (query) {
            const [key, value] = query.split(':');
            if (key && value) {
                filter.$and.push({ [key]: value });
            }
        }
        
        if (filter.$and.length === 0) delete filter.$and; // Si no hay filtros, eliminar `$and`

        // ⚠️ Aquí se usa `.lean()` para devolver objetos JSON puros
        const result = await productManager.getAllProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            filter
        });

        

        console.log("Productos enviados a Handlebars:", result.docs);

        res.render('products', { 
            products: result.docs, 
            totalPages: result.totalPages,
            page: result.page,
            prevPage: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
            nextPage: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
            cartId  // Pasar el cartId al template de Handlebars
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error al cargar los productos');
    }
});

// Ruta para mostrar el detalle de un producto
router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto');
    }
});

router.get('/cart', (req, res) => {
    res.render('carts');  
});

module.exports = router;