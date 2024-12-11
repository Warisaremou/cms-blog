import express from "express";
import { create, getAll, getOne, remove, update } from "../controllers/category_controller.js";
import { authMiddleware, isAdminMiddleware } from "../middleware/auth_middleware.js";
import { createCategoryValidation } from "../validators/category_validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Catgeories
 *  description: categories route
 * /api/categories:
 *  get:
 *    summary: List all categories
 *    tags: [Categories]
 *    responses:
 *      200:
 *        description: The list of the categories
 *        content:
 *          application/json
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Category'
 */

/**
 * CATEGORIES ROUTES
 */

// ----------- GET ALL CATEGORIES ----------- //
router.get("/", getAll);
// ----------- GET A CATEGORY BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A CATEGORY ----------- //
router.post("/", authMiddleware, isAdminMiddleware, createCategoryValidation, create);
// ----------- UPDATE A CATEGORY BY ID ----------- //
router.patch("/:id", authMiddleware, isAdminMiddleware, createCategoryValidation, update);
// ----------- DELETE A CATEGORY BY ID ----------- //
router.delete("/:id", authMiddleware, isAdminMiddleware, remove);

export default router;
