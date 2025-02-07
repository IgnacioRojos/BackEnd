const fs = require('fs');
const path = './data/carts.json'; 

class CartManager {
  constructor() {

    this.carts = this.cargarCarts(); 
  }

  // Carga los carritos desde el archivo JSON

  cargarCarts() {

    if (fs.existsSync(path)) {

      const data = fs.readFileSync(path, 'utf-8');

      return JSON.parse(data); 
    }

    return []; 
  }

  // Guarda los carritos en el archivo JSON

  guardarCarts() {

    fs.writeFileSync(path, JSON.stringify(this.carts, null, 2)); 
  }

  // Crea un nuevo carrito
  
  crearCart() {

    const id = this.carts.length > 0 ? Math.max(this.carts.map(c => c.id)) + 1 : 1; 

    const newCart = { id, products: [] }; 

    this.carts.push(newCart); 

    this.guardarCarts(); 

    return newCart; 
  }

  // Obtiene un carrito por su ID

  getCartById(id) {

    return this.carts.find(cart => cart.id === id); 
  }

  // Agrega un producto al carrito

  añadirCart(cartId, productId, cantidad) {

    const cart = this.getCartById(cartId); 

    if (!cart) return null; 

    const existeProduct = cart.products.find(p => p.product === productId); 

    if (existeProduct) {

      existingProduct.cantidad += cantidad; 
    } else {

      cart.products.push({ product: productId, cantidad }); 
    }

    this.guardarCarts(); 

    return cart; 
  }
};

module.exports = CartManager;