import { body } from "express-validator";

const registerValidator = [
	body("nom")
		.trim()
		.notEmpty({
			ignore_whitespace: true,
		})
		.isLength({
			min: 3,
		}),
	body("marque").notEmpty().trim().length(),
	body("sucre").notEmpty().trim().length(),
	body("calories").notEmpty().trim().length(),
	body("graisses").notEmpty().trim().length(),
	body("proteines").notEmpty().trim().length(),
];
