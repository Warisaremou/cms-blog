import express from "express";
import { create, getAll, getOne, remove, update } from "../controllers/comment_controller.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { isModeratorOrCommentOwner } from "../middleware/comment_middleware.js";
import { createCommentValidation, updateCommentValidation } from "../validators/comment_validator.js";

const router = express.Router();

/**
 * COMMENTS ROUTES
 */

// ----------- GET ALL COMMENTS BY POST ID ----------- //
router.get("/posts/:id_post", getAll);
// ----------- GET A COMMENT BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A COMMENT ----------- //
router.post("/", authMiddleware, createCommentValidation, create);
// ----------- UPDATE A COMMENT BY ID ----------- //
router.patch("/:id", authMiddleware, isModeratorOrCommentOwner, updateCommentValidation, update);
// ----------- DELETE A COMMENT BY ID ----------- //
router.delete("/:id", authMiddleware, isModeratorOrCommentOwner, remove);

export default router;
