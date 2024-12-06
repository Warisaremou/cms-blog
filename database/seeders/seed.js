import { db } from "../../config/database.js";

async function seedDatabase() {
	try {
		// -------- Create admin role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('admin')`);
		// -------- Create user role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('user')`);
		// -------- Create moderator role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('moderator')`);

		console.log("✅ Database seeded successfully ✅");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error while seeding database", error);
		process.exit(1);
	}
}

seedDatabase();
