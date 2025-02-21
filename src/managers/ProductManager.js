const fs = require('fs').promises; 
const path = require('path');


const productsFile = path.join(__dirname, '../models/products.json');


class Product {
    constructor(title, description, price, stock) {
        this.id = Date.now();; // Se asignará en ProductManager
        this.title = title;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }
}


class ProductManager {
    constructor() {
        
        this.productsDir = path.join(__dirname, '../models'); // Definir el directorio aquí
        this.productsFile = path.join(this.productsDir, 'products.json'); // Archivo JSON
        this.products = [];
        this.init();
    }

    async init() {
        try {
            // Verifica si la carpeta `models` existe, si no, la crea
            await fs.mkdir(productsDir, { recursive: true });

            // Verifica si el archivo JSON existe
            await fs.access(productsFile);
            const data = await fs.readFile(productsFile, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, lo crea con un array vacío
                this.products = [];
                await fs.writeFile(productsFile, JSON.stringify(this.products, null, 2));
            } else {
                console.error("Error al inicializar productos:", error);
            }
        }
    }

    async getAllProducts() {
        return this.products;
    }

    async getProductById(pid) {
        return this.products.find(product => product.id === pid) || null;
    }

    async addProduct(product) {
        if (!product.title || !product.price || !product.description || product.stock == null) {
            throw new Error("El producto debe tener título, descripción, precio y stock");
        }

        // Generar ID único
        const lastProduct = this.products.length ? this.products[this.products.length - 1] : null;
        product.id = lastProduct ? lastProduct.id + 1 : 1;

        this.products.push(product);
        await fs.writeFile(productsFile, JSON.stringify(this.products, null, 2));
        return product;
    }

    async updateProduct(pid, updateData) {
        const productIndex = this.products.findIndex(p => p.id === pid);

        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updateData };
            await fs.writeFile(productsFile, JSON.stringify(this.products, null, 2));
            return this.products[productIndex];
        }
        return null;
    }

    async deleteProduct(pid) {
        const updatedProducts = this.products.filter(product => product.id !== pid);
        if (updatedProducts.length === this.products.length) return null;

        this.products = updatedProducts;
        await fs.writeFile(productsFile, JSON.stringify(this.products, null, 2));
        return updatedProducts;
    }

}


module.exports = ProductManager, Product;
