import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    inStock: Number,
    price: Number,
    category: {
      type: String,
      enum: [
        "Fitness",
        "Accessories",
        "Audio",
        "Furniture",
        "electronics",
        "Electronics",
        "clothing",
        "accessories",
        "home",
        "books",
        "toys",
        "audio",
        "video",
        "furniture",
        "sports",
        "bags",
        "mobile accessories",
        "office supplies",
        "health",
        "beauty",
        "grocery",
        "pet supplies",
        "automotive",
        "tools",
      ],
      default: "electronics",
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
