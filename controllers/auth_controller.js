import { validationResult } from "express-validator";
import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { hashHelper } from "../helpers.js";
import { findUser, userRole } from "../services/auth_service.js";

const { CREATE_USER } = authQueries();
const { hash, compare } = hashHelper();

/**
 * FUNCTION TO REGISTER A NEW USER
 */
const register = async (req, res) => {
	const result = validationResult(req);
	const { findUserWithUsername, findUserWithEmail } = findUser();
	const { username, surname, firstname, email, password } = req.body;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		// Check if a user with the same username or email exist
		const existingUserWithUsername = await findUserWithUsername(username);
		const existingUserWithEmail = await findUserWithEmail(email);

		if (existingUserWithUsername.exist) {
			return res.status(400).json({
				message: "User with the username already exist",
			});
		}

		if (existingUserWithEmail.exist) {
			return res.status(400).json({
				message: "User with the email already exist",
			});
		}

		// Hash submitted password
		const hashedPassword = await hash(password);

		// Get id of the role with by name user from the db
		const isRoleExist = await userRole("user");

		if (!isRoleExist.exist) {
			return res.status(404).json({
				message: "User's role not found",
			});
		}

		await db.execute(CREATE_USER(username, surname, firstname, email, hashedPassword, isRoleExist.id_role));

		res.status(201).json({
			message: "Account created",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO AUTHENTICATE A USER
 */
const login = async (req, res) => {
	console.log("++++++++++++++++", req.body);
	const result = validationResult(req);
	console.log("++++++++++++++++", result);

	if (!result.isEmpty) {
		return res.send({ errors: result.array() });
	}
	res.json({
		message: "Account created successfully !",
	});
};

export { login, register };
