import express from "express";
const router = express.Router();
import { login, logout, signup } from "../controllers/authControllers.js";

router.post("/login", login);

router.post("/register", signup);

router.post("/logout", logout);

export default router;
