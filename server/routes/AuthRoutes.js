// routes/AuthRoutes.js
import { Router } from 'express';
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from '../controllers/AuthController.js';


const authRouter = Router();

// Register route
authRouter.post('/register', registerWithEmailAndPassword);

// Login route
authRouter.post('/login', loginWithEmailAndPassword);

export default authRouter;