const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Rutas
const ProductRouter = require('../src/routes/ProductRoute');
const CartRouter = require('../src/routes/CartRoute');
const viewsRouter = require('../src/routes/viewsRoute');
const pagosRoute = require ("../src/routes/pagosRoute")

// Modelos
const Product = require('../src/models/product');
const Cart = require("../src/models/cart");

// Migración de datos
const { migrateData } = require('../src/script/migrateData');

// Controlador productos
const ProductController = require('../src/controllers/ProductController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Pasar la instancia de io al controlador de productos
ProductController.setSocketIo(io);

app.use(cookieParser());

const PORT = process.env.PORT || 4000;
const DB_URI = "mongodb+srv://nachorojos99:ignacio2208@cluster0.wr7tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Configuración de Handlebars
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../src/views'));

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas API
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/', viewsRouter);
app.use("/api/pagos", pagosRoute)
// Ruta principal
app.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    let cart;

    const cartCookie = req.cookies.cartId;

    if (cartCookie) {
      cart = await Cart.findById(cartCookie).lean();
    }

    if (!cart) {
      const newCart = await Cart.create({ isAnonymous: true, products: [] });
      res.cookie('cartId', newCart._id.toString(), { httpOnly: true });
      cart = newCart.toObject();
    }

    res.render('home', { products, cart });
  } catch (error) {
    console.error('Error en la ruta principal:', error);
    res.status(500).send('Error en la ruta principal');
  }
});



// Conexión a MongoDB y migración de datos
mongoose.connect(DB_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    if (process.env.MIGRATE === 'true') {
      console.log('Ejecutando migración de datos...');
      await migrateData();
    } else {
      console.log('Migración omitida por configuración');
    }

    iniciarServidor();
  })
  .catch(err => {
    console.error('Error al conectar con MongoDB:', err);
    process.exit(1);
  });

const iniciarServidor = () => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}/`);
  });
};

// Socket.IO: sólo conexión y desconexión (la lógica la maneja el controlador)
io.on('connection', (socket) => {
  console.log(`Cliente conectado. Total: ${io.engine.clientsCount}`);

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado. Total: ${io.engine.clientsCount}`);
  });
});

