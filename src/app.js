/*const express =  require("express");

const ProductRoutes = require("./src/routes/ProductRoute");

const cartRoutes = require("./src/routes/CartRoute");

const app = express();

app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products",ProductRoutes);

app.use("/api/carts", cartRoutes);

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`El servidor se esta corrienndo en el puerto: ${PORT}`)
});*/
const express = require('express');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');

const app = express();

app.use(express.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
