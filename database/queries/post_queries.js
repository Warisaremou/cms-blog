export const postQueries = () => {
	const GET_ALL_POSTS = (per_page, page) => {
		return `SELECT posts.id_post, posts.title, posts.image, posts.content, posts.created_at, users.id_user, users.username, users.surname, users.firstname, users.avatar, users.id_role, categories.id_category, categories.name FROM posts INNER JOIN users ON posts.id_user=users.id_user INNER JOIN post_category ON posts.id_post=post_category.id_post INNER JOIN categories ON post_category.id_category=categories.id_category ORDER BY posts.created_at ASC LIMIT ${per_page} OFFSET ${page}`;
	};

	const GET_ALL_POSTS_BY_USER_ID = (id_user, per_page, page) => {
		return `SELECT posts.id_post, posts.title, posts.image, posts.content, posts.created_at, users.id_user, users.username, users.surname, users.firstname, users.avatar, users.id_role, categories.id_category, categories.name FROM posts INNER JOIN users ON posts.id_user=users.id_user INNER JOIN post_category ON posts.id_post=post_category.id_post INNER JOIN categories ON post_category.id_category=categories.id_category WHERE posts.id_user=${id_user} ORDER BY posts.created_at ASC LIMIT ${per_page} OFFSET ${page} `;
	};

	const GET_POST_BY_ID = (id_post) => {
		return `SELECT posts.id_post, posts.title, posts.image, posts.content, posts.created_at, users.id_user, users.username, users.surname, users.firstname, users.avatar, users.id_role, categories.id_category, categories.name FROM posts INNER JOIN users ON posts.id_user=users.id_user INNER JOIN post_category ON posts.id_post=post_category.id_post INNER JOIN categories ON post_category.id_category=categories.id_category WHERE posts.id_post=${id_post}`;
	};

	const GET_POST_CATEGORIES_BY_ID = (id_post) => {
		`SELECT id_category FROM post_category WHERE id_post=${id_post}`;
	};

	const ADD_POST = (title, image, content, id_user) => {
		return `INSERT INTO posts(title, image, content, id_user) VALUES ("${title}","${image}","${content}",${id_user})`;
	};

	const ADD_TO_POST_CATEGORY = (id_post, id_category) => {
		return `INSERT INTO post_category(id_post, id_category) VALUES (${id_post},${id_category})`;
	};

	const UPDATE_POST_BY_ID = (title, image, content, id_post) => {
		return `UPDATE posts SET title="${title}", image="${image}", content="${content}" WHERE id_post=${id_post}`;
	};

	const DELETE_POST_BY_ID = (id_post) => {
		return `DELETE FROM posts WHERE id_post=${id_post}`;
	};

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
