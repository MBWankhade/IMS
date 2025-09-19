import express from "express";
const router = express.Router();
import { getMyProfile, login, logout, signup, completeProfile, editProfile } from "../controllers/authControllers.js";
import { googleLogin } from "../controllers/authGoogleSign.js"; 
import { auth } from "../middlewares/auth.js";

router.post("/login", login);
router.get("/profile", auth, getMyProfile);

router.post("/register", signup);
 
router.post("/logout", logout); 

// Add this route to your Express app
router.post("/google-login", googleLogin);

router.put("/complete-profile", auth, completeProfile);

router.put("/edit-profile", auth, editProfile);

export default router;
