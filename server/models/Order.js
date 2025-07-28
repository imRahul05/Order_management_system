import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: String
  }],
  status: {
    type: String,
    enum: ['PLACED', 'PICKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED'
  },
  paymentCollected: { type: Boolean, default: false },
  locked: { type: Boolean, default: true }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
