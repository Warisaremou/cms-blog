export const commentQueries = () => {
	const GET_ALL_COMMENTS = (id_post, per_page, page) => {
		return `SELECT comments.id_comment, comments.content, comments.created_at, comments.updated_at, users.id_user, users.username, users.surname, users.firstname, users.avatar, users.id_role FROM comments INNER JOIN users ON comments.id_user=users.id_user WHERE id_post=${id_post} LIMIT ${per_page} OFFSET ${page}`;
	};

	const GET_COMMENT_BY_ID = (id_comment) => {
		return `SELECT * FROM comments WHERE id_comment=${id_comment}`;
	};

	const ADD_COMMENT = (content, id_user, id_post) => {
		return `INSERT INTO comments(content, id_user, id_post) VALUES ("${content}", ${id_user}, ${id_post})`;
	};

	const UPDATE_COMMENT_BY_ID = (content, id_comment) => {
		return `UPDATE comments SET content="${content}" WHERE id_comment=${id_comment}`;
	};

	const DELETE_COMMENT_BY_ID = (id_comment) => {
		return `DELETE FROM comments WHERE id_comment=${id_comment}`;
	};

	return {
		GET_ALL_COMMENTS,
		GET_COMMENT_BY_ID,
		ADD_COMMENT,
		UPDATE_COMMENT_BY_ID,
		DELETE_COMMENT_BY_ID,
	};
};
