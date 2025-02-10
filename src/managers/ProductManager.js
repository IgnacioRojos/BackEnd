/*const fs = require('fs');
const path = './data/products.json'; */
/*
class ProductManager {
  constructor() {

    this.products = this.cargarProducts(); 
  }

  // Carga los productos desde el archivo JSON
  cargarProducts() {

    if (fs.existsSync(path)) {

      const data = fs.readFileSync(path, 'utf-8');

      return JSON.parse(data); 
    }
    return []; 
  }

  // Guarda los productos en el archivo JSON
  guardarProducts() {

    fs.writeFileSync(path, JSON.stringify(this.products, null, 2)); 
  }

  // Obtiene todos los productos
  getProducts() {

    return this.products; 
  }

  
  getProductById(id) {

    return this.products.find(product => product.id === id); 
  }

  // Agrega un nuevo producto
  añadirProduct(product) {

    const id = this.products.length > 0 ? Math.max(this.products.map(p => p.id)) + 1 : 1; 

    const newProduct = { id, ...product }; 

    this.products.push(newProduct); 

    this.guardarProducts(); 

    return newProduct; 
  }

  // Actualiza un producto existente

  actualizarProduct(id, actualizarCampos) {

    const product = this.getProductById(id); 

    if (!product) return null; 

    Object.assign(product, actualizarCampos); 

    this.guardarProducts(); 

    return product; 
  }

  // Elimina un producto por ID

  eliminarProduct(id) {

    const index = this.products.findIndex(p => p.id === id); 

    if (index === -1) return false; 

    this.products.splice(index, 1); 
    
    this.guardarProducts(); 

    return true; 
  }
}*/



const fs = require('fs').promises; // Usamos fs.promises para trabajar con funciones async
const path = require('path');

// Ruta al archivo products.json
const productsFile = path.join(__dirname, '../models/products.json');

// Aseguramos que no haya una doble declaración de ProductManager
// Eliminamos esta línea de importación porque es innecesaria

class ProductManager {
    async getAllProducts() {
        try {
            const data = await fs.readFile(productsFile, 'utf-8');
            return JSON.parse(data); // Parsear el JSON en un objeto
        } catch (error) {
            return []; // En caso de error, retornamos un array vacío
        }
    }

    async getProductById(pid) {
        const products = await this.getAllProducts();
        return products.find(product => product.id === pid); // Buscar el producto por id
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        product.id = products.length + 1; // Asignar un ID único
        products.push(product);
        await fs.writeFile(productsFile, JSON.stringify(products, null, 2)); // Guardar el array actualizado
        return product;
    }

    async updateProduct(pid, updateData) {
        const products = await this.getAllProducts();
        const productIndex = products.findIndex(p => p.id === pid);

        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updateData };
            await fs.writeFile(productsFile, JSON.stringify(products, null, 2)); // Guardar el array actualizado
            return products[productIndex];
        }
        return null; // Si no se encuentra el producto, retornamos null
    }

    async deleteProduct(pid) {
        const products = await this.getAllProducts();
        const updatedProducts = products.filter(product => product.id !== pid);
        await fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2)); // Guardar los cambios
        return updatedProducts;
    }
}

// Exportar el ProductManager para ser utilizado en otros archivos
module.exports = ProductManager;
