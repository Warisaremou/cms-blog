import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "BlogHunter API documentation",
			version: "0.1.0",
			description: "Cms Blog API documentation made with Express and documented with Swagger",
			// license: {
			// 	name: "MIT",
			// 	url: "https://spdx.org/licenses/MIT.html",
			// },
			// contact: {
			// 	name: "LogRocket",
			// 	url: "https://logrocket.com",
			// 	email: "info@email.com",
			// },
		},
		servers: [
			{
				url: "http://localhost:3001",
			},
		],
	},
	apis: ["../routes/*.js"],
};

const swaggerDocument = swaggerJsdoc(swaggerOptions);

export { swaggerDocument };
