import express from "express";
import { getAll, getOne, create,update,remove } from "../controllers/comment_controller.js";
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
// ----------- UPDATE A COMMENT BY ID ----------- //
router.patch("/:id", updateCommentValidation, update);
// ----------- DELETE A COMMENT BY ID ----------- //
router.delete("/:id", remove);


export default router;
