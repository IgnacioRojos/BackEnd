const fs = require('fs').promises; 
const path = require('path');


const productsFile = path.join(__dirname, '../models/products.json');



class ProductManager {
    async getAllProducts() {
        try {
            const data = await fs.readFile(productsFile, 'utf-8');
            return JSON.parse(data); 
        } catch (error) {
            return []; 
        }
    }

    async getProductById(pid) {
        const products = await this.getAllProducts();
        return products.find(product => product.id === pid); 
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        product.id = products.length + 1; 
        products.push(product);
        await fs.writeFile(productsFile, JSON.stringify(products, null, 2)); 
        return product;
    }

    async updateProduct(pid, updateData) {
        const products = await this.getAllProducts();
        const productIndex = products.findIndex(p => p.id === pid);

        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updateData };
            await fs.writeFile(productsFile, JSON.stringify(products, null, 2)); 
            return products[productIndex];
        }
        return null; 
    }

    async deleteProduct(pid) {
        const products = await this.getAllProducts();
        const updatedProducts = products.filter(product => product.id !== pid);
        await fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2)); 
        return updatedProducts;
    }
}


module.exports = ProductManager;
