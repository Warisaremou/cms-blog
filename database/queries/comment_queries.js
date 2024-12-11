export const commentQueries = () => {
	const GET_ALL_COMMENTS = `SELECT * FROM comments LIMIT ? OFFSET ?`;

	const GET_COMMENT_BY_ID = `SELECT * FROM comments WHERE id_comment= ?`;

	const ADD_COMMENT = `INSERT INTO comments(content, id_user, id_post) VALUES (?, ?, ?)`;

	const UPDATE_COMMENT_BY_ID = `UPDATE comments SET content = ? WHERE id_comment= ?`;

	const DELETE_COMMENT_BY_ID = `DELETE FROM comments WHERE id_comment= ?`;

	return {
		GET_ALL_COMMENTS,
		GET_COMMENT_BY_ID,
		ADD_COMMENT,
		UPDATE_COMMENT_BY_ID,
		DELETE_COMMENT_BY_ID,
	};
};
