const CartManager = require ("../../src/managers/CartManager.js") 
const cartManager = new CartManager();



const Cart = require ("../models/cart.js")

const Product = ("../models/product.js")

const getAllCarts = async (req, res) => {
  try {
      const carts = await Cart.find().populate('products.product');
      res.json(carts);
  } catch (error) {
      console.error('❌ Error al obtener carritos:', error);
      res.status(500).json({ error: 'Error al obtener carritos' });
  }
};



const getCartById = async (req, res) => { 
  try {
    const { cid } = req.params; 
    const cart = await Cart.findById(cid).populate('products.product').lean(); 

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Detectar si es una request desde un navegador (HTML) o API (JSON)
    if (req.accepts('html')) {
      return res.render('cart', { cart }); // Vista handlebars
    }

    // Si viene de React/Axios, devolver JSON
    res.json(cart);

  } catch (error) {
    console.error("❌ Error en getCartById:", error);
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

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
      return res.status(404).send(
        req.accepts('html') ? 'Carrito no encontrado' : { message: 'Carrito no encontrado' }
      );
    }

    if (req.accepts('html')) {
      return res.render('cart', { 
        cart,  
        products: cart.products 
      });
    }

    return res.json({ products: cart.products });

  } catch (error) {
    console.error("❌ Error en getCartProducts:", error);
    if (req.accepts('html')) {
      res.status(500).send('Error al obtener productos del carrito');
    } else {
      res.status(500).json({ message: 'Error al obtener productos del carrito', error });
    }
  }
};


// Agregar un producto a un carrito
const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;

  if (!cid || !pid) {
    return res.status(400).json({ error: 'ID de carrito o producto no proporcionado' });
  }

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);

    if (updatedCart.error) {
      return res.status(400).json({ message: updatedCart.error });
    }

    res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al agregar el producto al carrito' });
  }
};
/*const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;  // Extraemos los IDs del carrito y del producto
  const { quantity } = req.body;  // Extraemos la cantidad del cuerpo de la solicitud

  if (!cid || !pid) {
    return res.status(400).json({ error: 'ID de carrito o producto no proporcionado' });
  }

  try {
      const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
      if (updatedCart.error) {
          return res.status(400).json({ message: updatedCart.error });
      }
      res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al agregar el producto al carrito' });
  }
};*/


const updateCart = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
      const updatedCart = await cartManager.updateCart(cid, products);
      res.json({ message: 'Carrito actualizado', cart: updatedCart });
  } catch (error) {
      res.status(500).json({ message: 'Error al actualizar carrito', error });
  }
};

const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  console.log('DELETE /api/carts/:cid/products/:pid con cid:', cid, 'pid:', pid);
  try {
    const result = await cartManager.deleteProductFromCart(cid, pid);
    console.log('Resultado deleteProductFromCart:', result);

    if (result.error) {
      // Esto solo ocurre si hay error real
      return res.status(400).json({ success: false, message: result.error });
    }

    // Si todo bien, responde ok y carrito actualizado
    res.json({ success: true, cart: result });
  } catch (error) {
    console.error('Error en deleteProductFromCart:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar producto', error: error.message });
  }
};


const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
      const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
      res.json({ message: 'Cantidad actualizada', cart: updatedCart });
  } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ message: 'Error al actualizar cantidad', error });
  }
};

const clearCart = async (req, res) => {
  const { cid } = req.params;
  try {
      await cartManager.clearCart(cid);
      res.json({ message: 'Carrito vaciado' });
  } catch (error) {
      res.status(500).json({ message: 'Error al vaciar carrito', error });
  }
};

const renderCartView = async (req, res) => {
  try {
      const cartId = req.cookies.cartId;

      if (!cartId) {
          return res.status(400).send('No hay carrito asignado');
      }

      const cart = await Cart.findById(cartId).populate('products.product').lean();

      if (!cart) {
          return res.status(404).send('Carrito no encontrado');
      }

      res.render('carts', { cart, products: cart.products });
  } catch (error) {
      console.error('❌ Error al renderizar carrito:', error);
      res.status(500).send('Error al cargar el carrito');
  }
};




module.exports = {
  createCart,
  getCartProducts,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart,
  getCartById,
  getAllCarts,
  renderCartView
};

