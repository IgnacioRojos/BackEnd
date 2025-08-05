const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Cart = require('../models/cart');

const dataProductsFile = path.resolve(process.cwd(), 'src/data/DataProducts.json');//fix para subir a railway
const dataCartFile = path.resolve(process.cwd(), 'src/data/DataCart.json'); //fix para subir a railway
const migrateData = async () => {
  try {
    // Leer productos del JSON
    const productsData = JSON.parse(fs.readFileSync(dataProductsFile, 'utf-8'));

    // Map para relacionar el id de FS luego
    const idMap = {};

    for (let product of productsData) {
      const { id, ...productData } = product;

      // Verificamos si el producto ya existe en Mongo
      let exists = await Product.findOne({ title: productData.title });
      let newProduct;

      if (!exists) {
        newProduct = await Product.create(productData);
        console.log(`✅ Producto "${productData.title}" migrado a MongoDB.`);
      } else {
        newProduct = exists;
        console.log(`Producto "${productData.title}" ya existe. Omitido.`);
      }

      // Id FS a ID Mongo!!!
      idMap[id] = newProduct._id;
    }

    console.log('✅ Productos migrados a MongoDB');

    // Leemos los carritos del JSON
    const cartsData = JSON.parse(fs.readFileSync(dataCartFile, 'utf-8'));

    for (let cartData of cartsData) {
      const cartProducts = [];

      for (let product of cartData.products) {
        const mongoProductId = idMap[product.product]; // Buscamos el nuevo _id

        if (!mongoProductId) {
          console.warn(`⚠️ Producto con ID numérico ${product.product} no encontrado en los productos migrados.`);
          continue;
        }

        // Correcion de id
        cartProducts.push({
          product: mongoProductId,
          quantity: product.quantity
        });
      }

      // Creamos y guardamos el carrito
      const cart = new Cart({
        products: cartProducts
      });

      await cart.save();
    }

    console.log('✅ Carritos migrados a MongoDB');
    console.log('✅ Migración completada');
  } catch (err) {
    console.error('❌ Error al migrar los datos:', err);
  }
};
module.exports = { migrateData };