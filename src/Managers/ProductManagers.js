const fs = require('fs');
const path = './data/products.json'; 

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
  getAllProducts() {

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
}

module.exports = ProductManager;
