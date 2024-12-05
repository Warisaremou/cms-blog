import { validationResult } from "express-validator";

/**
 * FUNCTION TO REGISTER A NEW USER
 */
const register = async (req, res) => {
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
