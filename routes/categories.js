import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/category_controller.js";

const router = express.Router();

/**
 * CATEGORIES ROUTES
 */

// ----------- GET ALL CATEGORIES ----------- //
router.get("/", getAll);
// ----------- GET A CATEGORY BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A CATEGORY ----------- //
router.post("/", create);
// ----------- UPDATE A CATEGORY BY ID ----------- //
router.patch("/:id", update);
// ----------- DELETE A CATEGORY BY ID ----------- //
router.delete("/:id", remove);

export default router;
