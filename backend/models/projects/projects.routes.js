const SocketRoute = require("../../context/route/SocketRoute");
const Route = require("./../../context/route/Route");

module.exports = function (app, io, projectsController) {
	// ==================================== Rotas Publicas ==================================== //
	// ==================================== Rotas Seguras ==================================== //
	app.post(
		"/projects/createProject",
		Route.newRoute(
			{ secure: true },
			projectsController.createProjectAuthenticated,
			projectsController,
			["userId"]
		)
	);
	app.delete(
		"/projects/deleteProject/:projectId",
		Route.newRoute(
			{ secure: true },
			projectsController.deleteProjectAuthenticated,
			projectsController,
			["userId"]
		)
	);

	app.post(
		"/projects/participate",
		Route.newRoute(
			{ secure: true },
			projectsController.participateAuthenticated,
			projectsController,
			["userId"]
		)
	);

	app.post(
		"/projects/inviteMember",
		Route.newRoute(
			{ secure: true },
			projectsController.inviteMemberAuthenticated,
			projectsController,
			["userId"]
		)
	);
	// ==================================== Rotas Intermediárias ==================================== //
	app.put(
		"/projects/validateInvite",
		Route.newRoute({ secure: false }, projectsController.validateInvite, projectsController)
	);

	// ==================================== Rotas do Socket ==================================== //
	const projectsIO = io.of("/projects");

	// Garante que o socket só será acessado por usuários com um token de acesso válido
	SocketRoute.newSecureSocketRoute(projectsIO, projectsController, ["userId", "projectId"]);

	projectsIO.on("connection", (socket) => {
		socket.on("subscribeToProject", (data) =>
			projectsController.IOSubscribeToProject(projectsIO, socket, data)
		);
		socket.on("unsubscribeFromProject", (data) =>
			projectsController.IOUnsubscribeFromProject(projectsIO, socket, data)
		);

		// Rotas de manipulação de cards
		socket.on("createCard", (data) =>
			projectsController.IOCreateCard(projectsIO, socket, data)
		);
		socket.on("deleteCard", (data) =>
			projectsController.IODeleteCard(projectsIO, socket, data)
		);
		socket.on("updateCard", (data) =>
			projectsController.IOUpdateCard(projectsIO, socket, data)
		);

		// Rotas de manipulação de fases
		socket.on("createPhase", (data) =>
			projectsController.IOCreatePhase(projectsIO, socket, data)
		);
		socket.on("deletePhase", (data) =>
			projectsController.IODeletePhase(projectsIO, socket, data)
		);
		socket.on("updatePhase", (data) =>
			projectsController.IOUpdatePhase(projectsIO, socket, data)
		);
	});
};
