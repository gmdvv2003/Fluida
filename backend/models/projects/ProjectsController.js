const Controller = require("../__types/Controller");

const ProjectsService = require("./ProjectsService");
const { Project } = require("./functionalities/project/Project");

class ProjectsController extends Controller {
	constructor(servicesProvider) {
		// Inicializa o controller e o serviço
		super(new ProjectsService(), servicesProvider);
		this.getService().setController(this);

		// Inicializa as funcionalidades do controller
		new Project(this);
	}

	// ==================================== Métodos Seguros ==================================== //
	/**
	 * Realiza a criação de um novo projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async createProjectAuthenticated(request, response) {
		const { userId, projectName } = request.body;
		if (!userId || !projectName) {
			return response.status(400).json({ message: "Usuário ou nome do projeto não informado." });
		}

		const result = this.getService().createProjectAuthenticated(userId, projectName);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(201).json({ message: "Projeto criado com sucesso.", successfullyCreated: true });
	}

	async deleteProjectAuthenticated(request, response) {
		console.log("deleteProject");
	}

	/**
	 * Prepara a participação de um usuário em um projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async participateAuthenticated(request, response) {
		const { userId, projectId } = request.body;
		if (!userId || !projectId) {
			return response.status(400).json({ message: "Usuário ou projeto não informado." });
		}

		const isInProject = this.getService("users").isUserInProject(userId, projectId);
		if (!isInProject) {
			return response.status(400).json({ message: "Usuário não está no projeto." });
		}
	}

	async inviteMemberAuthenticated(request, response) {}

	// ==================================== Métodos Intermediários ==================================== //
	validateInvite(request, response) {}
}

module.exports = ProjectsController;
