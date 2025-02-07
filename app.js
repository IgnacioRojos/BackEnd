const express =  require("express");

const ProductRoutes = require("./src/Routes/ProductRoutes");

const cartRoutes = require("./src/Routes/CartRoutes");

const app = express();

app.use(express.json());


app.use("/api/products",ProductRoutes);

app.use("/api/carts", cartRoutes);

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`El servidor se esta corrienndo en el puerto: ${PORT}`)
});