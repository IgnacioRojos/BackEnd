require("dotenv").config();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

async function test() {
  try {
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: "Producto de prueba",
          quantity: 1,
          unit_price: 1000
        }
      ]
    });

    console.log("PREP:", preference);
  } catch (error) {
    console.error("ERROR MP →", error);
  }
}

test();