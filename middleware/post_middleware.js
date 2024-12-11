import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { postExist } from "../services/post_service.js";

/**
 * Middleware to identify if user is moderator or post owner before performing action
 */
const isModeratorOrPostOwner = async (req, res, next) => {
	try {
		const { GET_ROLE_BY_ID } = authQueries();
		const id_post = await req.params.id;

		const isPostExist = await postExist(id_post);

		if (!isPostExist.exist) {
			return res.status(404).json({
				message: "Post not found",
			});
		}

		const userData = await req.user;
		const [role] = await db.execute(GET_ROLE_BY_ID, [userData.id_role]);

		if (role[0].name !== "moderator" || userData.id_user !== isPostExist.data.id_user) {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		next();
	} catch (error) {
		return res.status(401).json({ error });
	}
};

export { isModeratorOrPostOwner };
