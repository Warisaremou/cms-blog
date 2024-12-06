import { categoryQueries } from "../database/queries/category_queries.js";
import { db } from "../config/database.js";

/**
 * This function check if a category exist and return a boolean
 * @param {*} id_category
 * @returns boolean
 */
const categoryExist = async (id_category) => {
	const { GET_CATEGORY_BY_ID } = await categoryQueries();
	const [data] = await db.execute(GET_CATEGORY_BY_ID(id_category));

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

export { categoryExist };
