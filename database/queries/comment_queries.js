export const commentQueries = () => {
	const GET_ALL_COMMENTS = (per_page, page) => {
		return `SELECT * FROM comments LIMIT ${per_page} OFFSET ${page}`;
	};

	const GET_COMMENT_BY_ID = (id_comment) => {
		return `SELECT * FROM comments WHERE id_comment=${id_comment}`;
	};

	const ADD_COMMENT = (content, id_user, id_post) => {
		return `INSERT INTO comments(content, id_user, id_post) VALUES ("${content}", ${id_user}, ${id_post})`;
	};

	const UPDATE_COMMENT_BY_ID = (content,id_comment) => {
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