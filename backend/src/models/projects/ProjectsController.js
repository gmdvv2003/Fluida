const Controller = require("../__types/Controller");

const ProjectInvitationComponent = require("./components/ProjectInvitationComponent");

const ProjectsService = require("./ProjectsService");

const ProjectsFunctionalityInterface = require("./functionalities/projects/ProjectsFunctionalityInterface");

class ProjectsController extends Controller {
	#ProjectInvitationComponent;
	ProjectsFunctionalityInterface;

	constructor(servicesProvider) {
		// Inicializa o controller e o serviço
		super(new ProjectsService(), servicesProvider);
		this.getService().setController(this);

		// Inicializa os componentes do controller
		this.#ProjectInvitationComponent = new ProjectInvitationComponent(this);

		// Inicializa as funcionalidades do controller
		this.ProjectsFunctionalityInterface = new ProjectsFunctionalityInterface(this);
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

		// Verifica se o usuário está no projeto
		const isInProject = this.ProjectMembersService.isUserMemberOfProject(userId, projectId);
		if (!isInProject) {
			return response.status(400).json({ message: "Usuário não está no projeto." });
		}

		// Tenta adicionar o usuário ao projeto e obtem o token de participação
		const [wasAdded, participationToken] = this.ProjectsFunctionalityInterface.addParticipant(userId, projectId);
		if (!wasAdded) {
			return response.status(400).json({ message: "Erro ao adicionar usuário ao projeto." });
		}

		response.json(202).json({
			message: "Participação para o projeto preparada com sucesso.",
			wasAdded: true,
			participationToken: participationToken,
		});
	}

	/**
	 * Realiza o enviou de um convite de email para participação de um projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async inviteMemberAuthenticated(request, response) {
		const { userIdToInvite, projectId } = request.body;
		if (!userToInvite || !projectId) {
			return response.status(400).json({ message: "Usuário ou projeto não informado." });
		}

		const result = this.#ProjectInvitationComponent.sendProjectEmailInvitation(userIdToInvite, projectId);

		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(201).json({ message: "Convite enviado com sucesso.", successfullyInvited: true });
	}

	// ==================================== Métodos Intermediários ==================================== //
	/**
	 * Valida um convite de email para participação de um projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	validateInvite(request, response) {
		const { token } = request.body;
		if (!token) {
			return response.status(400).json({ message: "Token não informado." });
		}

		try {
			const success = this.#ProjectInvitationComponent.validateEmailInvitation(token);
			if (!success) {
				return response.status(400).json({ message: "Token inválido." });
			}

			response.status(200).json({ message: "Token validado com sucesso." });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao validar convite. Erro: ${error}` });
		}
	}
}

module.exports = ProjectsController;