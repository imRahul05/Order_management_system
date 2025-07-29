
import express from "express";
import { hasValidRole, verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.js";
import mongoose from "mongoose";
const UserRouter = express.Router();


UserRouter.get("/profile",verifyToken, hasValidRole, async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                username: user.username,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default UserRouter;