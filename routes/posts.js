import express from "express";
import { getAll, getOne } from "../controllers/post_controllers.js";
// import { createPostValidation } from "../validators/post_validator.js";

const router = express.Router();

/**
 * POSTS ROUTES
*/

// ----------- GET ALL POSTS ----------- //
router.get("/", getAll);
// ----------- GET A POST BY ID ----------- //
router.get("/:id", getOne);
// ----------- ADD A POST ----------- //
// router.post("/", createPostValidation, create);
// ----------- UPDATE A POST BY ID ----------- //
// router.patch("/:id", createPostValidation, update);
// ----------- DELETE A POST BY ID ----------- //
// router.delete("/:id", remove);

export default router;