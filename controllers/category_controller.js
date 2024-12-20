import { validationResult } from "express-validator";
import { db } from "../config/database.js";
import { categoryQueries } from "../database/queries/category_queries.js";
import { pagination } from "../helpers.js";
import { categoryExist } from "../services/category_service.js";

const { GET_ALL_CATEGORIES, GET_CATEGORY_BY_ID, ADD_CATEGORY, UPDATE_CATEGORY_BY_ID, DELETE_CATEGORY_BY_ID } =
	categoryQueries();

/**
 * FUNCTION TO GET ALL CATEGORIES
 */
const getAll = async (req, res) => {
	try {
		const { page, currentPage } = await pagination(req.query.page);

		const [data] = await db.execute(GET_ALL_CATEGORIES(10, page));

		return res.json({
			data: data,
			meta: {
				page: currentPage,
				per_page: 10,
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO GET A CATEGORY BY ID
 */
const getOne = async (req, res) => {
	const id_category = await req.params.id;

	try {
		const [data] = await db.execute(GET_CATEGORY_BY_ID(id_category));

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

/**
 * FUNCTION TO CREATE A CATEGORY
 */
const create = async (req, res) => {
	const result = await validationResult(req);

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		await db.execute(ADD_CATEGORY(req.body.name));

		return res.status(201).json({
			message: "Category created",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO UPDATE A CATEGORY BY ID
 */
const update = async (req, res) => {
	const result = await validationResult(req);
	const id_category = await req.params.id;
	const isCategoryExist = await categoryExist(id_category);

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	// Check if the category already exist
	if (!isCategoryExist.exist) {
		return res.status(404).json({
			message: "Category not found",
		});
	}

	try {
		await db.execute(UPDATE_CATEGORY_BY_ID(req.body.name, id_category));

		return res.json({
			message: "Category updated",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO DELETE A CATEGORY BY ID
 */
const remove = async (req, res) => {
	const id_category = await req.params.id;
	const isCategoryExist = await categoryExist(id_category);

	if (!isCategoryExist.exist) {
		return res.status(404).json({
			message: "Category not found",
		});
	}

	try {
		await db.execute(DELETE_CATEGORY_BY_ID(id_category));

		return res.json({
			message: "Category deleted",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

export { create, getAll, getOne, remove, update };
