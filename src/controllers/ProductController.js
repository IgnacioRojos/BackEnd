

const ProductManager = require('../managers/ProductManager.js');

const productManager = new ProductManager();

const getAllProducts = async (req, res) => {
  try {
    const products = await productManager.getProducts();
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





// Aquí seguirían los demás métodos...

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
