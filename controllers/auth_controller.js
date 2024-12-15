import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import { transport } from "../config/email.js";
import { authQueries } from "../database/queries/auth_queries.js";
import { hashHelper, pagination, randomStringGenerator } from "../helpers.js";
import { findUser, userRole } from "../services/auth_service.js";
import { uploadToCloudinary } from "../services/upload_service.js";

const {
	GET_ROLE_BY_ID,
	CREATE_USER,
	UPDATE_USER_HASH,
	UPDATE_USER_PASSWORD_WITH_HASH,
	UPDATE_USER_ROLE_BY_ID,
	UPDATE_USER_PROFILE,
	UPDATE_USER_AVATAR,
	FIND_ALL_USERS,
	DELETE_USER_ACCOUNT_BY_USER_ID,
} = authQueries();
const { hash, compare } = hashHelper();
const { findUserWithUsername, findUserWithEmail, findUserWithHash, findUserWithId } = findUser();

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

		// Get id of the role with the name user from the db
		const isRoleExist = await userRole("user");

		if (!isRoleExist.exist) {
			return res.status(404).json({
				message: "User's role not found",
			});
		}

		await db.execute(CREATE_USER, [username, surname, firstname, email, hashedPassword, isRoleExist.id_role]);

		return res.status(201).json({
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
			const token = jwt.sign(
				{
					id_user: userData.id_user,
					username: userData.username,
					email: userData.email,
					id_role: userData.id_role,
				},
				process.env.AUTH_JWT_SECRET,
				{
					expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
				}
			);

			return res.json({
				message: "Connected",
				token,
			});
		} else {
			return res.status(400).json({
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
		await db.execute(UPDATE_USER_HASH, [generatedHash, email]);

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
				return res.status(201).json({
					message: "An email has been send to you",
				});
			})
			.catch((error) => {
				return res.status(500).json({
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

		await db.execute(UPDATE_USER_PASSWORD_WITH_HASH, [hashedPassword, hashValue]);

		return res.status(201).json({
			message: "Password reseted successfully",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO GET USER PROFILE USING TOKEN IN HEADER AUTHORIZATION
 */
const getMe = async (req, res) => {
	const { email } = await req.user;

	const isAccountExist = await findUserWithEmail(email);

	if (!isAccountExist.exist) {
		return res.status(404).json({
			message: "Account not found",
		});
	}

	// Destructuring data to remove to remove password from property
	const { password, ...trimedData } = isAccountExist.data;

	return res.json(trimedData);
};

/**
 * FUNCTION TO GET ALL USERS(ONLY ADMIN HAVE ACCESS)
 */
const getUsers = async (req, res) => {
	try {
		const { page, currentPage } = await pagination(req.query.page);

		const [data] = await db.execute(FIND_ALL_USERS, [10, page]);

		// Get id of the role with the name admin from the db
		const isRoleExist = await userRole("admin");

		if (!isRoleExist.exist) {
			return res.status(404).json({
				message: "User's role not found",
			});
		}

		// Filter data to remove admin users from the list
		const usersList = data.filter((user) => user.id_role !== isRoleExist.id_role);

		// Remove password property from each user data
		await usersList.forEach((user) => {
			delete user.password;
		});

		return res.json({
			data: usersList,
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
 * FUNCTION TO UPDATE USER PROFILE
 */
const update = async (req, res) => {
	const result = validationResult(req);
	const { id_user } = await req.user;
	const { surname, firstname, address, date_of_birth, description } = await req.body;

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	// Check if account exist
	const userExist = await findUserWithId(id_user);
	if (!userExist) {
		return res.status(400).json({
			message: "User not found",
		});
	}

	try {
		await db.execute(UPDATE_USER_PROFILE, [surname, firstname, address, date_of_birth, description, id_user]);
		return res.json({
			message: "Profile updated",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO UPDATE USER'S AVATAR
 */
const updateAvatar = async (req, res) => {
	const { id_user } = await req.user;

	try {
		if (!req.file) {
			return res.status(400).json({ error: "Please fill user's avatar" });
		}

		const result = await uploadToCloudinary(req.file.path);
		await db.execute(UPDATE_USER_AVATAR, [result.secure_url, id_user]);

		return res.json({
			message: "Avatar updated",
		});
	} catch (error) {
		return res.status(500).json({
			message: error,
		});
	}
};

/**
 * FUNCTION TO UPDATE A USER ROLE BY ID
 */
const updateRole = async (req, res) => {
	const result = validationResult(req);

	// Check validation
	if (!result.isEmpty()) {
		return res.status(400).json({
			message: result.errors,
		});
	}

	try {
		const id_role = await req.body.id_role;
		const id_user = await req.params.id;

		// Check if user already exist before updating his email
		const userExist = await findUserWithId(id_user);

		if (!userExist) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		await db.execute(UPDATE_USER_ROLE_BY_ID, [id_role, id_user]);
		return res.json({
			message: "User's role update successfuly",
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * FUNCTION TO DELETE ACCOUNT
 */
const remove = async (req, res) => {
	const { id_user, id_role } = await req.user;

	// Check id account exist
	const userExist = await findUserWithId(id_user);
	if (!userExist) {
		return res.status(400).json({
			message: "Account not found",
		});
	}

	// Add check to delete others account except admin account
	const [role] = await db.execute(GET_ROLE_BY_ID, [id_role]);
	if (role[0].name === "admin") {
		return res.status(401).json({
			message: "Cannot delete admin account",
		});
	}

	await db.execute(DELETE_USER_ACCOUNT_BY_USER_ID, [id_user]);

	return res.json({
		message: "Account deleted successfuly",
	});
};

export { forgotPassword, getMe, getUsers, login, register, remove, resetPassword, update, updateAvatar, updateRole };
