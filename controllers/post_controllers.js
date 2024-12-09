// import { validationResult } from "express-validator";

import { db } from "../config/database.js";
import { pagination } from "../helpers.js";



/**
 * FUNCTION TO GET ALL POSTS
*/
const getAll = async (req, res) => {
	try {
		const { page, currentPage, per_page } = await pagination(req.query.page);

		const [data] = await db.execute(`SELECT * FROM posts LIMIT ${per_page} OFFSET ${page}`);

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
};

/**
 * FUNCTION TO GET A POST BY ID
 */
const getOne = async (req, res) => {
	const id_post = await req.params.id;

	try {
		const [data] = await db.execute(`SELECT * FROM posts WHERE id_post=${id_post}`);

		if (data.length === 0) {
			return res.status(404).json({
				message: "Category not found",
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

export { getAll, getOne};