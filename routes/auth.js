import express from "express";
import { forgotPassword, login, register } from "../controllers/auth_controller.js";
import { registerValidator, loginValidator, forgotPasswordValidator } from "../validators/auth_validator.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);

export default router;
