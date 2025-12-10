const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

module.exports = mercadopago;
