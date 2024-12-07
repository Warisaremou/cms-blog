import bcrypt from "bcrypt";

/**
 * Helper function to manage pagination
 */
export const pagination = async (page = 1) => {
	const per_page = 5;

	return {
		page: (page - 1) * per_page,
		currentPage: parseInt(page),
		per_page,
	};
};

/**
 * Helper function to hash a value or compare a hashedValue
 */
export const hashHelper = () => {
	const hash = async (value) => {
		const hashedValue = await bcrypt.hash(value, 10);
		return hashedValue;
	};

	const compare = async (value, hashedValue) => {
		const isValid = await bcrypt.compare(value, hashedValue);
		return isValid;
	};

	return {
		hash,
		compare,
	};
};
