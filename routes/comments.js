import express from "express";
import { getAll, getOne, create,update } from "../controllers/comment_controller.js";
import { createCommentValidation, updateCommentValidation } from "../validators/comment_validator.js";


const router = express.Router();

/**
 * COMMENTS ROUTES
 */

// ----------- GET ALL COMMENTS ----------- //
router.get("/", getAll);
// ----------- GET A COMMENT BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A COMMENT ----------- //
router.post("/", createCommentValidation,create);
// ----------- UPDATE A CATEGORY BY ID ----------- //
router.patch("/:id", updateCommentValidation, update);



export default router;
