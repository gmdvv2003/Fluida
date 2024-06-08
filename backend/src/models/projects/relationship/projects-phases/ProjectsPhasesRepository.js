const { Like, InsertResult, DeleteResult } = require("typeorm");

const Repository = require("../../../__types/Repository");

const ProjectsPhasesDTO = require("./ProjectsPhasesDTO");
const ProjectsPhasesEntity = require("./ProjectsPhasesEntity");

const { Paginate, Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

class ProjectsPhasesRepository extends Repository {
	constructor(service) {
		super(service, ProjectsPhasesDTO);
	}

	/**
	 * Retorna as fases de um projeto do banco de dados.
	 *
	 * @param {number} projectId
	 * @returns {Page}
	 */
	@Paginate({ GROUP_BY: "phaseId" })
	async getPhasesOfProject(projectId) {
		/**
		 * @type {import("typeorm").FindManyOptions<Entity>}
		 */
		const query = {
			// Filtra pelo id do projeto.
			where: { projectId: Like(`%${projectId}%`) },

			// Adiciona a relação com a fase.
			relations: { phase: true },

			// Seleciona apenas os campos necessários.
			// select: { phase: true, log: true },
		};

		return { repository: this.Repository, query: query, pick: "phase" };
	}

	/**
	 * Adiciona uma fase a um projeto do banco de dados.
	 *
	 * @param {ProjectsPhasesDTO} projectsPhases
	 * @returns {InsertResult}
	 */
	async addPhaseToProjectPhases(projectsPhases) {
		return await this.Repository.createQueryBuilder("ProjectsPhases")
			.insert()
			.into(ProjectsPhasesEntity, ["projectId", "phaseId"])
			.values(projectsPhases)
			.orIgnore()
			.execute();
	}

	/**
	 * Remove uma fase de um projeto do banco de dados.
	 *
	 * @param {ProjectsPhasesDTO} projectsPhases
	 * @returns {DeleteResult}
	 */
	async removePhaseFromProjectPhases(projectsPhases) {
		return await this.Repository.createQueryBuilder("ProjectsPhases")
			.delete()
			.from(ProjectsPhasesEntity)
			.where("projectId = :projectId AND phaseId = :phaseId", projectsPhases)
			.execute();
	}
}

module.exports = ProjectsPhasesRepository;
