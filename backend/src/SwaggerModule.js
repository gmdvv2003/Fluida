const swaggerJSDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API documentation endpoints for FLuida",
			version: "1.0.0",
			description: "API documentation for your Node.js application Fluida",
		},
	},
	apis: ["./models/users/users.routes.js"], // Path to the API routes
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
