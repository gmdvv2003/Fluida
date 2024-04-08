const Route = require("./../../context/route/Route");

module.exports = function (app, usersController) {
	// ==================================== Rotas Publicas ==================================== //
	// (Teste)
	app.get("/users", Route.newRoute({ secure: false }, usersController.getUsers, usersController));
	app.get("/users/:userId", Route.newRoute({ secure: false }, usersController.getUserById, usersController));

	app.post("/users/register", Route.newRoute({ secure: false }, usersController.register, usersController));
	app.post("/users/login", Route.newRoute({ secure: false }, usersController.login, usersController));

	// ==================================== Rotas Seguras ==================================== //
	app.post("/users/logout", Route.newRoute({ secure: true }, usersController.logoutAuthenticated, usersController));
	app.put("/users/test", Route.newRoute({ secure: true }, usersController.testAuthenticaded, usersController));

	// ==================================== Rotas Intermediárias ==================================== //
	// Validação do Email
	app.put("/users/validateEmail", Route.newRoute({ secure: false }, usersController.validateEmail, usersController));

	// Reset de Senha
	app.put("/users/requestPasswordReset", Route.newRoute({ secure: false }, usersController.requestPasswordReset, usersController));
	app.put("/users/resetPassword", Route.newRoute({ secure: false }, usersController.resetPassword, usersController));
};
