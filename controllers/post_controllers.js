import { db } from "../config/database.js";
import { postQueries } from "../database/queries/post_queries.js";
import { pagination } from "../helpers.js";
import { postExist } from "../services/post_service.js";
import { uploadToCloudinary } from "../services/upload_service.js";
import { categoryQueries } from "../database/queries/category_queries.js";
import { authQueries } from "../database/queries/auth_queries.js";

const {
	GET_ALL_POSTS,
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

		const [data] = await db.execute(GET_ALL_POSTS, [per_page, page]);

		const newData = await Promise.all(
			data.map(async (post) => {
				const [categories] = await db.execute(GET_POST_CATEGORIES_BY_ID, [post.id_post]);
				const [user] = await db.execute(FIND_USER_WITH_ID, [post.id_user]);
				const { password, hash, ...rest } = user[0] ?? {};
				post.user = rest ?? {};

				// If categories exist, fetch their details
				if (categories.length > 0) {
					const categoryData = await Promise.all(
						categories.map(async (category) => {
							const [categoryInfo] = await db.execute(GET_CATEGORY_BY_ID, [category.id_category]);
							return categoryInfo;
						})
					);
					// Assign categories to the post
					post.categories = categoryData.flat();
				} else {
					// Set categories to empty array
					post.categories = [];
				}

				return post;
			})
		);

		return res.json({
			data: newData,
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
		const [data] = await db.execute(GET_POST_BY_ID, [id_post]);

		if (data.length === 0) {
			return res.status(404).json({
				message: "Post not found",
			});
		}

		const post = data[0];

		const [categories] = await db.execute(GET_POST_CATEGORIES_BY_ID, [post.id_post]);
		const [user] = await db.execute(FIND_USER_WITH_ID, [post.id_user]);
		const { password, hash, ...rest } = user[0] ?? {};
		post.user = rest ?? {};

		// If categories exist, fetch their details
		if (categories.length > 0) {
			const categoryData = await Promise.all(
				categories.map(async (category) => {
					const [categoryInfo] = await db.execute(GET_CATEGORY_BY_ID, [category.id_category]);
					return categoryInfo;
				})
			);
			// Assign categories to the post
			post.categories = categoryData.flat();
		} else {
			// Set categories to empty array
			post.categories = [];
		}

		return res.json(post);
	} catch (error) {
		return res.status(500).json({
			error: error.message,
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

		const [postResult] = await db.execute(ADD_POST, [
			title,
			req.file ? uploadResult.secure_url : null,
			content,
			id_user,
		]);

		// Ajouter les catégories associées dans la table `post_categories`
		const postId = postResult.insertId;

		// Check if submitted categories is a list
		const isListOfCategories = typeof categories !== "string";
		let values = [];
		if (isListOfCategories) {
			values = await categories.map((id_category) => [postId, parseInt(id_category)]);
		}

		// Insert the post id and categories id in post_category table
		await db.query(ADD_TO_POST_CATEGORY, [isListOfCategories ? values : [[postId, parseInt(categories)]]]);
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
		await db.execute(UPDATE_POST_BY_ID, [
			title,
			req.file ? uploadResult.secure_url : postHasImage ? isPostExist.data.image : null,
			content,
			id_post,
		]);

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
			await db.execute(DELETE_POST_BY_ID, [id_post]);

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

export { create, getAll, getOne, remove, update };
