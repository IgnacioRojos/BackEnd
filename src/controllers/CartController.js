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
  const { cid } = req.params;
  console.log("📦 Buscando carrito con ID:", cid);

  // Validar que cid sea un ObjectId válido
  if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'ID de carrito inválido' });
  }

  try {
    const cart = await Cart.findById(cid)
      .populate({
        path: 'products.product',
        model: 'Product'
      })
      .lean();

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Retornar JSON seguro para React/Postman
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
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    return res.json({ products: cart.products }); // <-- Solo JSON
  } catch (error) {
    console.error("❌ Error en getCartProducts:", error);
    res.status(500).json({ message: 'Error al obtener productos del carrito', error });
  }
};

// Vista con Handlebars (solo para testear backend)
const renderCartView = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", {
      cart,
      products: cart.products
    });
  } catch (error) {
    console.error("❌ Error en renderCartView:", error);
    res.status(500).send("Error al renderizar carrito");
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

