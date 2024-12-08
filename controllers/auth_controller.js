import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { hashHelper } from "../helpers.js";
import { findUser, userRole } from "../services/auth_service.js";
import { transport } from "../config/email.js";

const { CREATE_USER } = authQueries();
const { hash, compare } = hashHelper();
const { findUserWithUsername, findUserWithEmail } = findUser();

/**
 * FUNCTION TO REGISTER A NEW USER
 */
const register = async (req, res) => {
	const result = validationResult(req);
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
	const result = validationResult(req);
	const { identifier, password } = req.body;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		let isValidPassword = false;
		let userData = null;
		// Check if a user with the same username or email exist
		const existingUserWithUsername = await findUserWithUsername(identifier);
		const existingUserWithEmail = await findUserWithEmail(identifier);

		if (existingUserWithUsername.exist || existingUserWithEmail.exist) {
			// Check if password is valid using compare from hashHelper
			if (existingUserWithUsername.exist) {
				isValidPassword = await compare(password, existingUserWithUsername.data.password);
				userData = await existingUserWithUsername.data;
			} else {
				isValidPassword = await compare(password, existingUserWithEmail.data.password);
				userData = await existingUserWithEmail.data;
			}

			if (!isValidPassword) {
				return res.status(400).json({
					message: "Invalid credentials",
				});
			}

			// Generate token
			const token = await jwt.sign(
				{
					id_user: userData.id_user,
					username: userData.username,
					surname: userData.surname,
					firstname: userData.firstname,
					email: userData.email,
					address: userData.address,
					avatar: userData.avatar,
					date_of_birth: userData.date_of_birth,
					description: userData.description,
				},
				process.env.AUTH_JWT_SECRET,
				{
					expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
				}
			);

			res.json({
				message: "Connected",
				token,
			});
		} else {
			res.status(400).json({
				message: "Invalid credentials",
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO SEND A FORGOT PASSWORD EMAIL
 */
const forgotPassword = async (req, res) => {
	const result = validationResult(req);
	const email = req.body.email;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		// Check if a user with the same email exist
		const existingUserWithEmail = await findUserWithEmail(email);

		if (!existingUserWithEmail.exist) {
			return res.status(400).json({
				message: "Account not found",
			});
		}

		// Send an email to the user
		await transport
			.sendMail({
				from: `${process.env.MAIL_DEFAULT_SENDER_NAME} ${process.env.MAIL_DEFAULT_SENDER}`,
				to: email,
				subject: "Reset your password",
				html: "<b>Hello world?</b>",
			})
			.then((response) => {
				// console.log("*****", response);
				res.status(201).json({
					message: "An email has been send to you",
				});
			})
			.catch((error) => {
				res.status(500).json({
					message: error.messag,
				});
			});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

export { forgotPassword, login, register };
