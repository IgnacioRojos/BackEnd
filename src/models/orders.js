import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  total: Number,
  userEmail: String,
  status: { type: String, default: "approved" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
