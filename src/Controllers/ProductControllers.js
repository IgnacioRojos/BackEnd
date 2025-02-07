const ProductManager = require("../Managers/ProductManagers");

const productManager = new ProductManager();



const getAllProductos = (req, res) =>{
    const products = productManager.getAllProducts();
    res.json(products);
};

const GetProductosById = (req ,res) =>{
    const product = productManager.getProductById(req.params.pid);

    if (product){
        res.json(product);

    } else{
        res.status(404).send("El Producto no fue encontrado");
    }
};


const añadirProducto = (req, res) =>{
    const newProduct = req.body;
    const addProduct = productManager.añadirProduct(newProduct);
    res.status(201).json(addProduct);
};


const ActualizarProducto = (req, res) =>{
    const updateProduct = req.body;
    const product = productManager.updateProduct(req.params.pid, updateProduct);


    if(product) {
        res.json(product);
    } else{
        res.status(404).send("El producto no fue encontrado");
    }

};

const EliminarProducto = (req, res) =>{
    
    const productId = req.params.pid;
    
    const eliminar = productManager.eliminarProduct(productId);

    if (eliminar){
        res.status(204).send();

    } else {
        res.status(404).send("El producto no fue encontrado para eliminarlo");

    }

};


module.export = {
    getAllProductos,
    GetProductosById,
    añadirProducto,
    ActualizarProducto,
    EliminarProducto,
        
};




