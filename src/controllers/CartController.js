/*const CartManager = require("../managers/CartManager")

const cartManager = new CartManager();


const crearCart = (req, res) =>{
    const newCart = cartManager.crearCart();

    res.status(201).json(newCart);
};


const getCartId= (req, res) =>{
    const cart = cartManager.getCartById(req.params.cid);

    if(cart){
        res.json(cart);
    } else{
        res.status(404).send("No se encontro");
    }
};


const agregarProductoCart = (req, res) =>{
    const {pid} = req.params;

    const {cantidad} = req.body;

    const actualizarCart = cartManager.agregarProductoCart(req.params.cid, pid, cantidad);

    if(actualizarCart){
        res.json(actualizarCart);
    } else{
        res.status(404).send("Carrito o producto no encontrado");
    }
};

module.exports = {
    crearCart,
    getCartId,
    agregarProductoCart
}*/

// src/controllers/CartController.js

const CartManager = require('../managers/CartManager');  // Asumimos que tienes un CartManager para manejar la persistencia
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
