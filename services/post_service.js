import { db } from "../config/database.js";
import { postQueries } from "../database/queries/post_queries.js";



/**
 * This function check if a category exist and return a boolean
 * @param {*} id_post
 * @returns boolean and data(if post exist)
 */
const postExist = async (id_post) => {
	const { GET_POST_BY_ID } = await postQueries();
	const [data] = await db.execute(GET_POST_BY_ID, [id_post]);

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

export { postExist };