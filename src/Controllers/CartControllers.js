const CartManager = require("../Managers/CartManagers")

const cartManager = new CartManager();


const crearCart = (req, res) =>{
    const newCart = cartManager.crearCart();

    res.status(201).json(newCart);
};


const getCartId= (req, res) =>{
    const cart = cartManager.getCartById(req.params.cid);

    if(cart){
        res.json(cart);
    } else{
        res.status(404).send("No se encontro");
    }
};


const agregarProductoCart = (req, res) =>{
    const {pid} = req.params;

    const {cantidad} = req.body;

    const actualizarCart = cartManager.agregarProductoCart(req.params.cid, pid, cantidad);

    if(actualizarCart){
        res.json(actualizarCart);
    } else{
        res.status(404).send("Carrito o producto no encontrado");
    }
};

module.exports = {
    crearCart,
    getCartId,
    agregarProductoCart
}