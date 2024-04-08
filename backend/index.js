require("dotenv").config();

const url = require("url");

const admin = require("firebase-admin");
admin.initializeApp();

const urls = require("./context/urls");
global.__URLS__ = urls;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use((_, response, next) => {
	response.setHeader("Access-Control-Allow-Origin", `http://localhost:${process.env.WEB_PORT}`);
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	response.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

// Caso HTTP_WATCHER seja 1, loga as requisições e respostas
if (process.env.HTTP_WATCHER == 1) {
	// Middleware para logar as requisições
	app.use((request, _, next) => {
		console.log(`Requisição: [${request.method}] ${request.url}, Body: ${JSON.stringify(request.body)}`);
		next();
	});

	// Middleware para logar as respostas
	app.use((_, response, next) => {
		const originalSend = response.send;

		response.send = function (body) {
			console.log(`Resposta: ${body}`);
			originalSend.call(this, body);
		};

		next();
	});
}

const UsersController = require("./models/users/UsersController");
const ProjectsController = require("./models/projects/ProjectsController");

// Singletons que inicializam as rotas
const usersRoutes = require("./models/users/users.routes");
const projectsRoutes = require("./models/projects/projects.routes");

const usersController = new UsersController();
const projectsController = new ProjectsController();

usersRoutes(app, usersController);
projectsRoutes(app, projectsController);

const port = process.env.SERVER_PORT || 8080;

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
