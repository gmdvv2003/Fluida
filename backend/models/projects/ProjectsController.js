const Controller = require("../__types/Controller");

const ProjectsService = require("./ProjectsService");

class ProjectsController extends Controller {
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
		const { createdBy, projectName } = request.body;
		
		const result = this.getService().createProject(createdBy, projectName);

		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(201).json({ message: "Projeto cadastrado com sucesso.", successfullyRegistered: true });
	}

	deleteProjectAuthenticated(request, response) {
		console.log("deleteProject");
	}

	participateAuthenticated(request, response) {
		const { userId, projectId } = request.body;
	}
}

module.exports = ProjectsController;
