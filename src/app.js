const express = require('express');
const ProductRouter = require('../src/routes/ProductRoute');
const CartRouter = require('../src/routes/CartRoute');

const app = express();

app.use(express.json());
app.use('/api', ProductRouter);
app.use('/api', CartRouter);


const PORT = 8080;


app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el ${PORT}`);
});

















