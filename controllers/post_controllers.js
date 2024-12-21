import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { categoryQueries } from "../database/queries/category_queries.js";
import { postQueries } from "../database/queries/post_queries.js";
import { pagination } from "../helpers.js";
import { postExist } from "../services/post_service.js";
import { uploadToCloudinary } from "../services/upload_service.js";

const {
	GET_ALL_POSTS,
	GET_ALL_POSTS_BY_USER_ID,
	GET_POST_BY_ID,
	GET_POST_CATEGORIES_BY_ID,
	ADD_POST,
	ADD_TO_POST_CATEGORY,
	UPDATE_POST_BY_ID,
	DELETE_POST_BY_ID,
} = postQueries();

const { GET_CATEGORY_BY_ID } = categoryQueries();
const { FIND_USER_WITH_ID } = authQueries();

/**
 * FUNCTION TO GET ALL POSTS
 */
const getAll = async (req, res) => {
	try {
		const { page, currentPage, per_page } = await pagination(req.query.page);

		const [data] = await db.execute(GET_ALL_POSTS(per_page, page));

		const postsList = await data.reduce((acc, currentPost) => {
			let existingPost = acc.find((post) => post.id_post === currentPost.id_post);

			if (!existingPost) {
				const { id_user, username, firstname, surname, avatar, id_role, id_category, name, ...rest } = currentPost;

				existingPost = {
					...rest,
					user: {
						id_user,
						username,
						firstname,
						surname,
						avatar,
						id_role,
					},
					categories: [
						{
							id_category,
							name,
						},
					],
				};
				acc.push(existingPost);

				return acc;
			} else {
				existingPost.categories.push({
					id_category: currentPost.id_category,
					name: currentPost.name,
				});

				return acc;
			}
		}, []);

		return res.json({
			data: postsList,
			meta: {
				page: currentPage,
				per_page,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO GET A POST BY ID
 */
const getOne = async (req, res) => {
	const id_post = await req.params.id;

	try {
		const [data] = await db.execute(GET_POST_BY_ID(id_post));

		if (data.length === 0) {
			return res.status(404).json({
				message: "Post not found",
			});
		}
		const postsList = await data.reduce((acc, currentPost) => {
			let existingPost = acc.find((post) => post.id_post === currentPost.id_post);

			if (!existingPost) {
				const { id_user, username, firstname, surname, avatar, id_role, id_category, name, ...rest } = currentPost;

				existingPost = {
					...rest,
					user: {
						id_user,
						username,
						firstname,
						surname,
						avatar,
						id_role,
					},
					categories: [
						{
							id_category,
							name,
						},
					],
				};
				acc.push(existingPost);

				return acc;
			} else {
				existingPost.categories.push({
					id_category: currentPost.id_category,
					name: currentPost.name,
				});

				return acc;
			}
		}, []);

		return res.json(postsList[0]);
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

/**
 * FUNCTION TO GET ALL POSTS BY USER ID
 */
const getAllByUser = async (req, res) => {
	const { id_user } = await req.user;
	try {
		const { page, currentPage, per_page } = await pagination(req.query.page);

		const [data] = await db.execute(GET_ALL_POSTS_BY_USER_ID(id_user, per_page, page));

		const postsList = await data.reduce((acc, currentPost) => {
			let existingPost = acc.find((post) => post.id_post === currentPost.id_post);

			if (!existingPost) {
				const { id_user, username, firstname, surname, avatar, id_role, id_category, name, ...rest } = currentPost;

				existingPost = {
					...rest,
					user: {
						id_user,
						username,
						firstname,
						surname,
						avatar,
						id_role,
					},
					categories: [
						{
							id_category,
							name,
						},
					],
				};
				acc.push(existingPost);

				return acc;
			} else {
				existingPost.categories.push({
					id_category: currentPost.id_category,
					name: currentPost.name,
				});

				return acc;
			}
		}, []);

		return res.json({
			data: postsList,
			meta: {
				page: currentPage,
				per_page,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO CREATE A POST
 */
const create = async (req, res) => {
	const { id_user } = await req.user;
	const { title, content, categories } = req.body;
	let uploadResult = {};

	try {
		// Check if title, content and categories are filled
		if (!title || !content || !categories) {
			return res.status(400).json({
				message: "title and content and categories are required",
			});
		}

		// Check if post image has been uploaded
		if (req.file) {
			uploadResult = await uploadToCloudinary(req.file.path);
		}

		const [postResult] = await db.execute(ADD_POST(title, req.file ? uploadResult.secure_url : null, content, id_user));

		// Ajouter les catégories associées dans la table `post_categories`
		const postId = postResult.insertId;

		for (const id_category of categories) {
			// Utiliser la fonction dynamique pour chaque catégorie
			await db.query(ADD_TO_POST_CATEGORY(postId, id_category));
		}

		return res.status(201).json({
			message: "Post created",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO UPDATE A POST BY ID
 */
const update = async (req, res) => {
	const id_post = await req.params.id;
	console.log(id_post);
	const isPostExist = await postExist(id_post);
	const { title, content, categories } = req.body;
	let uploadResult = {};

	// Check if the post already exist
	if (!isPostExist.exist) {
		return res.status(404).json({
			message: "Post not found",
		});
	}

	try {
		// Check if title, content and categories are filled
		if (!title || !content || !categories) {
			return res.status(400).json({
				message: "title and content and categories are required",
			});
		}

		// Check if post image has been uploaded
		if (req.file) {
			uploadResult = await uploadToCloudinary(req.file.path);
		}

		// ? If new image has been uploaded, change image else if post have an image just past the same url else just past null
		const postHasImage = (await isPostExist.data.image) !== null;
		await db.execute(
			UPDATE_POST_BY_ID(
				title,
				req.file ? uploadResult.secure_url : postHasImage ? isPostExist.data.image : null,
				content,
				id_post
			)
		);

		// TODO: Fix case when user change categories
		return res.json({
			message: "Post updated",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO DELETE A POST BY ID
 */
const remove = async (req, res) => {
	const id_post = await req.params.id;
	const isPostExist = await postExist(id_post);

	if (isPostExist.exist) {
		try {
			await db.execute(DELETE_POST_BY_ID(id_post));

			return res.json({
				message: "Post deleted",
			});
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	} else {
		return res.status(404).json({
			message: "Post not found",
		});
	}
};

export { create, getAll, getAllByUser, getOne, remove, update };
