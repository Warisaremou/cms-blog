import { db } from "../config/database.js";
import { commentQueries } from "../database/queries/comment_queries.js";

/**
 * This function check if a comment exist and return a boolean
 * @param {*} id_comment
 * @returns boolean and data(if comment exist)
 */
const commentExist = async (id_comment) => {
	const { GET_COMMENT_BY_ID } = await commentQueries();
	const [data] = await db.execute(GET_COMMENT_BY_ID(id_comment));

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

export { commentExist };
