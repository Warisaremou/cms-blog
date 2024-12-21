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
 * Event listeners for debugging
 */
db.on("acquire", (connection) => {
	console.log(`Connection ${connection.threadId} acquired`);
});
db.on("release", (connection) => {
	console.log(`Connection ${connection.threadId} released`);
});
db.on("enqueue", () => {
	console.log("Waiting for available connection slot");
});
db.on("error", (err) => {
	console.error("Database error:", err.code);
	if (err.code === "PROTOCOL_CONNECTION_LOST") {
		console.error("Database connection lost. Consider resetting the pool.");
	}
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
