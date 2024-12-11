import { db } from "../../config/database.js";

export async function initDatabase() {
	try {
		// -------- Drop all tables in the database first -------- //
		await db.query(`DROP TABLE IF EXISTS comments`);
		await db.query(`DROP TABLE IF EXISTS post_category`);
		await db.query(`DROP TABLE IF EXISTS posts`);
		await db.query(`DROP TABLE IF EXISTS users`);
		await db.query(`DROP TABLE IF EXISTS categories`);
		await db.query(`DROP TABLE IF EXISTS roles`);
		console.log("✅ Database tables dropped ✅");

		// -------- Initialize roles table -------- //
		await db.query(
			`CREATE TABLE roles (id_role INT AUTO_INCREMENT NOT NULL UNIQUE, name VARCHAR(100) NOT NULL UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL, PRIMARY KEY (id_role))`
		);

		// -------- Initialize users table -------- //
		await db.query(
			`CREATE TABLE users (id_user INT AUTO_INCREMENT NOT NULL UNIQUE, username VARCHAR(100) NOT NULL UNIQUE, surname VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(250) NOT NULL, address VARCHAR(100), avatar TEXT, date_of_birth DATE, description TEXT, hash VARCHAR(250) UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL, PRIMARY KEY (id_user), id_role INT NOT NULL DEFAULT 2, FOREIGN KEY (id_role) REFERENCES roles(id_role) ON DELETE CASCADE)`
		);

		// -------- Initialize categories table -------- //
		await db.query(
			`CREATE TABLE categories (id_category INT AUTO_INCREMENT NOT NULL UNIQUE, name VARCHAR(100) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL, PRIMARY KEY (id_category))`
		);

		// -------- Initialize posts table -------- //
		await db.query(
			`CREATE TABLE posts (id_post INT AUTO_INCREMENT NOT NULL UNIQUE, title VARCHAR(100) NOT NULL, image TEXT , content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL, PRIMARY KEY (id_post), id_user INT NOT NULL, FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE)`
		);

		// -------- Initialize post_category table -------- //
		await db.query(
			`CREATE TABLE post_category (id_category INT NOT NULL, FOREIGN KEY (id_category) REFERENCES categories(id_category) ON DELETE CASCADE, id_post INT NOT NULL, FOREIGN KEY (id_post) REFERENCES posts(id_post) ON DELETE CASCADE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
		);

		// -------- Initialize comments table -------- //
		await db.query(
			`CREATE TABLE comments (id_comment INT AUTO_INCREMENT NOT NULL UNIQUE, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, deleted_at DATETIME DEFAULT NULL, PRIMARY KEY (id_comment), id_user INT NOT NULL, FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE, id_post INT NOT NULL, FOREIGN KEY (id_post) REFERENCES posts(id_post) ON DELETE CASCADE)`
		);

		console.log("✅ Database migrated successfully ✅");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error while migrating database", error);
		process.exit(1);
	}
}

initDatabase();
