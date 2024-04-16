require("dotenv").config();

const http = require("http");
const cors = require("cors");
const socket = require("socket.io");

const admin = require("firebase-admin");
admin.initializeApp();

const urls = require("./context/urls");
global.__URLS__ = urls;

const express = require("express");
const bodyParser = require("body-parser");

// Origem permitida para o CORS (quando em desenvolvimento, qualquer origem é permitida)
const CORS_ORIGIN = process.env.NODE_ENVIRONMENT == "development" ? "*" : urls.__origin_web.url;

// Inicializando o express
const app = express();

// Inicializando o servidor HTTP
const server = http.createServer(app);

// Inicializando o socket.io
const io = new socket.Server(server, {
	cors: {
		origin: CORS_ORIGIN,
	},
});

// Middleware que transforma o body da requisição em JSON
app.use(bodyParser.json());

// Middleware que adiciona os headers de CORS
app.use((request, response, next) => {
	response.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);

	response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

	response.setHeader("Access-Control-Allow-Credentials", "true");

	if (request.method === "OPTIONS") {
		return response.status(200).end();
	}

	next();
});

// Caso HTTP_WATCHER seja 1, loga as requisições e respostas
if (process.env.HTTP_WATCHER == 1) {
	// Middleware para logar as requisições
	app.use((request, _, next) => {
		console.log(
			`Requisição: [${request.method}] ${request.url}, Body: ${JSON.stringify(request.body)}`
		);

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

// Caso SOCKET_WATCHER seja 1, loga os eventos do socket
if (process.env.SOCKET_WATCHER == 1) {
	// Middleware para logar os eventos do socket
	io.use((socket, next) => {
		socket.onAny((event, ...arguments) => {
			console.log(
				`
				Evento: ${event},
				Auth: ${socket.handshake?.auth},
				Header: ${socket.handshake?.headers},
				Argumentos: ${JSON.stringify(arguments)}
				`
			);
		});

		socket.on("connection", () => console.log(`${socket} Conectado`));
		socket.on("disconnect", () => console.log(`${socket} Desconectado`));

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

server.listen(port, () => {
	console.log(`Servidor rodando em ${urls.__origin_server.url}`);
});
