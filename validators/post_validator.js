import { body } from "express-validator";

const createPostValidation = [
	body("title")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("title is required"),
		// .isLength({
		// 	min: 2,
		// })
		// .withMessage("post must be at least 2 characters")
		// .trim(),
		
  // Vérifie que le champ categories est un tableau non vide
  body('categories')
    .isArray({ min: 1 })
    .withMessage('categories must be an array containing at least one category')
    .custom((categories) => {
      const invalidIds = categories.filter((id) => !Number.isInteger(id) || id <= 0);
      if (invalidIds.length > 0) {
        throw new Error('All IDs in categories must be integers ');
      }
      return true;
    }),
    body("image").optional(),
    body("content")
		.notEmpty({
			ignore_whitespace: true,
		})
		.withMessage("content is required")
    
];

export { createPostValidation };