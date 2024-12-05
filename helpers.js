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
