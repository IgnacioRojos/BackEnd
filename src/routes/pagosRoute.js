const express = require("express");
const mercadopago = require("../script/mercadoPago");
const orderController = require("../controllers/OrderController")

const router = express.Router();

router.post("/create_preference", async (req, res) => {
  console.log("/create_preference - Body:", req.body);

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error(" Error: items inválidos o vacíos");
      return res.status(400).json({ error: "items inválidos o vacíos" });
    }

    // Detectar desarrollo vs producción
    const isProd = process.env.NODE_ENV === "production";

    const FRONT_URL = isProd
      ? "https://eccomercefullstack.netlify.app"   
      : "http://localhost:3000";

    const preference = {
      items: items.map((item, index) => {
        console.log(`📦 Item[${index}]`, item);

        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (!item.title) {
          throw new Error(`El item en posición ${index} no tiene title`);
        }
        if (isNaN(price) || isNaN(quantity)) {
          throw new Error(
            `Precio o cantidad inválidos en posición ${index}: price=${item.price}, quantity=${item.quantity}`
          );
        }

        return {
          title: item.title,
          description: item.description || "",
          quantity: quantity,
          currency_id: "ARS",
          unit_price: price,
        };
      }),

      back_urls: {
        success: `${FRONT_URL}/success`,
        failure: `${FRONT_URL}/failure`,
        pending: `${FRONT_URL}/pending`,
      },

      auto_return: "approved",
    };

    console.log("Preference a enviar a MP:", preference);

    const response = await mercadopago.preferences.create(preference);

    console.log("MercadoPago response:", response);

    res.json({
      id: response.body.id,
      init_point: response.body.init_point,
    });
  } catch (error) {
    console.error("ERROR en create_preference:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});


router.post("/webhook", orderController.mercadoPagoWebhook);

module.exports = router;



/*const express = require("express");
const mercadopago = require("../script/mercadoPago");

const router = express.Router();

router.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items inválidos o vacíos" });
    }

    // Detectar si estamos en producción o desarrollo
    const isProd = process.env.NODE_ENV === "production";

    const FRONT_URL = isProd
      ? "https://eccomercefullstack.netlify.app/" 
      : "http://localhost:3000";

    // Construir el preference
    const preference = {
      items: items.map((item, index) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity);

        if (isNaN(price) || isNaN(quantity)) {
          throw new Error(
            `Producto en posición ${index} tiene precio o cantidad inválidos`
          );
        }

        return {
          title: item.title,
          description: item.description || "",
          quantity: quantity,
          currency_id: "ARS",
          unit_price: price,
        };
      }),

      back_urls: {
        success: `${FRONT_URL}/success`,
        failure: `${FRONT_URL}/failure`,
        pending: `${FRONT_URL}/pending`,
      },

      auto_return: "approved",
    };

    // Crear preferencia en MercadoPago
    const response = await mercadopago.preferences.create(preference);

    return res.json({
      id: response.body.id,
      init_point: response.body.init_point,
    });

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error al crear preferencia" });
  }
});

module.exports = router;*/
