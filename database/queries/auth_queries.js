export const authQueries = () => {
	/**
	 * Function to find a user by his email
	 */
	const FIND_USER_BY_EMAIL = (email) => {
		return `SELECT * FROM users where email=${email}`;
	};

	/**
	 * Function to insert a new user in the users table
	 */
	const INSERT_USER = (username, email, surname, firstname, password, role) => {
		return `INSERT INTO users (username, email, surname, firstname, password, role) VALUES (${username}, ${email}, ${surname}, ${firstname}, ${password}, ${role})`;
	};

	return {
		FIND_USER_BY_EMAIL,
		INSERT_USER,
	};
};
