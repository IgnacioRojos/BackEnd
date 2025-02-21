const fs = require('fs').promises; 
const path = require('path');

// Obtener la ruta del archivo carts.json
const cartsFile = path.join(__dirname, '../models/carts.json');

class CartManager {
    async getAllCarts() {
        try {
            const data = await fs.readFile(cartsFile, 'utf-8');
            return JSON.parse(data); 
        } catch (error) {
            return []; 
        }
    }

    async getCartById(cid) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === cid); // Buscar el carrito por id
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const newCart = { id: carts.length ? carts[carts.length - 1].id + 1 : 1, products: [] };
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


module.exports = CartManager;







 