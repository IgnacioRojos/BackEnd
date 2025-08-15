const  Cart  = require('../models/cart.js'); // Modelo Cart

const Product  = require("../models/product.js") // Modelo Product

const mongoose = require('mongoose');

class CartManager {


        // Validar ObjectId de MongoDB antes de proceder
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
            .populate('products.product') // 'products.product' es el path del modelo Product
            .lean(); // Convierte el resultado en un objeto JS simple

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
    /*async addProductToCart(req, res) {
    
        try {
            // Validar los IDs
            if (!this.validateObjectId(cid) || !this.validateObjectId(pid)) {
                console.error('ID de carrito o producto inválido');
                return res.status(400).json({ error: 'ID de carrito o producto inválido' });
            }
    
            // Buscar el carrito
            const cart = await Cart.findById(cid);
            if (!cart) {
                console.error(`Carrito con ID ${cid} no encontrado`);
                return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
            }
    
            // Buscar el producto
            const product = await Product.findById(pid);
            if (!product) {
                console.error(`Producto con ID ${pid} no encontrado`);
                return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
            }
    
            // Verificar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
            if (productIndex === -1) {
                cart.products.push({ product: pid, quantity });
                console.log(`Producto ${pid} agregado al carrito`);
            } else {
                cart.products[productIndex].quantity += quantity; // Incrementar cantidad si ya existe
                console.log(`Cantidad del producto ${pid} actualizada`);
            }
    
            await cart.save(); // Guardar el carrito actualizado
            return res.json(cart); // Devolver el carrito actualizado
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            res.status(500).json({ error: 'Error al agregar producto al carrito', details: error.message });
        }
    }*/

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

            // Reemplazar productos en el carrito
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









 