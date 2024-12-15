export const categoryQueries = () => {
	const GET_ALL_CATEGORIES = `SELECT * FROM categories ORDER BY created_at DESC LIMIT ? OFFSET ?`;

	const GET_CATEGORY_BY_ID = `SELECT * FROM categories WHERE id_category = ?`;

	const ADD_CATEGORY = `INSERT INTO categories(name) VALUES (?)`;

	const UPDATE_CATEGORY_BY_ID = `UPDATE categories SET name = ? WHERE id_category = ?`;

	const DELETE_CATEGORY_BY_ID = `DELETE FROM categories WHERE id_category = ?`;

	return {
		GET_ALL_CATEGORIES,
		GET_CATEGORY_BY_ID,
		ADD_CATEGORY,
		UPDATE_CATEGORY_BY_ID,
		DELETE_CATEGORY_BY_ID,
	};
};
