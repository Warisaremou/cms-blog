import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { decodeToken } from "../services/auth_service.js";

/**
 * Middleware to identify if user is authenticated before executing action
 */
const authMiddleware = async (req, res, next) => {
	try {
		const token = await req.headers?.authorization?.split(" ")[1];

		if (!token) {
			return res.status(403).json({
				message: "Token not found",
			});
		}

		const isValidToken = await decodeToken(token);

		if (isValidToken.isError) {
			return res.status(401).json({
				message: "Unauthorized or expired token",
			});
		}

		req.user = isValidToken.data;
		next();
	} catch (error) {
		return res.status(401).json({ error });
	}
};

/**
 * Middleware to identify if user is admin before accessing ressource
 */
const isAdminMiddleware = async (req, res, next) => {
	const { GET_ROLE_BY_ID } = authQueries();
	try {
		const { id_role } = await req.user;
		const [role] = await db.execute(GET_ROLE_BY_ID, [id_role]);

		if (role[0].name !== "admin") {
			return res.status(401).json({
				message: "Unauthorized",
			});
		}

		next();
	} catch (error) {
		return res.status(401).json({ error });
	}
};

export { authMiddleware, isAdminMiddleware };
