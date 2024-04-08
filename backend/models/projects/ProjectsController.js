class ProjectsController {
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
}

module.exports = ProjectsController;
