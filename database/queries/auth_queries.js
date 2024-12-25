export const authQueries = () => {
	const FIND_ALL_USERS = (per_page, page) => {
		return `SELECT * FROM users LIMIT ${per_page} OFFSET ${page}`;
	};

	const FIND_USER_WITH_USERNAME = (username) => {
		return `SELECT * FROM users WHERE username="${username}"`;
	};

	const FIND_USER_WITH_EMAIL = (email) => {
		return `SELECT * FROM users WHERE email="${email}"`;
	};

	const FIND_USER_WITH_ID = (id_user) => {
		return `SELECT * FROM users WHERE id_user=${id_user}`;
	};

	const FIND_USER_WITH_HASH = (hash) => {
		return `SELECT id_user FROM users WHERE hash="${hash}"`;
	};

	const GET_ROLE = (name) => {
		return `SELECT id_role FROM roles WHERE name="${name}"`;
	};

	const GET_ROLE_BY_ID = (id_role) => {
		return `SELECT name FROM roles WHERE id_role=${id_role}`;
	};

	const CREATE_USER = (email, password, username, firstname, surname, id_role) => {
		return `INSERT INTO users(email, password, username, firstname, surname, id_role) VALUES ("${email}", "${password}", "${username}", "${firstname}", "${surname}", ${id_role})`;
	};

	const UPDATE_USER_PROFILE = (firstname, surname, address, description, id_user) => {
		return `UPDATE users SET firstname="${firstname}", surname="${surname}", address="${address}", description="${description}" WHERE id_user=${id_user}`;
	};

	const UPDATE_USER_AVATAR = (avatar, id_user) => {
		return `UPDATE users SET avatar="${avatar}" WHERE id_user=${id_user}`;
	};

	const UPDATE_USER_HASH = (hash, email) => {
		return `UPDATE users SET hash="${hash}" WHERE email="${email}"`;
	};

	const UPDATE_USER_PASSWORD_WITH_HASH = (password, hash) => {
		return `UPDATE users SET password="${password}", hash=NULL WHERE hash="${hash}"`;
	};

	const UPDATE_USER_ROLE_BY_ID = (id_role, id_user) => {
		return `UPDATE users SET id_role=${id_role} WHERE id_user=${id_user}`;
	};

	const DELETE_USER_ACCOUNT_BY_USER_ID = (id_user) => {
		return `DELETE FROM users WHERE id_user=${id_user}`;
	};

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
