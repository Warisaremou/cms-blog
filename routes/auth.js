import express from "express";
import { register, login } from "../controllers/auth_controller.js";
import { body } from "express-validator";

const router = express.Router();

/**
 * AUTH ROUTES
 */
router.post("/register", register);
router.post("/login", login);

export default router;
