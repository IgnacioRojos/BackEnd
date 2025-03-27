const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

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

const PORT = 8080;
const DB_URI = "mongodb+srv://nachorojos99:ignacio2208@cluster0.wr7tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

// Configuración de Handlebars
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../src/views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/', viewsRouter);

// Página de productos en tiempo real
/*app.get('/productTiempoReal', (req, res) => {
    res.render('productTiempoReal', { products: [] });
});*/

// Ruta principal
app.get('/', async (req, res) => {
    console.log('req.user:', req.user); // Verifica si req.user es null o tiene un _id
    
    try {
        const products = await Product.find().lean();

        if (!req.user) {
            console.log('No hay usuario autenticado, creando carrito anónimo');
            const cartId = 'anonimo'; // Carrito anónimo
            const cart = await Cart.findOne({ user: cartId }).lean();

            if (!cart) {
                const newCart = new Cart({ user: cartId, products: [] });
                await newCart.save();
                return res.render('home', { products, cartId: newCart._id });
            }

            return res.render('home', { products, cartId: cart._id });
        }

        // Si el usuario está autenticado
        const cart = await Cart.findOne({ user: req.user._id }).lean();
        if (!cart) {
            const newCart = new Cart({ user: req.user._id, products: [] });
            await newCart.save();
            return res.render('home', { products, cartId: newCart._id });
        }

        res.render('home', { products, cartId: cart._id });
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