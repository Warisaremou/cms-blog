import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import { transport } from "../config/email.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { hashHelper, randomStringGenerator } from "../helpers.js";
import { findUser, userRole } from "../services/auth_service.js";

const { CREATE_USER, UPDATE_USER_HASH, UPDATE_USER_PASSWORD_WITH_HASH } = authQueries();
const { hash, compare } = hashHelper();
const { findUserWithUsername, findUserWithEmail, findUserWithHash } = findUser();

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

		// Generate hash in url query param
		const generatedHash = await randomStringGenerator();
		// Insert generatedHash in the user's data
		await db.execute(UPDATE_USER_HASH(generatedHash, email));

		// Send an email to the user
		await transport
			.sendMail({
				from: `${process.env.MAIL_DEFAULT_SENDER_NAME} ${process.env.MAIL_DEFAULT_SENDER}`,
				to: email,
				subject: "Reset your password",
				template: "forgot-password",
				context: {
					url: `${process.env.FRONTEND_DOMAIN}/reset-password?hash=${generatedHash}`,
				},
			})
			.then(() => {
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

/**
 * FUNCTION TO RESET PASSWORD
 */
const resetPassword = async (req, res) => {
	const result = validationResult(req);
	const { hashValue, password } = req.body;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		// Check hash validity
		const isValidHash = await findUserWithHash(hashValue);

		if (!isValidHash) {
			return res.status(400).json({
				message: "Invalid hash or expired link",
			});
		}

		// Hash submitted password
		const hashedPassword = await hash(password);

		await db.execute(UPDATE_USER_PASSWORD_WITH_HASH(hashValue, hashedPassword));

		res.status(201).json({
			message: "Password reseted successfully",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO RESET PASSWORD
 */
const getMe = async (req, res) => {
	const token = await req.headers.authorization.slice(7);
	await jwt.verify(token, process.env.AUTH_JWT_SECRET, (error, decoded) => {
		// console.log(error);
		if (error) {
			return res.status(401).json({
				message: "Invalid token",
			});
		}

		res.json(decoded);
	});
};

export { forgotPassword, getMe, login, register, resetPassword };
