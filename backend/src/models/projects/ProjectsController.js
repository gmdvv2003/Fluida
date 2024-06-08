const Controller = require("../__types/Controller");

const ProjectInvitationComponent = require("./components/ProjectInvitationComponent");

const ProjectsService = require("./ProjectsService");

const PhasesService = require("../phases/PhasesService");
const CardsService = require("../cards/CardsService");

const {
	ProjectsFunctionalityInterface,
} = require("./functionalities/projects/ProjectsFunctionalityInterface");

class ProjectsController extends Controller {
	#ProjectInvitationComponent;
	ProjectsFunctionalityInterface;

	PhasesService;
	CardsService;

	constructor(servicesProvider) {
		// Inicializa o controller e o serviço
		super(new ProjectsService(), servicesProvider);
		this.Service.setController(this);

		this.PhasesService = new PhasesService(this);
		this.CardsService = new CardsService(this);

		this.PhasesService.setController(this);
		this.CardsService.setController(this);

		// Inicializa os componentes do controller
		this.#ProjectInvitationComponent = new ProjectInvitationComponent(this);

		// Inicializa as funcionalidades do controller
		this.ProjectsFunctionalityInterface = new ProjectsFunctionalityInterface(this);
	}

	// ==================================== Métodos Seguros ==================================== //

	/**
	 * Retorna os projetos do usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async getProjectsOfUserAuthenticated(request, response) {
		const { userId } = request.body;
		if (!userId) {
			return response.status(400).json({ message: "ID de usuário não informado" });
		}

		try {
			const projects = await this.Service.getProjectsOfUser(userId);

			if (!projects || projects.length === 0) {
				return response
					.status(404)
					.json({ message: "Nenhum projeto encontrado para este usuário" });
			}

			return response.status(200).json(projects);
		} catch (error) {
			console.error("Erro ao buscar projetos do usuário:", error);
			return response.status(500).json({ message: "Erro ao buscar projetos do usuário" });
		}
	}

	/**
	 * Realiza a criação de um novo projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async createProjectAuthenticated(request, response) {
		const { userId, projectName } = request.body;
		if (!userId || !projectName) {
			return response
				.status(400)
				.json({ message: "Usuário ou nome do projeto não informado." });
		}

		try {
			const result = await this.Service.createProject(userId, projectName);
			return response.status(result.status).json(result.body);
		} catch (error) {
			return response.status(500).json({ message: "Ocorreu um erro ao criar o projeto." });
		}
	}

	/**
	 * Faz a atualização do nome do projeto pelo ID
	 *
	 * @param {Request} request
	 * @param {Reponse} response
	 */
	async updateProjectAuthenticated(request, response) {
		const { projectId } = request.params;
		const projectData = request.body;

		if (!projectId) {
			return response.status(400).json({ message: "ID de projeto não informado." });
		}

		const projectExist = await this.Service.getProjectById(projectId);
		if (!projectExist) {
			return response.status(400).json({ message: "Não existe projeto para esse ID." });
		}

		(await this.Service.updateProject(projectId, projectData))
			? response.status(200).json({ message: "Projeto atualizado com sucesso" })
			: response.status(400).json({ error, message: "Erro ao atualizar o projeto" });
	}

	/**
	 * Faz a exclusão do projeto pelo ID
	 *
	 * @param {Request} request
	 * @param {Reponse} response
	 */
	async deleteProjectAuthenticated(request, response) {
		const { projectId } = request.params;
		if (!projectId) {
			return response.status(400).json({ message: "ID de projeto não informado." });
		}

		const projectExist = await this.Service.getProjectById(projectId);
		if (!projectExist) {
			return response.status(400).json({ message: "Não existe projeto para esse ID." });
		}

		(await this.Service.deleteProject(projectId))
			? response.status(200).json({ message: "Projeto deletado com sucesso" })
			: response.status(400).json({ message: "Erro ao deletar o projeto" });
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

		const project = await this.Service.getProjectById(projectId);
		if (!project) {
			return response.status(400).json({ message: "Projeto não encontrado." });
		}

		// Verifica se o usuário está no projeto
		const isInProject = await this.Service.ProjectsMembersService.isUserMemberOfProject(
			userId,
			projectId
		);
		if (!isInProject) {
			return response.status(400).json({ message: "Usuário não está no projeto." });
		}

		// Tenta adicionar o usuário ao projeto e obtem o token de participação
		const [wasAdded, participationToken] = this.ProjectsFunctionalityInterface.addParticipant(
			userId,
			projectId
		);
		if (!wasAdded) {
			return response.status(400).json({ message: "Erro ao adicionar usuário ao projeto." });
		}

		response.status(202).json({
			message: "Participação para o projeto preparada com sucesso.",
			wasAdded: true,
			participationToken: participationToken,
			projectName: project.projectName,
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

		const result = this.#ProjectInvitationComponent.sendProjectEmailInvitation(
			userIdToInvite,
			projectId
		);

		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response
			.status(201)
			.json({ message: "Convite enviado com sucesso.", successfullyInvited: true });
	}

	/**
	 * Cria um link de convite para participação em um projeto público
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async createPublicProjectInvitationLinkAuthenticated(request, response) {
		const { projectId } = request.body;
		if (!projectId) {
			return response.status(400).json({ message: "Projeto não informado." });
		}

		const invitationLink =
			this.#ProjectInvitationComponent.createProjectInvitationLink(projectId);
		if (!invitationLink) {
			return response.status(400).json({ message: "Erro ao criar link de convite." });
		}

		return response.status(200).json({ invitationLink: invitationLink });
	}

	/**
	 * Valida um convite (privado e público) para participação de um projeto
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	validateInviteAuthenticated(request, response) {
		const { userId, invitation } = request.body;
		if (!invitation) {
			return response.status(400).json({ message: "Convite não informado." });
		}

		try {
			const success = this.#ProjectInvitationComponent.validateEmailInvitation(
				userId,
				invitation
			);
			if (!success) {
				return response.status(400).json({ message: "Convite inválido." });
			}

			response
				.status(200)
				.json({ message: "Convite validado com sucesso.", inviteValidated: true });
		} catch (error) {
			return response
				.status(400)
				.json({ message: `Falha ao validar convite. Erro: ${error}` });
		}
	}
}

module.exports = ProjectsController;
