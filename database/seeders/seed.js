import { db } from "../../config/database.js";
import bcrypt from "bcrypt";

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

		// -------- Create an admin user -------- //
		const hashedPassword = await bcrypt.hash("@AdminPassword1234", 10);
		await db.execute(
			`INSERT INTO users(username, surname, firstname, email, password, id_role) VALUES ('admin01','User','Admin','adminuser@example.com','${hashedPassword}', 1)`
		);

		// -------- Create user -------- //
		const userHashedPassword = await bcrypt.hash("@User1234", 10);
		await db.execute(
			`INSERT INTO users(username, surname, firstname, email, password, avatar ,id_role) VALUES ('Nelson12','Nelson','MANDELA','nelson@gmail.com','${userHashedPassword}','https://img.freepik.com/vecteurs-libre/jeune-prince-tenue-royale_1308-176144.jpgt=st=1733740941~exp=1733744541~hmac=12f72461b777d275eef326d781be2624188f5a5b878ffd451426d92c62254e40&w=740',2)`
		);

		// ---------Create Posts---------//
		await db.execute(
			`INSERT INTO posts( title, image, content, id_user) VALUES ('Bienvenus à vous','https://img.freepik.com/photos-premium/modele-conception-post-medias-sociaux-du-restaurant_1029473-146673.jpg?w=740','Plongez dans une expérience culinaire unique où saveurs et convivialité se rencontrent. Que vous soyez amateur de plats traditionnels ou curieux de découvrir des créations originales, notre chef met tout son savoir-faire dans chaque assiette.', 2)`
		);

		console.log("✅ Database seeded successfully ✅");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error while seeding database", error);
		process.exit(1);
	}
}

seedDatabase();
