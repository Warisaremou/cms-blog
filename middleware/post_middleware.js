import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { postExist } from "../services/post_service.js";

/**
 * Middleware to identify if user is moderator or post owner before performing action
 */
const isModeratorOrPostOwner = async (req, res, next) => {
  const { GET_ROLE_BY_ID } = authQueries();
  try {
    const userData = await req.user; // Information of the logged in user
    const id_post = req.params.id; // Post ID retrieved from query parameters

    // Check if the post exists
    const isPostExist = await postExist(id_post);
    if (!isPostExist.exist) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Retrieve the role of the logged in user
    const [role] = await db.execute(GET_ROLE_BY_ID(userData.id_role));
    const isPostOwner = isPostExist.data.id_user === userData.id_user; // Vérifier si l'utilisateur est le propriétaire du post

    // Check permissions
    if (role[0].name !== "moderator" && !isPostOwner) {
      return res.status(403).json({
        message: "Not Allowed",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export { isModeratorOrPostOwner };

