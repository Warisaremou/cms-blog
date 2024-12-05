import mysql from "mysql";

/**
 * Connection to MySQL server
 */
const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	connectTimeout: 60000,
	connectionLimit: 10,
	waitForConnection: true,
});

/**
 * Create database if it doesn't already exist
 */
// connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`);

/**
 * Establishing connection
 */
connection.connect((error) => {
	if (error) {
		console.error("❌ Connection failed:", error);
		return;
	}
	console.log("✅ Connected successfuly !");
});

export default connection;
