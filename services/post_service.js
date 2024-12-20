import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { categoryQueries } from "../database/queries/category_queries.js";
import { postQueries } from "../database/queries/post_queries.js";

const { GET_POST_BY_ID, GET_POST_CATEGORIES_BY_ID } = await postQueries();
const { FIND_USER_WITH_ID } = authQueries();
const { GET_CATEGORY_BY_ID } = categoryQueries();

/**
 * This function check if a category exist and return a boolean
 * @param {*} id_post
 * @returns boolean and data(if post exist)
 */
const postExist = async (id_post) => {
	const [data] = await db.execute(GET_POST_BY_ID(id_post));

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

/**
 * This function enriches a post with its categories and user
 * @param {*} post
 * @return {*} the enriched post
 */
const getPostWithCategoriesAndUser = async (post) => {
	const [categories] = await db.execute(GET_POST_CATEGORIES_BY_ID(post.id_post));
	const [user] = await db.execute(FIND_USER_WITH_ID(post.id_user));
	const { password, hash, ...rest } = user[0] ?? {};
	post.user = rest ?? {};

	// If categories exist, fetch their details
	if (categories.length > 0) {
		const categoryData = await Promise.all(
			categories.map(async (category) => {
				const [categoryInfo] = await db.execute(GET_CATEGORY_BY_ID(category.id_category));
				return categoryInfo;
			})
		);
		// Assign categories to the post
		post.categories = categoryData.flat();
	} else {
		// Set categories to empty array
		post.categories = [];
	}

	return post; // Return the enriched post
};

export { postExist, getPostWithCategoriesAndUser };
