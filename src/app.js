const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { engine } = require('express-handlebars');
const ProductRouter = require('../src/routes/ProductRoute')
const CartRouter = require('../src/routes/CartRoute');
const path = require('path');

const viewsRouter = require('../src/routes/viewsRoute'); 





const ProductManager = require('../src/managers/ProductManager'); 
const productManager = new ProductManager();

const ProductController = require('../src/controllers/ProductController');

// Crear la instancia de express
const app = express();

// Crear el servidor HTTP
const server = http.createServer(app);

// Configuración de Socket.IO
const io = socketIo(server);

// Configuración de Handlebars
app.engine('handlebars', engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

// Carpeta pública para archivos estáticos

app.set('views', path.join(__dirname, '../src/views'));


// Middleware para parsear datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', ProductRouter);
app.use('/api', CartRouter);
app.use('/', viewsRouter); 

// Ruta para mostrar productos en tiempo real
app.get('/productTiempoReal', (req, res) => {
    res.render('productTiempoReal', { products: [] });
});

// Página principal con todos los productos
app.get('/', async (req, res) => {
    try {
        // Llamar al controlador pasando req y res
        await ProductController.getAllProducts(req, res);
    } catch (error) {
        console.error('Error en la ruta principal', error);
        res.status(500).send('Error en la ruta principal');
    }
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// WebSocket para manejar actualizaciones en tiempo real

let connectedClients = 0; // Contador de clientes conectados

io.on('connection', async (socket) => {
    connectedClients++; 
    console.log(`Cliente conectado. Total de clientes: ${connectedClients}`);

    // Enviar la lista de productos actuales

    const products = await productManager.getAllProducts();
    io.emit('productListUpdate', products); 

    // Cuando se agrega un producto

    socket.on('addProduct', async (newProduct) => {
        await productManager.addProduct(newProduct);
        const updatedProducts = await productManager.getAllProducts();
        io.emit('productListUpdate', updatedProducts);
    });

    // Cuando se elimina un producto

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getAllProducts();
        io.emit('productListUpdate', updatedProducts);
    });

    socket.on('disconnect', () => {
        connectedClients--; 
        console.log(`Cliente desconectado. Total de clientes: ${connectedClients}`);
    });
});