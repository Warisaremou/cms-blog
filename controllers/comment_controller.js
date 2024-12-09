import { validationResult } from "express-validator";
import { db } from "../config/database.js";
import { commentQueries } from "../database/queries/comment_queries.js";
import { pagination } from "../helpers.js";
import { commentExist } from "../services/comment_service.js";

const {GET_ALL_COMMENTS,GET_COMMENT_BY_ID,ADD_COMMENT,UPDATE_COMMENT_BY_ID}=commentQueries()

/**
 * FUNCTION TO GET ALL COMMENTS
*/
const getAll = async(req, res) => {
    try {
        const { page, currentPage, per_page } = await pagination(req.query.page);

		const [data] = await db.execute(GET_ALL_COMMENTS(per_page, page));

        res.json({
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
}

/**
 * FUNCTION TO GET A COMMENT BY ID
 */
const getOne = async (req, res) => {
	const id_comment = await req.params.id;

	try {
		const [data] = await db.execute(GET_COMMENT_BY_ID(id_comment));

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
    const {content,id_post} = req.body

    // Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		await db.execute(ADD_COMMENT(content, 2, id_post));

		res.status(201).json({
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
			await db.execute(UPDATE_COMMENT_BY_ID(req.body.content, id_comment));

			res.json({
				message: "Comment updated",
			});
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	} else {
		res.status(404).json({
			message: "Comment not found",
		});
	}
};

export {getAll,getOne,create,update}