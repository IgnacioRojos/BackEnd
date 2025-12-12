const OrderManager = require ("../managers/OrderManager")

const mercadopago = require ("../script/mercadoPago")

// Ya deberías tener tu ACCESS_TOKEN en process.env
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

const mercadoPagoWebhook = async (req, res) => {
  try {
    const payment = req.body;

    // MercadoPago envía múltiples tipos de eventos, filtramos solo pagos
    if (payment.type !== "payment") {
      console.log("Webhook recibido pero no es payment");
      return res.status(200).send("Not payment event");
    }

    // Traer datos del pago desde MP
    const data = await mercadopago.payment.findById(payment.data.id);

    console.log("Pago recibido:", data.body.status);

    // Solo guardar si está aprobado
    if (data.body.status === "approved") {
      const orderData = {
        items: data.body.additional_info.items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.unit_price,
          quantity: item.quantity,
        })),
        total: data.body.transaction_amount,
        userEmail: data.body.payer.email,
        status: "approved",
      };

      await OrderManager.createOrder(orderData);

      console.log("ORDEN GUARDADA EN DB");
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).send("Error en webhook");
  }
};

module.exports ={
    mercadoPagoWebhook
}