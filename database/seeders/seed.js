import { db } from "../../config/database.js";

async function seedDatabase() {
	try {
		// -------- Create admin role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('admin')`);
		// -------- Create user role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('user')`);
		// -------- Create moderator role -------- //
		await db.execute(`INSERT INTO roles(name) VALUES ('moderator')`);
		// -------- Create Categories -------- //
		await db.execute(`INSERT INTO categories (name) VALUES 
			('Actualités et Tendances'),
			('Culture et divertissement'),
			('Technologie et innovation'),
			('Voyage et découvertes'),
			('Science et environnement'),
			('Gastronomie et cuisine'),
			('Futur et prospective')
		`);
		

		console.log("✅ Database seeded successfully ✅");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error while seeding database", error);
		process.exit(1);
	}
}

seedDatabase();
