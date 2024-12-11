export const postQueries = () => {
	const GET_ALL_POSTS = `SELECT * FROM posts LIMIT ? OFFSET ?`;

	const GET_POST_BY_ID = `SELECT * FROM posts WHERE id_post = ?`;

	const ADD_POST =  `INSERT INTO posts(title, image, content, id_user) VALUES (?, ?, ?, ?)`;
  
  // const ADD_POST_CATEGORY = (id_post,id_category) => {
	// 	return `INSERT INTO post_category(id_post,id_category) VALUES (?, ?)`;
	// };
	const UPDATE_POST_BY_ID = `UPDATE posts SET title = ?, image = ?, content = ? WHERE id_post = ?`;
	
	const DELETE_POST_BY_ID =`DELETE FROM posts WHERE id_post= ?`;

	return {
		GET_ALL_POSTS,
		GET_POST_BY_ID,
		ADD_POST,
		UPDATE_POST_BY_ID,
		DELETE_POST_BY_ID,
	};
}