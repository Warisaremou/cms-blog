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

const loginValidator = [
	body("identifier")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("identifier is required")
		.isLength({
			min: 3,
		})
		.withMessage("identifier must be at least 3 characters")
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

const forgotPasswordValidator = [
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
];

const resetPasswordValidator = [
	body("hashValue")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("hash value is required")
		.isLength({
			min: 30,
		})
		.withMessage("hash value must be at least 30 characters")
		.trim(),
	body("password")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("new password is required")
		.isLength({
			min: 8,
		})
		.withMessage("password must have at least 8 characters")
		.trim(),
];

const updateProfileValidator = [
	body("surname").trim(),
	body("firstname").trim(),
	body("address").trim(),
	// body("date_of_birth").trim(),
	body("description").trim(),
];

const updateRoleValidator = [
	body("id_role")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("role id is required")
		.custom((value) => {
			if (typeof value == "string") {
				throw new Error("role id must be a number");
			} else {
				return true;
			}
		}),
];

export {
	registerValidator,
	loginValidator,
	forgotPasswordValidator,
	updateProfileValidator,
	resetPasswordValidator,
	updateRoleValidator,
};
