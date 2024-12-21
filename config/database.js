import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connection to MySQL server
 */
const db = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	connectTimeout: 60000,
	waitForConnections: true,
	connectionLimit: 10,
});

/**
 * Establishing connection
 */
const connect = async () => {
	try {
		const pool = await db.getConnection();
		console.log("✅ Connected successfuly !");
		pool.release();
	} catch (error) {
		console.error("❌ Connection failed:", error);
	}
};

export { db, connect };
