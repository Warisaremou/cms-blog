import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "BlogHunter API documentation",
			version: "0.1.0",
			description: "Cms Blog API documentation made with Express and documented with Swagger",
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
