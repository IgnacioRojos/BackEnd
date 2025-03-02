const fs = require('fs').promises; 
const path = require('path');


const productsFile = path.join(__dirname, '../data/DataProducts.json');



class ProductManager {

    isIdInUse(id) {
        return this.products.some(product => product.id === id);
    }
    constructor() {
        
        this.productsDir = path.join(__dirname, '../data'); 
        this.productsFile = path.join(this.productsDir, 'DataProducts.json'); 
        this.products = [];
        this.init();
    }

    async init() {
        try {
            
            await fs.mkdir(this.productsDir, { recursive: true });

            // Verifica si el archivo JSON existe
            await fs.access(this.productsFile);
            const data = await fs.readFile(this.productsFile, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, lo crea con un array vacío
                this.products = [];
                await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));
            } else {
                console.error("Error al inicializar productos:", error);
            }
        }
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.productsFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer productos:', error);
            return [];
            }
    }
    

    async getProductById(id) {
        return this.products.find(product => product.id === parseInt(id)) || null;
    }

    async addProduct(product) {

        const { title, description, price, stock } = product;

        

        if (!title || !description || price == null || stock == null) {
            throw new Error("El producto debe tener título, descripción, precio y stock");
        }

        let newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;

        
        while (this.isIdInUse(newId)) {
            newId++; 
        }

        const newProduct = {
            id: newId,
            title,
            description,
            price,
            stock,
        };

        this.products.push(newProduct);
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));

        return newProduct;
    }

        

    async updateProduct(id, updateData) {
         // Buscar el índice del producto en el array

        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return null; 
        }

        // Mantener los valores originales si no se envían en updateData

        this.products[productIndex] = {
            ...this.products[productIndex], 
            ...updateData 
        };

        // Guardar los cambios en el archivo JSON
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));

        return this.products[productIndex];   
        
        
        
        
    }

    async deleteProduct(productId) {
        if (!this.productsFile) {
            throw new Error("El path del archivo no está definido.");
        }

        const products = await this.getAllProducts();
        const filteredProducts = products.filter(prod => prod.id !== productId);

        if (products.length === filteredProducts.length) {
            console.log(`Producto con ID ${productId} no encontrado.`);
            return false;
        }

        await fs.writeFile(this.productsFile, JSON.stringify(filteredProducts, null, 2));
        console.log(`Producto con ID ${productId} eliminado.`);
        return true;
    }

}


module.exports = ProductManager;
