import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { commentExist } from "../services/comment_service.js";

/**
 * Middleware to identify if user is moderator or comment owner before performing action
 */
const isModeratorOrCommentOwner = async (req, res, next) => {
	const {GET_ROLE_BY_ID} = authQueries()
	try {
		const userData = await req.user;
		const id_comment = await req.params.id;
		const isCommentExist = await commentExist(id_comment);

		if (!isCommentExist.exist) {
			return res.status(404).json({
				message : "Comment not found"
			})
		}
	console.log(userData);
	const [role] = await db.execute(GET_ROLE_BY_ID, [userData.id_role]);
	const isCommentOwner = await isCommentExist.data.id_user === userData.id_user
	
	if (role[0].name !== "moderator" && !isCommentOwner) {
			return res.status(403).json({
				message : "Not Allowed"
			})
	}

   next()
	} catch (error) {
		return res.status(401).json({ error });
	}
};

export { isModeratorOrCommentOwner };

