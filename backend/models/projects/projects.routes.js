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
	projectsIO.use(
		SocketRoute.newSecureSocketRoute(projectsIO, projectsController, ["userId", "projectId"])
	);

	projectsIO.on("connection", (socket) => {
		socket.on("subscribeToProject", (data) =>
			projectsController.IOSubscribeToProject(socket, data)
		);
		socket.on("unsubscribeFromProject", (data) =>
			projectsController.IOUnsubscribeFromProject(socket, data)
		);

		socket.on("createCard", (data) => projectsController.IOCreateCard(socket, data));
		socket.on("deleteCard", (data) => projectsController.IODeleteCard(socket, data));
		socket.on("updateCard", (data) => projectsController.IOUpdateCard(socket, data));

		socket.on("createPhase", (data) => projectsController.IOCreatePhase(socket, data));
		socket.on("deletePhase", (data) => projectsController.IODeletePhase(socket, data));
		socket.on("updatePhase", (data) => projectsController.IOUpdatePhase(socket, data));
	});
};
