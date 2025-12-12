const Order = require("../models/orders")

class OrderManager {
  async createOrder(orderData) {
    try {
      const newOrder = new Order(orderData);
      return await newOrder.save();
    } catch (error) {
      console.error("Error al guardar orden:", error);
      throw error;
    }
  }
}

module.exports = OrderManager;
