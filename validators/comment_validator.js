import { body } from "express-validator";

const createCommentValidation = [
	body("content")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("comment content is required")
		.isLength({
			min: 3,
		})
		.withMessage("comment content must be at least 3 characters")
		.trim(),
		body("id_post")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("id_post is required")
		.isNumeric().withMessage("id_post must be a number"),
];

const updateCommentValidation = [
	body("content")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("comment content is required")
		.isLength({
			min: 3,
		})
		.withMessage("comment content must be at least 3 characters")
		.trim()
];

export { createCommentValidation, updateCommentValidation };
