import express from "express";
import { create, getAll, getOne, remove, update} from "../controllers/post_controllers.js";
import { createPostValidation } from "../validators/post_validator.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { isModeratorOrPostOwner } from "../middleware/post_middleware.js";
import { upload } from "../config/file.js";

const router = express.Router();
// const multer = require('../middleware/multer-config');

/**
 * POSTS ROUTES
*/

// ----------- GET ALL POSTS ----------- //
router.get("/", getAll);
// ----------- GET A POST BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A POST ----------- //
router.post("/", authMiddleware,upload, create);
// ----------- UPDATE A POST BY ID ----------- //
router.patch("/:id", authMiddleware, isModeratorOrPostOwner, createPostValidation, update);
// ----------- DELETE A POST BY ID ----------- //
router.delete("/:id", authMiddleware, isModeratorOrPostOwner, remove);

export default router;