require("dotenv").config();

const http = require("http");
const socket = require("socket.io");

const admin = require("firebase-admin");
admin.initializeApp();

const urls = require("./context/urls");
global.__URLS__ = urls;

const express = require("express");
const bodyParser = require("body-parser");

// Inicializando o express
const app = express();

// Inicializando o servidor HTTP
const server = http.createServer(app);

// Inicializando o socket.io
const io = new socket.Server(server, {
	allowRequest: (request, callback) => {
		const noOriginHeader = request.headers.origin === undefined;
		callback(null, noOriginHeader);
	},

	cors: {
		origin: `http://localhost:${process.env.WEB_PORT}`,
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	},
});

app.use(bodyParser.json());

app.use((_, response, next) => {
	// TODO: Trocar dominio caso o sistema esteja em produção
	response.setHeader("Access-Control-Allow-Origin", `http://localhost:${process.env.WEB_PORT}`);
	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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

// Serviços inicializados
const INSTANTIATED_SERVICES = {};

// Provider de serviços para garantir que os controllers tenham acesso a todos os serviços
const servicesProvider = {
	register(identifier, controller) {
		INSTANTIATED_SERVICES[identifier] = controller.getService();
	},

	get(identifier) {
		return INSTANTIATED_SERVICES[identifier];
	},
};

const usersController = new UsersController(servicesProvider);
const projectsController = new ProjectsController(servicesProvider);

// Registrando os serviços de cada controller
servicesProvider.register("users", usersController);
servicesProvider.register("projects", projectsController);

usersRoutes(app, io, usersController);
projectsRoutes(app, io, projectsController);

const port = process.env.SERVER_PORT || 8080;

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
