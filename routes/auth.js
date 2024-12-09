import express from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/auth_controller.js";
import {
	registerValidator,
	loginValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} from "../validators/auth_validator.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password", resetPasswordValidator, resetPassword);

export default router;
