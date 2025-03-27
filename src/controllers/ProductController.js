const ProductManager  = require('../managers/ProductManager.js');

let productManager;

const { Product } = require("../models/product.js")

const {Cart} = require("../models/cart.js")



const initializeProductManager = async () => {
    productManager = new ProductManager();
    await new Promise(resolve => setTimeout(resolve, 500)); 
};

initializeProductManager(); 





const getAllProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query, category, available } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (available !== undefined) filter.available = available === 'true';
        if (query) {
            const [key, value] = query.split(':');
            if (key && value) filter[key] = value;
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
        };

        const products = await Product.paginate(filter, options);

        // Responder sin hacer manipulación extra de los datos
        res.json({
            status: 'success',
            payload: products.docs, 
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error obteniendo productos', error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;

        // Validar si el ID es un ObjectId válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Buscar el producto en la base de datos
        const product = await productManager.getProductById(pid);

        // Verificar si el producto existe
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Enviar la respuesta con el producto encontrado
        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;

        if (!name || !category || !price || !stock) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newProduct = await productManager.addProduct(req.body);

        // Emitir evento de WebSocket para actualizar la lista en tiempo real
        io.emit('productListUpdate', await productManager.getAllProducts());

        res.status(201).json({ message: "Producto agregado", product: newProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "Missing product ID in query params" });
        }

        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const updatedProduct = await productManager.updateProduct(parseInt(id), updateData);

        if (updatedProduct) {
            res.json({ message: "Product updated successfully", product: updatedProduct });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.query;
        const updatedProducts = await productManager.deleteProduct(parseInt(id));

        // Emitir evento de WebSocket para actualizar la lista en tiempo real

        io.emit('productListUpdate', updatedProducts);

        res.json(updatedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const renderHome = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener productos de la base de datos

        let cart;
        if (req.user) {
            // Si el usuario está autenticado, obtenemos su carrito
            cart = await Cart.findOne({ userId: req.user._id });
            if (!cart) {
                // Si no tiene carrito, lo creamos
                cart = await Cart.create({ userId: req.user._id, products: [] });
            }
        } else {
            // Si el usuario no está autenticado, creamos un carrito anónimo
            cart = await Cart.findOne({ isAnonymous: true });
            if (!cart) {
                // Si no existe un carrito anónimo, creamos uno
                cart = await Cart.create({ isAnonymous: true, products: [] });
            }
        }

        // Renderizamos la vista 'home' pasando los productos y el carrito
        res.render('home', { products, cart });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Error cargando la página principal', 
            error: error.message 
        });
    }
};
module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    renderHome
};






















/*const getAllProducts = async (req, res) => {
 
    try {
        const products = await productManager.getAllProducts();
        res.render('productTiempoReal', { products: products });  
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
    
    
    
    
};*/