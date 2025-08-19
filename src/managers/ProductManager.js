const Product = require('../models/product'); 
const mongoose = require('mongoose');

class ProductManager {
    constructor() {
        console.log("📦 ProductManager inicializado con MongoDB");
    }

    /**
     * Obtener todos los productos con paginación, orden y filtros.
     */
    async getAllProducts({ limit = 10, page = 1, sort = 'asc', filter = {} }) {
        try {
            const sortOrder = sort === 'desc' ? -1 : 1;
    
            const options = {
                page,
                limit,
                sort: { price: sortOrder }
            };
    
            const result = await Product.paginate(filter, options);
            return result; 
        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
            return {
                docs: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            };
        }
    }

    /**
     * Obtener un producto por ID.
     */
    async getProductById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de producto inválido");
            }

            const product = await Product.findById(id);
            return product || null;
        } catch (error) {
            console.error(`❌ Error al obtener producto con ID ${id}:`, error);
            return null;
        }
    }

    /**
     * Agregar un nuevo producto a la base de datos.
     */
    async addProduct(productData) {
        try {
            const newProduct = await Product.create(productData);
            return newProduct;
        } catch (error) {
            console.error("❌ Error al agregar producto:", error);
            throw error;
        }
    }

    /**
     * Actualizar un producto existente por ID.
     */
    async updateProduct(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de producto inválido");
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

            return updatedProduct || null;
        } catch (error) {
            console.error(`❌ Error al actualizar producto con ID ${id}:`, error);
            return null;
        }
    }

    /**
     * Eliminar un producto por ID.
     */
    async deleteProduct(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("ID de producto inválido");
            }

            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                console.log(`⚠️ Producto con ID ${id} no encontrado.`);
                return false;
            }

            console.log(`✅ Producto con ID ${id} eliminado.`);
            return true;
        } catch (error) {
            console.error(`❌ Error al eliminar producto con ID ${id}:`, error);
            return false;
        }
    }
}

module.exports = ProductManager;