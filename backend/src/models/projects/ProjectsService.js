const Service = require("../__types/Service");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsRepository = require("./ProjectsRepository");

const ProjectsInvitationService = require("./relationship/projects-invitations/ProjectsInvitationsService");
const ProjectsMembersService = require("./relationship/projects-members/ProjectsMembersService");
const ProjectsChatsService = require("./relationship/projects-chats/ProjectsChatsService");
const ProjectsPhasesService = require("./relationship/projects-phases/ProjectsPhasesService");

const PhasesService = require("../phases/PhasesService");
const CardsService = require("../cards/CardsService");

class ProjectsService extends Service {
	ProjectsRepository;

	ProjectsInvitationService;
	ProjectsMembersService;
	ProjectsChatsService;
	ProjectsPhasesService;

	PhasesService;
	CardsService;

	constructor() {
		super();
		this.ProjectsRepository = new ProjectsRepository(this);

		this.ProjectsInvitationService = new ProjectsInvitationService(this);
		this.ProjectsMembersService = new ProjectsMembersService(this);
		this.ProjectsChatsService = new ProjectsChatsService(this);
		this.ProjectsPhasesService = new ProjectsPhasesService(this);

		this.PhasesService = new PhasesService(this);
		this.CardsService = new CardsService(this);
	}

	// ==================================== Métodos Seguros ==================================== //
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
		return await this.ProjectsRepository.createProject(new ProjectsDTO({ createdBy, projectName }));
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

	async participate(userId, projectId) {}
}

module.exports = ProjectsService;
