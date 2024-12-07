import { body } from "express-validator";

const registerValidator = [
	body("username")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("username is required")
		.isLength({
			min: 3,
		})
		.withMessage("username must be at least 3 characters")
		.trim(),
	body("surname")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("surname is required")
		.isLength({
			min: 3,
		})
		.withMessage("surname must be at least 3 characters")
		.trim(),
	body("firstname")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("firstname is required")
		.isLength({
			min: 3,
		})
		.withMessage("firstname must be at least 3 characters")
		.trim(),
	body("email")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("email is required")
		.isLength({
			min: 3,
		})
		.withMessage("email must be at least 3 characters")
		.isEmail()
		.withMessage("email is invalid")
		.trim(),
	body("password")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("password is required")
		.isLength({
			min: 8,
		})
		.withMessage("password must have at least 8 characters")
		.trim(),
];

export { registerValidator };
