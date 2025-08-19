const  Cart  = require('../models/cart.js');
const Product  = require("../models/product.js") 
const mongoose = require('mongoose');

class CartManager {


      
    validateObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }
    // Obtener todos los carritos
    async getAllCarts(req, res) {
        try {
            const cart = await Cart.find().populate('products.product');
            return cart;
        } catch (error) {
            console.error('❌ Error al obtener carritos:', error);
            res.status(500).json({ error: 'Error al obtener carritos' });
        }
    }

    // Obtener un carrito por ID
    async getCartById(cid) {
        try {
            const cart = await Cart.findById(cid)
            .populate('products.product') 
            .lean(); 
            return cart;
        } catch (error) {
            console.error("❌ Error en getCartById:", error);
            throw error;
        }
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            return { error: 'Error al crear el carrito', details: error.message };
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cid, pid, quantity = 1) {
        try {
            if (!this.validateObjectId(cid) || !this.validateObjectId(pid)) {
                return { error: 'ID de carrito o producto inválido' };
            }

            const cart = await Cart.findById(cid);
            if (!cart) return { error: 'Carrito no encontrado' };

            const product = await Product.findById(pid);
            if (!product) return { error: 'Producto no encontrado' };

            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex === -1) {
                cart.products.push({ product: pid, quantity });
            } else {
                cart.products[productIndex].quantity += quantity;
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error en addProductToCart:', error);
            return { error: 'Error interno al agregar producto' };
        }
    }


    // Eliminar un producto de un carrito
    async deleteProductFromCart(cartId, productId) {
        try {
            if (!this.validateObjectId(cartId) || !this.validateObjectId(productId)) {
                return { error: 'ID de carrito o producto inválido' };
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { error: `Carrito con ID ${cartId} no encontrado` };
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                return { error: `Producto con ID ${productId} no encontrado en el carrito` };
            }

            cart.products.splice(productIndex, 1); // Eliminar producto
            await cart.save(); // Guardar los cambios
            return cart;
        } catch (error) {
            return { error: 'Error al eliminar el producto del carrito', details: error.message };
        }
    }

    // Actualizar un carrito con una lista de productos
    async updateCart(cartId, products) {
        try {
            if (!this.validateObjectId(cartId)) {
                return { error: 'ID de carrito inválido' };
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { error: `Carrito con ID ${cartId} no encontrado` };
            }


            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            return { error: 'Error al actualizar el carrito', details: error.message };
        }
    }

    // Limpiar un carrito (eliminar todos los productos)
    async clearCart(cartId) {
        try {
            if (!this.validateObjectId(cartId)) {
                return { error: 'ID de carrito inválido' };
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                return { error: `Carrito con ID ${cartId} no encontrado` };
            }

            cart.products = []; // Vaciar los productos
            await cart.save(); // Guardar el carrito vacío
            return cart;
        } catch (error) {
            return { error: 'Error al vaciar el carrito', details: error.message };
        }
    }

}

module.exports =  CartManager;









 