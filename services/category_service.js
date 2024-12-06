import { categoryQueries } from "../database/queries/category_queries.js";
import db from "../config/database.js";

const findCategory = async (id_category) => {
	const { GET_CATEGORY_BY_ID } = await categoryQueries();

	const result = await db.query(GET_CATEGORY_BY_ID(id_category), (error, data) => {
		return data[0];
	});

	console.log("*************", result);
};

export { findCategory };
