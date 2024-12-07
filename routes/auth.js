import express from "express";
import { login, register } from "../controllers/auth_controller.js";
import { registerValidator } from "../validators/auth_validator.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */
router.post("/register", registerValidator, register);
router.post("/login", login);

export default router;
