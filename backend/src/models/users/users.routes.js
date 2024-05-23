const Route = require("./../../context/route/Route");
const SocketRoute = require("../../context/route/SocketRoute");

module.exports = function (app, io, usersController) {
	// ==================================== Rotas Publicas ==================================== //
	app.post(
		"/users/register",
		Route.newRoute({ secure: false }, usersController.register, usersController)
	);
	app.post(
		"/users/login",
		Route.newRoute({ secure: false }, usersController.login, usersController)
	);

	// ==================================== Rotas Seguras ==================================== //
	app.post(
		"/users/logout",
		Route.newRoute(
			{ secure: true },
			usersController.logoutAuthenticated,
			usersController,
			["userId"],
			usersController.Service.sessionValidator
		)
	);

	app.put(
		"/users/alterSettings",
		Route.newRoute(
			{ secure: true },
			usersController.alterSettingsAuthenticated,
			usersController,
			["userId"],
			usersController.Service.sessionValidator
		)
	);

	// ==================================== Rotas Intermediárias ==================================== //
	// Validação do Email
	app.put(
		"/users/validateEmail",
		Route.newRoute({ secure: false }, usersController.validateEmail, usersController)
	);

	// Reset de Senha
	app.put(
		"/users/requestPasswordReset",
		Route.newRoute({ secure: false }, usersController.requestPasswordReset, usersController)
	);

	/**
	 * @openapi
	 * /:
	 *   get:
	 *     description: Welcome to swagger-jsdoc!
	 *     responses:
	 *       200:
	 *         description: Returns a mysterious string.
	 */
	app.put(
		"/users/resetPassword",
		Route.newRoute({ secure: false }, usersController.resetPassword, usersController)
	);

	// ==================================== Rotas do Socket ==================================== //
	const notificationsIO = io.of("/notifications");

	// Garante que o socket só será acessado por usuários com um token de acesso válido
	SocketRoute.newSecureSocketRoute(notificationsIO, usersController, ["userId"]);

	notificationsIO.on("connection", (socket) => {
		socket.on("notificationRead", (data) => {});
	});
};
