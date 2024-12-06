import express from "express";
import { register } from "../controllers/auth_controller.js";

const router = express.Router();


/**
 * AUTH ROUTES
*/
// ----------- REGISTER USER ----------- //
router.post("/register", register);

export default router;