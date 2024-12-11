import { db } from "../config/database.js";
import { commentExist } from "../services/comment_service.js";
import { postExist } from "../services/post_service.js";

/**
 * Middleware to identify if user is moderator or comment owner before performing action
 */
const isModeratorOrCommentOwner = async (req, res, next) => {
	try {
		const id_comment = await req.params.id;
		const isCommentExist = await commentExist(id_comment);

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

export { isModeratorOrCommentOwner };
