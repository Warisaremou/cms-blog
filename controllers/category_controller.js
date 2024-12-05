import { categoryQueries } from "../database/queries/category_queries.js";
import { pagination } from "../helpers.js";
import db from "../config/database.js";

const { GET_ALL_CATEGORIES, GET_CATEGORY_BY_ID, ADD_CATEGORY, UPDATE_CATEGORY_BY_ID, DELETE_CATEGORY_BY_ID } =
	categoryQueries();

/**
 * FUNCTION TO GET ALL CATEGORIES
 */
const getAll = async (req, res) => {
	const { page, currentPage, per_page } = await pagination(req.query.page);

	await db.query(GET_ALL_CATEGORIES(per_page, page), (error, data) => {
		if (error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		res.json({
			data: data,
			meta: {
				page: currentPage,
				per_page,
			},
		});
	});
};

/**
 * FUNCTION TO GET A CATEGORY BY ID
 */
const getOne = async (req, res) => {
	const id_category = await req.params.id;

	await db.query(GET_CATEGORY_BY_ID(id_category), (error, data) => {
		if (error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		if (data.length === 0) {
			return res.status(404).json({
				message: "Category not found",
			});
		} else {
			return res.json({
				data: data[0],
			});
		}
	});
};

/**
 * FUNCTION TO CREATE A CATEGORY
 */
const create = async (req, res) => {
	console.log(req.body);

	await db.query(ADD_CATEGORY(req.body.name), (error, data) => {
		if (error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		res.status(201).json({
			message: "Category created",
			// data: data,
		});
	});
};

/**
 * FUNCTION TO UPDATE A CATEGORY BY ID
 */
const update = async (req, res) => {
	const id_category = await req.params.id;

	// TODO: CHECK IF CATEGORY WITH ID EXIST BEFORE UPDATING HIS VALUE
	await db.query(UPDATE_CATEGORY_BY_ID(id_category, req.body.name), (error, data) => {
		if (error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		res.json({
			message: "Category updated",
			// data: data,
		});
	});
};

/**
 * FUNCTION TO DELETE A CATEGORY BY ID
 */
const remove = async (req, res) => {
	const id_category = await req.params.id;

	// TODO: ADD CHECKING
	await db.query(DELETE_CATEGORY_BY_ID(id_category), (error, data) => {
		if (error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		console.log(data);

		res.json({
			message: "Category deleted",
			// data: data,
		});
	});
};

export { create, getAll, getOne, remove, update };
