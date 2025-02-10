/*const fs = require('fs');
const path = './data/carts.json'; */
const fs = require('fs').promises; // Usamos promises para trabajar con funciones async
const path = require('path');

// Obtener la ruta del archivo carts.json
const cartsFile = path.join(__dirname, '../models/carts.json');

class CartManager {
    async getAllCarts() {
        try {
            const data = await fs.readFile(cartsFile, 'utf-8');
            return JSON.parse(data); // Convertir el JSON a objeto
        } catch (error) {
            return []; // Si hay un error, devolvemos un array vacío
        }
    }

    async getCartById(cid) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === cid); // Buscar el carrito por id
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2)); // Guardar los cambios
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getAllCarts();
        const cart = carts.find(cart => cart.id === cid);

        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.product === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2)); // Guardar los cambios
        return cart;
    }
}

// Exportar el CartManager para que pueda ser utilizado en otros archivos
module.exports = CartManager;




/*class CartManager {



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

module.exports = CartManager;*/