import express from "express";
import { login, register, logout, verifyLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify", verifyLogin);
router.post("/register", register);
router.post("/logout", logout);

export default router;
