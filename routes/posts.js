import express from "express";
import { upload } from "../config/file.js";
import { create, getAll, getAllByUser, getOne, remove, update } from "../controllers/post_controllers.js";
import { authMiddleware } from "../middleware/auth_middleware.js";
import { isModeratorOrPostOwner } from "../middleware/post_middleware.js";

const router = express.Router();
// const multer = require('../middleware/multer-config');

/**
 * POSTS ROUTES
 */

// ----------- GET ALL POSTS ----------- //
router.get("/", getAll);
// ----------- GET A POST BY ID ----------- //
router.get("/:id", getOne);
// ----------- GET ALL POSTS BY USER ID ----------- //
router.get("/users/user-posts", authMiddleware, getAllByUser);
// ----------- ADD A POST ----------- //
router.post("/", authMiddleware, upload, create);
// ----------- UPDATE A POST BY ID ----------- //
router.patch("/:id", authMiddleware, isModeratorOrPostOwner, upload, update);
// ----------- DELETE A POST BY ID ----------- //
router.delete("/:id", authMiddleware, isModeratorOrPostOwner, remove);

export default router;
