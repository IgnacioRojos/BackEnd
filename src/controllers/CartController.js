const CartManager = require('../managers/CartManager');  
const cartManager = new CartManager();

// Crear un nuevo carrito
const createCart = async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });
  }
};

// Obtener los productos de un carrito
const getCartProducts = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos del carrito', error });
  }
};

// Agregar un producto a un carrito
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
  }
};

module.exports = {
  createCart,
  getCartProducts,
  addProductToCart,
};
