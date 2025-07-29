import express from "express";
import 'dotenv/config'

import chalk from "chalk";
import authRouter from "./routes/AuthRoutes.js";
import morgan from "morgan";
import OrderRouter from "./routes/OrderRoutes.js";
import ProductRouter from "./routes/ProductRoute.js";
import { connectedToDB } from "./configs/db.config.js";
import cors from "cors";
import UserRouter from "./routes/UserRoute.js";
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

app.use(cors());

if (NODE_ENV === 'production') {
 
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use(express.json());


// Test route
app.get("/test", (req, res) => {
  res.send("Server is working ✅");
});

// auth routes login and register
app.use('/api/auth/user',authRouter)


// Order routes
app.use('/api/orders', OrderRouter);

// Product routes
app.use('/api/products', ProductRouter);


app.use('/api/user', UserRouter);
// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ msg: "Invalid route" });
});

app.listen(PORT, async () => {
  try {
    await connectedToDB();
    console.log(chalk.cyanBright(`🚀 Server running at ${chalk.underline(`http://localhost:${PORT}`)}`));
  } catch (err) {
    console.error(chalk.bgRed.white("❌ Failed to start server:"), err);
  }
});