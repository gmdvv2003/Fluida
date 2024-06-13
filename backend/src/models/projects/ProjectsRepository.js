const Repository = require("../__types/Repository");

const ProjectsDTO = require("./ProjectsDTO");
const ProjectsEntity = require("./ProjectsEntity");

const { Subscribe } = require("../../context/decorators/typeorm/subscriber/Subscriber");
const { Validate } = require("../../context/decorators/input-validator/InputValidator");

const { InsertResult, DeleteResult } = require("typeorm");

class ProjectsRepository extends Repository {
	// ==================================== Triggers ==================================== //
	/**
	 * Trigger que adiciona o criador do projeto como membro do projeto.
	 */
	async afterInsert_addProjectManagerAsMember({ entity }) {
		await this.Service.ProjectsMembersService.addUserAsMemberOfProject(entity.createdBy, entity.projectId);
	}

	constructor(service) {
		super(service, ProjectsDTO);
		Subscribe(ProjectsDTO, this);
	}

	/**
	 * Retorna o total de fases em um projeto do banco de dados.
	 *
	 * @param {number} projectId
	 * @returns {number}
	 */
	async getTotalPhasesInProject(projectId) {
		return await this.Repository.createQueryBuilder("Projects").select("totalPhases").where("projectId = :projectId", { projectId }).getRawOne();
	}

	/**
	 *
	 * @param {*} userId
	 * @returns
	 */
	async getProjectsOfUser(userId) {
		return await this.Repository.createQueryBuilder("Projects").where(`createdBy = ${userId}`).getMany();
	}

	/**
	 * Retorna um projeto pelo id
	 *
	 * @param {number} projectId
	 * @returns {ProjectsDTO}
	 */
	async getProjectById(projectId) {
		return await this.Repository.createQueryBuilder("Projects").where(`projectId = :projectId`, { projectId }).getOne();
	}

	/**
	 *
	 * @param {} projectName
	 * @returns
	 */
	async getProjectByName(createdBy, projectName) {
		return await this.Repository.createQueryBuilder("Projects")
			.where("projectName = :projectName", { projectName })
			.andWhere("createdBy = :createdBy", { createdBy })
			.getOne();
	}

	/**
	 * Insere um projeto no banco de dados.
	 *
	 * @param {ProjectsDTO} projectsDTO
	 * @returns {InsertResult}
	 */
	@Validate({ NAME: "projectName", TYPE: "string", INDEX: 0, LENGTH: 100 })
	async createProject(projectsDTO) {
		return await this.Repository.createQueryBuilder("Projects").insert().into("Projects").values(projectsDTO).execute();
	}

	/**
	 * Faz o update do nome do projeto do banco de dados.
	 *
	 * @param {ProjectsDTO} projectsDTO
	 * @returns {DeleteResult}
	 */
	async updateProject(projectId, projectData) {
		const { projectName } = projectData;
		const updateFields = {};
		if (projectName !== undefined) {
			updateFields.projectName = projectName;
		}

		return await this.Repository.createQueryBuilder("Projects")
			.update(ProjectsEntity)
			.set({ projectName }) // Aqui atualizamos o campo projectName com o valor fornecido
			.where("projectId = :projectId", { projectId })
			.execute();
	}

	/**
	 * Deleta um projeto do banco de dados.
	 *
	 * @param {ProjectsDTO} projectsDTO
	 * @returns {DeleteResult}
	 */
	async deleteProject(projectsDTO) {
		return await this.Repository.createQueryBuilder("Projects").delete().from("Projects").where(`projectId = :projectId`, projectsDTO).execute();
	}

	/**
	 * Incrementa o total de fases em um projeto do banco de dados.
	 *
	 * @param {number} projectId
	 * @returns {UpdateResult}
	 */
	async incrementTotalPhasesInProject(projectId) {
		return await this.Repository.createQueryBuilder("Projects")
			.update(ProjectsEntity)
			.set({ totalPhases: () => "totalPhases + 1" })
			.where("projectId = :projectId", { projectId })
			.execute();
	}

	/**
	 *
	 * @param {*} projectId
	 * @returns
	 */
	async decrementTotalPhasesInProject(projectId) {
		return await this.Repository.createQueryBuilder("Projects")
			.update(ProjectsEntity)
			.set({ totalPhases: () => "GREATEST(totalPhases - 1, 0)" })
			.where("projectId = :projectId", { projectId })
			.execute();
	}
}

module.exports = ProjectsRepository;
