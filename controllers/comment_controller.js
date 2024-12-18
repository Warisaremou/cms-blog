import { validationResult } from "express-validator";
import { db } from "../config/database.js";
import { commentQueries } from "../database/queries/comment_queries.js";
import { pagination } from "../helpers.js";
import { commentExist } from "../services/comment_service.js";
import { postQueries } from "../database/queries/post_queries.js";

const { GET_ALL_COMMENTS, GET_COMMENT_BY_ID, ADD_COMMENT, UPDATE_COMMENT_BY_ID, DELETE_COMMENT_BY_ID } =
	commentQueries();
const {
	GET_POST_BY_ID,
} = postQueries();

/**
 * FUNCTION TO GET ALL COMMENTS
 */
const getAll = async (req, res) => {
	const id_post = await req.params.id_post
	try {
		const [post_data] = await db.execute(GET_POST_BY_ID, [id_post]);
		if (post_data.length === 0) {
			return res.status(404).json({
				message: "Post not found",
			});
		}

		const { page, currentPage, per_page } = await pagination(req.query.page);

		const [data] = await db.execute(GET_ALL_COMMENTS, [id_post, per_page, page]);

		return res.json({
			data: data,
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
 * FUNCTION TO GET A COMMENT BY ID
 */
const getOne = async (req, res) => {
	const id_comment = await req.params.id;

	try {
		const [data] = await db.execute(GET_COMMENT_BY_ID, [id_comment]);

		if (data.length === 0) {
			return res.status(404).json({
				message: "Comment not found",
			});
		} else {
			return res.json({
				data: data[0],
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};

/**
 * FUNCTION TO CREATE A COMMENT
 */
const create = async (req, res) => {
	const result = await validationResult(req);
	const { content, id_post } = req.body;
	const userData = await req.user;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		await db.execute(ADD_COMMENT, [content, userData.id_user, id_post]);

		return res.status(201).json({
			message: "Comment created",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO UPDATE A COMMENT BY ID
 */
const update = async (req, res) => {
	const result = await validationResult(req);
	const id_comment = await req.params.id;
	const isCommentExist = await commentExist(id_comment);

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	// Check if the comment already exist
	if (isCommentExist.exist) {
		try {
			await db.execute(UPDATE_COMMENT_BY_ID, [req.body.content, id_comment]);

			return res.json({
				message: "Comment updated",
			});
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	} else {
		return res.status(404).json({
			message: "Comment not found",
		});
	}
};

/**
 * FUNCTION TO DELETE A COMMENT BY ID
 */
const remove = async (req, res) => {
	const id_comment = await req.params.id;
	const isCommentExist = await commentExist(id_comment);

	if (isCommentExist.exist) {
		try {
			await db.execute(DELETE_COMMENT_BY_ID, [id_comment]);

			return res.json({
				message: "Comment deleted",
			});
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	} else {
		return res.status(404).json({
			message: "Comment not found",
		});
	}
};

export { getAll, getOne, create, update, remove };
