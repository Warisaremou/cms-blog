export const authQueries = () => {
	const FIND_USER_WITH_USERNAME = (username) => {
		return `SELECT * FROM users WHERE username='${username}'`;
	};

	const FIND_USER_WITH_EMAIL = (email) => {
		return `SELECT * FROM users WHERE email='${email}'`;
	};

	const GET_ROLE = (role_name) => {
		return `SELECT id_role FROM roles WHERE name='${role_name}'`;
	};

	const CREATE_USER = (username, surname, firstname, email, password, id_role) => {
		return `INSERT INTO users(username, surname, firstname, email, password, id_role) VALUES ('${username}','${surname}','${firstname}','${email}','${password}',${id_role})`;
	};

	return {
		FIND_USER_WITH_USERNAME,
		FIND_USER_WITH_EMAIL,
		GET_ROLE,
		CREATE_USER,
	};
};
