import { body } from "express-validator";

const createCategoryValidation = [
	body("name")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("category name is required")
		.isLength({
			min: 3,
		})
		.withMessage("category must be at least 3 characters")
		.trim(),
];

export default createCategoryValidation;
