import express from "express";
import {
	forgotPassword,
	getMe,
	getUsers,
	login,
	register,
	remove,
	resetPassword,
	update,
	updateAvatar,
	updateRole,
} from "../controllers/auth_controller.js";
import { authMiddleware, isAdminMiddleware } from "../middleware/auth_middleware.js";
import {
	forgotPasswordValidator,
	loginValidator,
	registerValidator,
	resetPasswordValidator,
	updateProfileValidator,
	updateRoleValidator,
} from "../validators/auth_validator.js";

const router = express.Router();

/**
 * AUTH ROUTES
 */

// ----------- CREATE ACCOUNT ----------- //
router.post("/register", registerValidator, register);
// ----------- LOGIN ----------- //
router.post("/login", loginValidator, login);
// ----------- FORGOT PASSWORD ----------- //
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
// ----------- RESET PASSWORD ----------- //
router.post("/reset-password", resetPasswordValidator, resetPassword);
// ----------- GET PROFILE INFO ----------- //
router.get("/me", authMiddleware, getMe);
// ----------- GET ALL USERS ----------- //
router.get("/users", authMiddleware, isAdminMiddleware, getUsers);
// ----------- UPDATE PROFILE ----------- //
router.patch("/", authMiddleware, updateProfileValidator, update);
// ----------- UPDATE AVATAR ----------- //
router.patch("/", authMiddleware, updateAvatar);
// ----------- UPDATE A USER ROLE BY ID ----------- //
router.patch("/user-role/:id", authMiddleware, isAdminMiddleware, updateRoleValidator, updateRole);
// ----------- DELETE ACCOUNT ----------- //
router.delete("/", authMiddleware, remove);

export default router;
