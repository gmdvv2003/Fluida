const Service = require("../__types/Service");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsRepository = require("./ProjectsRepository");

const ProjectsMembersService = require("./relationship/projects-members/ProjectsMembersService");
const ProjectsChatsService = require("./relationship/projects-chats/ProjectsChatsService");
const ProjectsPhasesService = require("./relationship/projects-phases/ProjectsPhasesService");

const { UpdateResult } = require("typeorm");
const PhasesDTO = require("../phases/PhasesDTO");

class ProjectsService extends Service {
	ProjectsRepository;

	ProjectsMembersService;
	ProjectsChatsService;
	ProjectsPhasesService;

	constructor() {
		super();
		this.ProjectsRepository = new ProjectsRepository(this);

		// Inicializa os serviços de relacionamento
		this.ProjectsMembersService = new ProjectsMembersService();
		this.ProjectsChatsService = new ProjectsChatsService();
		this.ProjectsPhasesService = new ProjectsPhasesService();

		// Define o serviço pai
		this.ProjectsMembersService.setService(this);
		this.ProjectsChatsService.setService(this);
		this.ProjectsPhasesService.setService(this);
	}

	// ==================================== Métodos Públicos ==================================== //
	/**
	 * Retorna os projetos do usuário logado
	 *
	 * @param {number} userId
	 * @returns {ProjectsDTO}
	 */
	async getProjectsOfUser(userId) {
		return await this.ProjectsRepository.getProjectsOfUser(userId);
	}

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

	// ==================================== Métodos Seguros ==================================== //
	/**
	 * Realiza a criação de um projeto.
	 *
	 * @param {number} createdBy
	 * @param {string} projectName
	 * @returns {ProjectsDTO}
	 */
	async createProject(createdBy, projectName) {
		/**
		 * Checa a existência de projeto com o mesmo nome
		 */
		const existingProject = await this.ProjectsRepository.getProjectByName(createdBy, projectName);

		if (existingProject) {
			return {
				status: 400,
				body: { message: "Projeto já existe com esse nome" },
			};
		}

		let newProject;

		try {
			// Cria um novo projeto e armazena o objeto retornado em newProject
			const newProject = await this.ProjectsRepository.createProject(new ProjectsDTO({ createdBy, projectName }));

			const projectId = newProject.identifiers[0].projectId;

			const phaseNames = ["Caixa de entrada", "Em progresso", "Em teste", "Concluído"];

			// Loop para criar cada fase
			for (const phaseName of phaseNames) {
				await this.Controller.PhasesService.createPhase(
					new PhasesDTO({
						projectId: projectId,
						phaseName: phaseName,
					})
				);
			}
		} catch (error) {
			console.error("Erro ao criar o projeto: ", error);
			return {
				status: 500,
				body: { message: "Erro ao criar o projeto" },
			};
		}

		return {
			status: 201,
			body: {
				message: "Projeto cadastrado com sucesso",
				projectName: projectName,
			},
			project: newProject,
		};
	}

	/**
	 * Realiza a exclusão de um projeto.
	 *
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	async updateProject(projectId, projectData) {
		return await this.ProjectsRepository.updateProject(projectId, projectData);
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

	/**
	 * 
	 * @param {*} projectId 
	 * @returns 
	 */
	async decrementTotalPhasesInProject(projectId) {
		return await this.ProjectsRepository.decrementTotalPhasesInProject(projectId);
	}
}

module.exports = ProjectsService;
