import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";

/**
 * Middleware to identify if user is moderator or post owner before performing action
 */
const isModeratorOrPostOwner = async (req, res, next) => {
	const { GET_ROLE_BY_ID } = authQueries();
	const id_post = await req.params.id;

	try {
		const userData = await req.user;
		const [role] = await db.execute(GET_ROLE_BY_ID(userData.id_role));

		if (role[0].name !== "moderator") {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		next();
	} catch (error) {
		res.status(401).json({ error });
	}
};

export { isModeratorOrPostOwner };
