const SocketRoute = require("../../context/route/SocketRoute");
const Route = require("../../context/route/Route");

module.exports = function (app, io, projectsController) {
	// ==================================== Rotas Publicas ==================================== //
	// ==================================== Rotas Seguras ==================================== //
	app.post(
		"/projects/createProject",
		Route.newRoute(
			{ secure: true },
			projectsController.createProjectAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);
	app.delete(
		"/projects/deleteProject/:projectId",
		Route.newRoute(
			{ secure: true },
			projectsController.deleteProjectAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	app.post(
		"/projects/participate",
		Route.newRoute(
			{ secure: true },
			projectsController.participateAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
		)
	);

	app.post(
		"/projects/inviteMember",
		Route.newRoute(
			{ secure: true },
			projectsController.inviteMemberAuthenticated,
			projectsController,
			["userId"],
			projectsController.getService("users").sessionValidator
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
		// Função utilitária para linkar os métodos do controller com os eventos do socket
		function linkToMethod(method) {
			return (data) => projectsController[method](projectsIO, socket, data);
		}

		socket.on("subscribeToProject", linkToMethod("subscribeToProject"));
		socket.on("unsubscribeFromProject", linkToMethod("unsubscribeFromProject"));

		// Rotas de manipulação de cards
		socket.on("createCard", linkToMethod("createCard"));
		socket.on("deleteCard", linkToMethod("deleteCard"));
		socket.on("updateCard", linkToMethod("updateCard"));
		socket.on("moveCard", linkToMethod("moveCard"));

		// Rotas de manipulação de fases
		socket.on("createPhase", linkToMethod("createPhase"));
		socket.on("deletePhase", linkToMethod("deletePhase"));
		socket.on("updatePhase", linkToMethod("updatePhase"));
		socket.on("movePhase", linkToMethod("movePhase"));

		// Rotas do chat
		socket.on("sendMessage", linkToMethod("sendMessage"));
		socket.on("deleteMessage", linkToMethod("deleteMessage"));
		socket.on("editMessage", linkToMethod("editMessage"));
	});
};
