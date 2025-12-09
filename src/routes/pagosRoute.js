const express = require("express");
const { client, Preference } = require("../script/mercadoPago");

const router = express.Router();

router.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          description: item.description,
          quantity: item.quantity,
          currency_id: "ARS",
          unit_price: Number(item.price),
        })),
        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
        auto_return: "approved"
      },
    });

    res.json({ id: result.body.id });

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

module.exports = router;
