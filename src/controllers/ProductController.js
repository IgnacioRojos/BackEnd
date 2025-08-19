const mongoose = require('mongoose');
const ProductManager = require('../managers/ProductManager.js');
const productManager = new ProductManager();

const { Product } = require("../models/product.js");
const { Cart } = require("../models/cart.js");

// Recibe un parámetro io para emitir eventos en funciones que lo necesiten
let io;
const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

const getAllProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = 'asc', query, category, available } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    if (query) {
      const [key, value] = query.split(':');
      if (key && value) filter[key] = value;
    }

    const products = await productManager.getAllProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      filter
    });

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
    console.error('❌ Error en getAllProducts:', err);
    res.status(500).json({ status: 'error', message: 'Error obteniendo productos', error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description = '', price, stock } = req.body;

    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({ message: "Faltan campos obligatorios: title, price, stock" });
    }

    const newProduct = await productManager.addProduct({ title, description, price, stock });

    if (io) {
      const allProducts = await productManager.getAllProducts({ limit: 100, page: 1, sort: 'asc', filter: {} });
      io.emit('productListUpdate', allProducts.docs);
    }

    res.status(201).json({ message: "Producto agregado", product: newProduct });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido o ausente" });
    }

    const updateData = req.body;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
    }

    const updatedProduct = await productManager.updateProduct(id, updateData);

    if (updatedProduct) {
      res.json({ message: "Producto actualizado correctamente", product: updatedProduct });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: "Error del servidor", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de producto inválido o ausente" });
    }

    const updatedProducts = await productManager.deleteProduct(id);

    if (io) {
      io.emit('productListUpdate', updatedProducts);
    }

    res.json({ message: "Producto eliminado", products: updatedProducts });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: error.message });
  }
};

const renderHome = async (req, res) => {
  try {
    const products = await Product.find().lean();

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = await Cart.create({ userId: req.user._id, products: [] });
      }
    } else {
      const cartCookie = req.cookies.cartId;

      if (cartCookie) {
        cart = await Cart.findById(cartCookie);
      }

      if (!cart) {
        cart = await Cart.create({ isAnonymous: true, products: [] });
        res.cookie("cartId", cart._id.toString(), { httpOnly: true });
      }
    }

    res.render('home', { products, cart });
    console.log("Renderizando vista home con cart:", cart);
  } catch (error) {
    console.error('Error en renderHome:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error cargando la página principal',
      error: error.message
    });
  }
};

module.exports = {
  setSocketIo,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  renderHome
};





















