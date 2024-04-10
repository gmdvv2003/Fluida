const ProjectsService = require("./ProjectsService");

class ProjectsController {
	constructor() {
		super(new ProjectsService());
	}

	// ==================================== Métodos Seguros ==================================== //
	getProjectsAuthenticated(request, response) {
		console.log("getProjects");
	}

	getProjectByIdAuthenticated(request, response) {
		console.log("getProjectById");
	}

	createProjectAuthenticated(request, response) {
		console.log("createProject");
	}

	deleteProjectAuthenticated(request, response) {
		console.log("deleteProject");
	}

	participateAuthenticated(request, response) {
		const { userId, projectId } = request.body;
	}
}

module.exports = ProjectsController;
