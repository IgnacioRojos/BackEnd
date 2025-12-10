const express = require("express");
const mercadopago = require("../script/mercadoPago");

const router = express.Router();

router.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.title,
        description: item.description || "",
        quantity: Number(item.quantity),
        currency_id: "ARS",
        unit_price: Number(item.price),
      })),
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      id: response.body.id,
      init_point: response.body.init_point
    });

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

module.exports = router;
