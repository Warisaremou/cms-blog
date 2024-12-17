export const postQueries = () => {
	const GET_ALL_POSTS = `SELECT * FROM posts ORDER BY created_at ASC LIMIT ? OFFSET ?`;

	const GET_ALL_POSTS_BY_USER_ID = `SELECT * FROM posts WHERE id_user = ? ORDER BY created_at ASC LIMIT ? OFFSET ?`;

	const GET_POST_BY_ID = `SELECT * FROM posts WHERE id_post = ?`;

	const GET_POST_CATEGORIES_BY_ID = `SELECT id_category FROM post_category WHERE id_post = ?`;

	const ADD_POST = `INSERT INTO posts(title, image, content, id_user) VALUES (?, ?, ?, ?)`;

	const ADD_TO_POST_CATEGORY = `INSERT INTO post_category(id_post, id_category) VALUES ?`;

	const UPDATE_POST_BY_ID = `UPDATE posts SET title = ?, image = ?, content = ? WHERE id_post = ?`;

	const DELETE_POST_BY_ID = `DELETE FROM posts WHERE id_post= ?`;

	return {
		GET_ALL_POSTS,
		GET_ALL_POSTS_BY_USER_ID,
		GET_POST_BY_ID,
		GET_POST_CATEGORIES_BY_ID,
		ADD_POST,
		ADD_TO_POST_CATEGORY,
		UPDATE_POST_BY_ID,
		DELETE_POST_BY_ID,
	};
};
