import mongoose from "mongoose";
import chalk from "chalk";

export const connectedToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(chalk.greenBright("✅ Connected to MongoDB"));
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};


