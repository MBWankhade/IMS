import express from "express";
const router = express.Router();
import { login, logout, signup } from "../controllers/authControllers.js";
import { googleLogin } from "../controllers/authGoogleSign.js"; 

router.post("/login", login);

router.post("/register", signup);
 
router.post("/logout", logout); 

// Add this route to your Express app
router.post("/google-login", googleLogin);

export default router;
