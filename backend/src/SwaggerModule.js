const swaggerJSDoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API documentation endpoints for Fluida",
			version: "2.0.0",
			description: "API documentation for your Node.js application Fluida",
		},
		components: {
			schemas: {
				User: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "ID do usuário",
						},
						name: {
							type: "string",
							description: "Nome do usuário",
						},
						email: {
							type: "string",
							description: "Email do usuário",
						},
						password: {
							type: "string",
							description: "Senha do usuário",
						},
					},
					required: ["id", "name", "email", "password"],
				},
				Project: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "ID do projeto",
						},
						name: {
							type: "string",
							description: "Nome do projeto",
						},
						description: {
							type: "string",
							description: "Descrição do projeto",
						},
						ownerId: {
							type: "string",
							description: "ID do dono do projeto",
						},
					},
					required: ["id", "name", "ownerId"],
				},
				Invite: {
					type: "object",
					properties: {
						inviteId: {
							type: "string",
							description: "ID do convite",
						},
						projectId: {
							type: "string",
							description: "ID do projeto",
						},
						userId: {
							type: "string",
							description: "ID do usuário convidado",
						},
					},
					required: ["inviteId", "projectId", "userId"],
				},
			},
			examples: {
				UserExample: {
					summary: "Exemplo de usuário",
					value: {
						id: "1",
						name: "John Doe",
						email: "johndoe@example.com",
						password: "password123",
					},
				},
				ProjectExample: {
					summary: "Exemplo de projeto",
					value: {
						id: "1",
						name: "Project Alpha",
						description: "Descrição do Project Alpha",
						ownerId: "1",
					},
				},
				InviteExample: {
					summary: "Exemplo de convite",
					value: {
						inviteId: "1",
						projectId: "1",
						userId: "2",
					},
				},
			},
		},
	},
	apis: [
		`${__dirname}\\models\\users\\users.routes.js`,
		`${__dirname}\\models\\projects\\projects.routes.js`,
	], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
