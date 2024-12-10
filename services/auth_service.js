import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";

const { GET_ROLE, FIND_USER_WITH_EMAIL, FIND_USER_WITH_USERNAME, FIND_USER_WITH_HASH, FIND_USER_WITH_ID } =
	await authQueries();

/**
 * This function send a request to the roles table with the provided role name and return the role id
 */
const userRole = async (role_name) => {
	const [data] = await db.execute(GET_ROLE(role_name));

	if (data.length === 0) {
		return {
			exist: false,
		};
	} else {
		return {
			exist: true,
			id_role: data[0].id_role,
		};
	}
};

/**
 * This function check if a user already exist by his username or email
 */
const findUser = () => {
	const findUserWithUsername = async (username) => {
		const [data] = await db.execute(FIND_USER_WITH_USERNAME(username));

		if (data.length === 0) {
			return {
				exist: false,
			};
		} else {
			return {
				exist: true,
				data: data[0],
			};
		}
	};

	const findUserWithEmail = async (email) => {
		const [data] = await db.execute(FIND_USER_WITH_EMAIL(email));

		if (data.length === 0) {
			return {
				exist: false,
			};
		} else {
			return {
				exist: true,
				data: data[0],
			};
		}
	};

	const findUserWithHash = async (hash) => {
		const [data] = await db.execute(FIND_USER_WITH_HASH(hash));

		if (data.length === 0) {
			return false;
		} else {
			return true;
		}
	};

	const findUserWithId = async (id_user) => {
		const [data] = await db.execute(FIND_USER_WITH_ID(id_user));

		if (data.length === 0) {
			return {
				exist: false,
			};
		} else {
			return {
				exist: true,
				id_user: data[0].id_user,
			};
		}
	};

	return {
		findUserWithUsername,
		findUserWithEmail,
		findUserWithHash,
		findUserWithId,
	};
};

/**
 * This function take a token in params an decode it
 */
const decodeToken = async (token) => {
	try {
		const decoded = await jwt.verify(token, process.env.AUTH_JWT_SECRET);
		return {
			isError: false,
			data: decoded,
		};
	} catch (error) {
		return {
			isError: true,
		};
	}
};

export { decodeToken, findUser, userRole };
