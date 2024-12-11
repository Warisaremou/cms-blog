export const postQueries = () => {
	const GET_ALL_POSTS = (per_page, page) => {
		return `SELECT * FROM posts LIMIT ${per_page} OFFSET ${page}`;
	};

	const GET_POST_BY_ID = (id_post) => {
		return `SELECT * FROM posts WHERE id_post=${id_post}`;
	};

	const ADD_POST = (title, image, content, id_user) => {
		return `INSERT INTO posts(title, image, content, id_user) VALUES ('${title}', '${image}', '${content}', ${id_user})`;
	};
  
  // const ADD_POST_CATEGORY = (id_post,id_category) => {
	// 	return `INSERT INTO post_category(id_post,id_category) VALUES ( '${id_post}', ${id_category})`;
	// };
	const UPDATE_POST_BY_ID = (id_post, title, image, content) => {
		return `UPDATE posts SET title='${title}', image='${image}', content='${content}' WHERE id_post=${id_post}`;
	};
  

	const DELETE_POST_BY_ID = (id_post) => {
		return `DELETE FROM posts WHERE id_post=${id_post}`;
	};

	return {
		GET_ALL_POSTS,
		GET_POST_BY_ID,
		ADD_POST,
		UPDATE_POST_BY_ID,
		DELETE_POST_BY_ID,
	};
};