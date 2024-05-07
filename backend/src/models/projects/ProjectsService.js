const Service = require("../__types/Service");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsRepository = require("./ProjectsRepository");

const ProjectsInvitationService = require("./relationship/projects-invitations/ProjectsInvitationsService");
const ProjectsMembersService = require("./relationship/projects-members/ProjectsMembersService");
const ProjectsChatsService = require("./relationship/projects-chats/ProjectsChatsService");
const ProjectsPhasesService = require("./relationship/projects-phases/ProjectsPhasesService");

const { UpdateResult } = require("typeorm");

class ProjectsService extends Service {
	ProjectsRepository;

	ProjectsInvitationService;
	ProjectsMembersService;
	ProjectsChatsService;
	ProjectsPhasesService;

	constructor() {
		super();
		this.ProjectsRepository = new ProjectsRepository(this);

		// Inicializa os serviços de relacionamento
		this.ProjectsInvitationService = new ProjectsInvitationService();
		this.ProjectsMembersService = new ProjectsMembersService();
		this.ProjectsChatsService = new ProjectsChatsService();
		this.ProjectsPhasesService = new ProjectsPhasesService();

		// Define o serviço pai
		this.ProjectsInvitationService.setService(this);
		this.ProjectsMembersService.setService(this);
		this.ProjectsChatsService.setService(this);
		this.ProjectsPhasesService.setService(this);
	}

	// ==================================== Métodos Seguros ==================================== //
	/**
	 * Retorna o total de fases em um projeto.
	 *
	 * @param {number} projectId
	 * @returns {number}
	 */
	async getTotalPhasesInProject(projectId) {
		return await this.ProjectsRepository.getTotalPhasesInProject(projectId);
	}

	/**
	 * Retorna um projeto pelo id.
	 *
	 * @param {string} projectId
	 * @returns {ProjectChatsDTO}
	 */
	async getProjectById(projectId) {
		return await this.ProjectsRepository.getProjectById(projectId);
	}

	/**
	 * Realiza a criação de um projeto.
	 *
	 * @param {number} createdBy
	 * @param {string} projectName
	 * @returns {ProjectsDTO}
	 */
	async createProject(createdBy, projectName) {
		return await this.ProjectsRepository.createProject(
			new ProjectsDTO({ createdBy, projectName })
		);
	}

	/**
	 * Realiza a exclusão de um projeto.
	 *
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	async deleteProject(projectId) {
		return await this.ProjectsRepository.deleteProject(new ProjectsDTO({ projectId }));
	}

	/**
	 * Incrementa o total de fases em um projeto.
	 *
	 * @param {number} projectId
	 * @returns {UpdateResult}
	 */
	async incrementTotalPhasesInProject(projectId) {
		return await this.ProjectsRepository.incrementTotalPhasesInProject(projectId);
	}
}

module.exports = ProjectsService;
