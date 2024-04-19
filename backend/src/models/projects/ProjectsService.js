const { v4 } = require("uuid");

const Service = require("../__types/Service");

const ProjectsEntity = require("./ProjectsEntity");
const ProjectsRepository = require("./ProjectsRepository");

const ProjectInvitationService = require("./relationship/project-invitations/ProjectInvitationsService");
const ProjectMembersService = require("./relationship/project-members/ProjectMembersService");
const ProjectChatsService = require("./relationship/project-chats/ProjectChatsService");

class ProjectsService extends Service {
	#ProjectsRepository;

	ProjectInvitationInterface;
	ProjectMembersService;
	ProjectChatsInterface;

	constructor() {
		super();

		this.ProjectInvitationService = new ProjectInvitationService(this);
		this.ProjectMembersService = new ProjectMembersService(this);
		this.ProjectChatsService = new ProjectChatsService(this);

		this.#ProjectsRepository = new ProjectsRepository(this);
	}

	// ==================================== Métodos Privados ==================================== //
	// ==================================== Métodos Abertos ==================================== //
	// ==================================== Métodos Seguros ==================================== //
	/**
	 * Criação de um novo projeto.
	 *
	 * @param {number} createdBy
	 * @param {string} projectName
	 * @returns Criação de um novo projeto para o usuário.
	 */
	createProjectAuthenticated(createdBy, projectName) {
		try {
			const project = new ProjectsEntity(v4(), createdBy, projectName);
			projects.push(project);
			return { success: true, project: project };
		} catch (error) {
			return { success: false, message: error.message };
		}
	}

	deleteProjectAuthenticated(userId, projectId) {}

	participateAuthenticated(userId, projectId) {}
}

module.exports = ProjectsService;
