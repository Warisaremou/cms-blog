export const authQueries = () => {
	const FIND_USER_WITH_USERNAME = (username) => {
		return `SELECT * FROM users WHERE username='${username}'`;
	};

	const FIND_USER_WITH_EMAIL = (email) => {
		return `SELECT * FROM users WHERE email='${email}'`;
	};

	const FIND_USER_WITH_HASH = (hash) => {
		return `SELECT id_user FROM users WHERE hash='${hash}'`;
	};

	const GET_ROLE = (role_name) => {
		return `SELECT id_role FROM roles WHERE name='${role_name}'`;
	};

	const CREATE_USER = (username, surname, firstname, email, password, id_role) => {
		return `INSERT INTO users(username, surname, firstname, email, password, id_role) VALUES ('${username}','${surname}','${firstname}','${email}','${password}',${id_role})`;
	};

	const UPDATE_USER_HASH = (hash, email) => {
		return `UPDATE users SET hash='${hash}' WHERE email='${email}'`;
	};

	const UPDATE_USER_PASSWORD_WITH_HASH = (hash, password) => {
		return `UPDATE users SET password='${password}', hash=NULL WHERE hash='${hash}'`;
	};

	return {
		FIND_USER_WITH_USERNAME,
		FIND_USER_WITH_EMAIL,
		FIND_USER_WITH_HASH,
		GET_ROLE,
		CREATE_USER,
		UPDATE_USER_HASH,
		UPDATE_USER_PASSWORD_WITH_HASH,
	};
};
