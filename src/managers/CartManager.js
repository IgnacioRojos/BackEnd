const fs = require('fs').promises; 
const path = require('path');
const ProductManager = require('../managers/ProductManager');

// Obtener la ruta del archivo carts.json
const cartsFile = path.join(__dirname, '../data/DataCart.json');

class CartManager {
    async getAllCarts() {
        try {
            const data = await fs.readFile(cartsFile, 'utf-8');
            return JSON.parse(data); 
        } catch (error) {
            return []; 
        }
    }

    async getCartById(id) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === parseInt(id)); // Buscar el carrito por id
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2)); // Guardar los cambios
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        try {
            console.log(`Agregando producto ${productId} al carrito ${cartId}`);
    
            const carts = await this.getAllCarts();
            console.log('Carritos cargados:', carts);
    
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
            if (cartIndex === -1) {
                
                return { error: `Carrito con ID ${cartId} no encontrado` };
            }
    
            const cart = carts[cartIndex];
    
            // Crear una instancia de ProductManager
            const productManager = new ProductManager();
    
            // Obtener los productos usando la instancia
            const products = await productManager.getAllProducts();
            console.log('Productos cargados:', products);
    
            const productExists = products.some(product => product.id === parseInt(productId));
            if (!productExists) {
                
                return { error: `Producto con ID ${productId} no existe` };
            }
    
            // Buscar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));
            if (productIndex === -1) {
                cart.products.push({ product: parseInt(productId), quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
    
            // Guardar cambios en JSON
            await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2));
    
          
            return { message: `Producto ${productId} agregado al carrito ${cartId}`, cart };
        } catch (error) {
          
            return { error: 'Error interno del servidor', details: error.message };
        }
    }
    

}

module.exports = CartManager;







 