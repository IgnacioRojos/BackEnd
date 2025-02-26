const fs = require('fs').promises; 
const path = require('path');


const productsFile = path.join(__dirname, '../data/DataProducts.json');


/*class Product {
    constructor(title, description, price, stock,id) {
        this.id = id.Date.now();; // Se asignará en ProductManager
        this.title = title;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }
}*/


class ProductManager {

    isIdInUse(id) {
        return this.products.some(product => product.id === id);
    }
    constructor() {
        
        this.productsDir = path.join(__dirname, '../data'); // Definir el directorio aquí
        this.productsFile = path.join(this.productsDir, 'DataProducts.json'); // Archivo JSON
        this.products = [];
        this.init();
    }

    async init() {
        try {
            // Verifica si la carpeta `models` existe, si no, la crea
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
        return this.products;
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

        // Asegurar que el ID no esté en uso (por si hay datos inconsistentes)
        while (this.isIdInUse(newId)) {
            newId++; // Si está en uso, aumentar el ID hasta encontrar uno libre
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

        /*const { title, description, price, stock } = product; // Desestructurar el objeto

        if (!title || !description || price == null || stock == null) {
            throw new Error("El producto debe tener título, descripción, precio y stock");
        }
    
        // Crear un nuevo producto con un ID único
        const newProduct = {
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1, 
            title,
            description,
            price,
            stock,
        };
    
        this.products.push(newProduct);
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));
    
        return newProduct;*/ // Devolver el nuevo producto agregado

        /*const newProduct = {
            id: product.length + 1, // Se asignará en ProductManager
            title: title,
            description:description,
            price:price,
            stock:stock,

            

        }


        if (!product.title || !product.price || !product.description || product.stock == null) {
            throw new Error("El producto debe tener título, descripción, precio y stock");
        }

        this.products.push(newProduct);
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));
        return product;*/
    

    async updateProduct(id, updateData) {
         // Buscar el índice del producto en el array
        const productIndex = this.products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return null; // Si el producto no existe, devolver null
        }

        // Mantener los valores originales si no se envían en updateData
        this.products[productIndex] = {
            ...this.products[productIndex], 
            ...updateData 
        };

        // Guardar los cambios en el archivo JSON
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));

        return this.products[productIndex]; // Devolver el producto actualizado
        
        
        
        
        
        /*const product = this.products.find(p => p.id === id);
    
        if (product) {
            const newProduct = { id: Date.now(), ...product, ...updateData }; // Nuevo objeto
            this.products.push(newProduct); // Agregarlo en lugar de modificar el original
            await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));
    
            return newProduct;
        }
        return null;*/
    }

    async deleteProduct(id) {
        const updatedProducts = this.products.filter(product => product.id !== id);
        if (updatedProducts.length === this.products.length) return null;

        this.products = updatedProducts;
        await fs.writeFile(this.productsFile, JSON.stringify(this.products, null, 2));
        return updatedProducts;
    }

}


module.exports = ProductManager;
