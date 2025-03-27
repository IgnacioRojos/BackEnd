const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Cart = require('../models/cart');

const dataProductsFile = path.join(__dirname, '../data/DataProducts.json');
const dataCartFile = path.join(__dirname, '../data/DataCart.json');

const migrateData = async () => {
  try {
    // Primero migramos los productos (sin ID)
    const productsData = JSON.parse(fs.readFileSync(dataProductsFile, 'utf-8'));

    // Convertir los productos para quitar el campo `id` numérico y dejar que MongoDB genere el ObjectId
    const updatedProducts = productsData.map(product => {
      // Eliminamos el campo `id` para que MongoDB lo cree automáticamente
      const { id, ...productData } = product;
      return productData;  // Retornamos los datos sin el campo `id`
    });

    // Verificamos si el producto ya existe antes de insertarlo para evitar duplicados
    const insertedProducts = [];
    for (let product of updatedProducts) {
      const exists = await Product.findOne({ title: product.title }); // Verificamos si el producto ya existe
      if (!exists) {
        const newProduct = await Product.create(product); // Creamos el producto si no existe
        insertedProducts.push(newProduct); // Lo agregamos a la lista de productos insertados
      } else {
        console.log(`Producto "${product.title}" ya existe. Omitido.`);
      }
    }

    console.log('✅ Productos migrados a MongoDB');

    // Luego, migramos los carritos
    const cartsData = JSON.parse(fs.readFileSync(dataCartFile, 'utf-8'));

    for (let cartData of cartsData) {
      const cartProducts = []; // Lista de productos del carrito

      for (let product of cartData.products) {
        // Buscamos el producto usando el ID numérico que tenías en el archivo de carritos
        const foundProduct = insertedProducts.find(p => p.id === product.product); // Encontramos el producto usando su `id` original

        if (!foundProduct) {
          console.warn(`⚠️ Producto con ID numérico ${product.product} no encontrado en los productos migrados.`);
          continue; // Si no encontramos el producto, lo omitimos
        }

        // Verificamos si el producto ya está en el carrito y consolidamos las cantidades
        const existingProduct = cartProducts.find(p => p.product.toString() === foundProduct._id.toString());
        if (existingProduct) {
          existingProduct.quantity += product.quantity; // Consolidamos la cantidad si ya existe
        } else {
          cartProducts.push({
            product: foundProduct._id,  // Usamos el ObjectId generado por MongoDB
            quantity: product.quantity
          });
        }
      }

      // Creamos el carrito con los productos consolidados
      const cart = new Cart({
        products: cartProducts
      });

      await cart.save(); // Guardamos el carrito
    }

    console.log('✅ Carritos migrados a MongoDB');
  } catch (err) {
    console.error('❌ Error al migrar los datos:', err);
  }
};

module.exports = { migrateData };