export const categoryQueries = () => {
	const GET_ALL_CATEGORIES = (per_page, page) => {
		return `SELECT * FROM categories LIMIT ${per_page} OFFSET ${page}`;
	};

	const GET_CATEGORY_BY_ID = (id_category) => {
		return `SELECT * FROM categories WHERE id_category=${id_category}`;
	};

	const ADD_CATEGORY = (name) => {
		return `INSERT INTO categories(name) VALUES ('${name}')`;
	};

	const UPDATE_CATEGORY_BY_ID = (id_category, name) => {
		return `UPDATE categories SET name='${name}' WHERE id_category=${id_category}`;
	};

	const DELETE_CATEGORY_BY_ID = (id_category) => {
		return `DELETE FROM categories WHERE id_category=${id_category}`;
	};

	return {
		GET_ALL_CATEGORIES,
		GET_CATEGORY_BY_ID,
		ADD_CATEGORY,
		UPDATE_CATEGORY_BY_ID,
		DELETE_CATEGORY_BY_ID,
	};
};
