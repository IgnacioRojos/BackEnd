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
        res.json(products);
    } catch (error) {
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
    
        res.status(201).json({ message: "Producto agregado", product: newProduct });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    
    






    /*try {
        const product = req.body;
        const newProduct = await productManager.addProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }*/
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
    
    
    
    
    
    /*const { id } = req.query;
    const updateData = req.body;
    const updatedProduct = await productManager.updateProduct(parseInt(id), updateData);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }*/
};

const deleteProduct = async (req, res) => {
    const { id } = req.query;
    const products = await productManager.deleteProduct(parseInt(id));
    if (products) {
        res.json(products);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};






















/*const ProductManager = require('../managers/ProductManager.js');

const productManager = new ProductManager();

const getAllProducts = async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

const addProduct = async (req, res) => {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    res.status(201).json(newProduct);
};

const updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    const updatedProduct = await productManager.updateProduct(parseInt(pid), updateData);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    const products = await productManager.deleteProduct(parseInt(pid));
    res.json(products);
};







module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
*/