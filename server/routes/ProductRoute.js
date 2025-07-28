
import mongoose from "mongoose";
import express from "express";

const ProductRouter = express.Router();


ProductRouter.get("/", async (req, res) => {
  try {
    const products = await mongoose.model("Product").find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
    console.error(err);
  }
});


export default ProductRouter;