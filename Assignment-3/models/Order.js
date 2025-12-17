const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
  ],
  status: { 
  type: String, 
  default: "Processing", 
  enum: ["Processing", "Shipped", "Delivered", "Cancelled"] 
},
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
