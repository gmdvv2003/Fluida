const Route = require("./../../context/route/Route");

module.exports = function (app, projectsController) {
	// ==================================== Rotas Publicas ==================================== //
	// ==================================== Rotas Seguras ==================================== //
	// (Teste)
	// app.get("/projects", Route.newRoute({ secure: true }, projectsController.getProjects, projectsController));
	// app.get("/projects/:projectId", Route.newRoute({ secure: true }, projectsController.getProjectById, projectsController));
	// app.post("/createProject", Route.newRoute({ secure: true }, projectsController.createProjectAuthenticated, projectsController));
	// app.delete("/deleteProject/:projectId", Route.newRoute({ secure: true }, projectsController.deleteProjectAuthenticated, projectsController));
	// ==================================== Rotas Intermediárias ==================================== //
};
