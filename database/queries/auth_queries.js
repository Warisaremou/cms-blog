export const authQueries = () => {
	const FIND_ALL_USERS = `SELECT * FROM users LIMIT ? OFFSET ?`;

	const FIND_USER_WITH_USERNAME = `SELECT * FROM users WHERE username = ?`;

	const FIND_USER_WITH_EMAIL = `SELECT * FROM users WHERE email = ?`;

	const FIND_USER_WITH_ID = `SELECT * FROM users WHERE id_user = ?`;

	const FIND_USER_WITH_HASH = `SELECT id_user FROM users WHERE hash = ?`;

	const GET_ROLE = `SELECT id_role FROM roles WHERE name = ?`;

	const GET_ROLE_BY_ID = `SELECT name FROM roles WHERE id_role = ?`;

	const CREATE_USER = `INSERT INTO users(username, surname, firstname, email, password, id_role) VALUES (?, ?, ?, ?, ?, ?)`;

	const UPDATE_USER_PROFILE = `UPDATE users SET surname = ?, firstname = ?, address = ?, date_of_birth = ?, description = ?`;

	const UPDATE_USER_AVATAR = `UPDATE users SET avatar = ?`;

	const UPDATE_USER_HASH = `UPDATE users SET hash = ? WHERE email = ?`;

	const UPDATE_USER_PASSWORD_WITH_HASH = `UPDATE users SET password = ?, hash=NULL WHERE hash = ?`;

	const UPDATE_USER_ROLE_BY_ID = `UPDATE users SET id_role = ? WHERE id_user = ?`;

	const DELETE_USER_ACCOUNT_BY_USER_ID = `DELETE FROM users WHERE id_user = ?`;

	return {
		FIND_ALL_USERS,
		FIND_USER_WITH_USERNAME,
		FIND_USER_WITH_EMAIL,
		FIND_USER_WITH_HASH,
		FIND_USER_WITH_ID,
		GET_ROLE,
		GET_ROLE_BY_ID,
		CREATE_USER,
		UPDATE_USER_PROFILE,
		UPDATE_USER_AVATAR,
		UPDATE_USER_HASH,
		UPDATE_USER_PASSWORD_WITH_HASH,
		UPDATE_USER_ROLE_BY_ID,
		DELETE_USER_ACCOUNT_BY_USER_ID,
	};
};
