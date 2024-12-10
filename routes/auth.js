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
	updateRole,
} from "../controllers/auth_controller.js";
import {
	forgotPasswordValidator,
	loginValidator,
	registerValidator,
	resetPasswordValidator,
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
router.get("/me", getMe);
// ----------- GET ALL USERS ----------- //
router.get("/users", getUsers);
// ----------- UPDATE PROFILE ----------- //
router.patch("/", update);
// ----------- UPDATE A USER ROLE BY ID ----------- //
router.patch("/user-role/:id", updateRoleValidator, updateRole);
// ----------- DELETE ACCOUNT ----------- //
router.delete("/", remove);

export default router;
