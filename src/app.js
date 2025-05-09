const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Rutas
const ProductRouter = require('../src/routes/ProductRoute');
const CartRouter = require('../src/routes/CartRoute');
const viewsRouter = require('../src/routes/viewsRoute');

// Modelos
const Product = require('../src/models/product'); 
const Cart = require("../src/models/cart")

const { migrateData } = require('../src/script/migrateData'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(cookieParser()); 

const PORT = 8080;
const DB_URI = "mongodb+srv://nachorojos99:ignacio2208@cluster0.wr7tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

// Configuración de Handlebars
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../src/views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas API
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/', viewsRouter);


// Ruta principal
app.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        let cart;

        const cartCookie = req.cookies.cartId;

        if (cartCookie) {
            cart = await Cart.findById(cartCookie).lean();
        }

        //Si no hay carrito creamos uno
        if (!cart) {
            const newCart = await Cart.create({ isAnonymous: true, products: [] });
            res.cookie('cartId', newCart._id.toString(), { httpOnly: true });
            cart = newCart.toObject(); // Convertimos a objeto
        }

        // Enviamos productos y carrito a la vista
        res.render('home', { products, cart });
    } catch (error) {
        console.error('❌ Error en la ruta principal:', error);
        res.status(500).send('Error en la ruta principal');
    }
});
// Conexión a MongoDB y migración de datos
mongoose.connect(DB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    await migrateData();
    console.log('✅ Migración completada');
    iniciarServidor();
  })
  .catch(err => {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1);
  });

const iniciarServidor = () => {
    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}/`);
    });
};

// Configuración de Socket.IO
io.on('connection', async (socket) => {
    console.log(`⚡ Cliente conectado. Total: ${io.engine.clientsCount}`);

    try {
        const products = await Product.find();
        io.emit('productListUpdate', products);
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
    }

    socket.on('addProduct', async (newProduct) => {
        try {
            const product = new Product(newProduct);
            await product.save();
            const updatedProducts = await Product.find();
            io.emit('productListUpdate', updatedProducts);
        } catch (error) {
            console.error('❌ Error al agregar producto:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const updatedProducts = await Product.find();
            io.emit('productListUpdate', updatedProducts);
        } catch (error) {
            console.error('❌ Error al eliminar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`⚠️ Cliente desconectado. Total: ${io.engine.clientsCount}`);
    });
});