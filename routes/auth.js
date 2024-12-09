import express from "express";
import { forgotPassword, getMe, login, register, resetPassword } from "../controllers/auth_controller.js";
import {
	forgotPasswordValidator,
	loginValidator,
	registerValidator,
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
router.get("/me", getMe);

export default router;
