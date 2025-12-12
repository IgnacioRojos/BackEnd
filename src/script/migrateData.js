const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Cart = require('../models/cart');


const dataProductsFile = path.resolve(process.cwd(), 'DataProducts.json');
const dataCartFile = path.resolve(process.cwd(), 'DataCart.json');

const migrateData = async () => {
  try {
    // Leer productos del JSON
    const productsData = JSON.parse(fs.readFileSync(dataProductsFile, 'utf-8'));

    // Map para relacionar el id original del JSON con el _id de Mongo
    const idMap = {};

    for (let product of productsData) {
      const { id, ...productData } = product;

      // Buscar si ya existe un producto con mismo título
      let existingProduct = await Product.findOne({ title: productData.title });
      let newProduct;

      if (!existingProduct) {
        newProduct = await Product.create(productData);
        console.log(`Producto "${productData.title}" migrado a MongoDB.`);
      } else {
        newProduct = existingProduct;
        console.log(`Producto "${productData.title}" ya existe. Omitido.`);
      }

      // Mapear ID original del JSON al ID de Mongo
      idMap[id] = newProduct._id.toString();
    }

    console.log('Productos migrados a MongoDB');

    // Leer carritos
    const cartsData = JSON.parse(fs.readFileSync(dataCartFile, 'utf-8'));

    for (let cartData of cartsData) {
      const cartProducts = [];

      for (let product of cartData.products) {
        const mongoProductId = idMap[product.product];

        if (!mongoProductId) {
          console.warn(`⚠️ Producto con ID numérico ${product.product} no encontrado en los productos migrados.`);
          continue;
        }

        cartProducts.push({
          product: mongoProductId,
          quantity: product.quantity
        });
      }

      await Cart.create({ products: cartProducts });
    }

    console.log('Carritos migrados a MongoDB');
    console.log('Migración completada');
  } catch (err) {
    console.error('Error al migrar los datos:', err);
  }
};

module.exports = { migrateData };