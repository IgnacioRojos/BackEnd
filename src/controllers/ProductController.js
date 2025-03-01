const ProductManager  = require('../managers/ProductManager.js');

let productManager;

// Función para inicializar `ProductManager` correctamente
const initializeProductManager = async () => {
    productManager = new ProductManager();
    await new Promise(resolve => setTimeout(resolve, 500)); // Esperar carga del archivo
};

initializeProductManager(); // Llamar a la inicialización antes de procesar rutas

const getAllProducts = async (req, res) => {
 
    try {
        const products = await productManager.getAllProducts();
        res.render('productTiempoReal', { products: products });  // Aquí pasas el array de productos como parte de un objeto con la clave 'products'
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
    
    
    
    
};

const getProductById = async (req, res) => {
    const { id } = req.query;
    const product = await productManager.getProductById(parseInt(id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

const addProduct = async (req, res) => {
    
    try {
        const product = req.body; // Recibir el producto del body
        const newProduct = await productManager.addProduct(product); // Llamar a ProductManager

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

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};






















