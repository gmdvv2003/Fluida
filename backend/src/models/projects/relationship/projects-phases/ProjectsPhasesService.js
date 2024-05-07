const { InsertResult, DeleteResult } = require("typeorm");

const { Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

const Service = require("../../../__types/Service");

const ProjectsPhasesDTO = require("./ProjectsPhasesDTO");
const ProjectsPhasesRepository = require("./ProjectsPhasesRepository");

class ProjectsPhasesService extends Service {
	ProjectsPhasesRepository;

	constructor() {
		super();
		this.ProjectsPhasesRepository = new ProjectsPhasesRepository(this);
	}

	/**
	 * Retorna as fases de um projeto.
	 *
	 * @param {Object} pageOptions { PAGE: number, PAGE_SIZE: number }
	 * @param {number} projectId
	 * @returns {Page}
	 */
	async getPhasesOfProject(pageOptions, projectId) {
		return await this.ProjectsPhasesRepository.getPhasesOfProject(pageOptions, projectId);
	}

	/**
	 * Adiciona uma fase a um projeto.
	 *
	 * @param {number} phaseId
	 * @param {number} projectId
	 * @returns {InsertResult}
	 */
	async addPhaseToProjectPhases(phaseId, projectId) {
		return await this.ProjectsPhasesRepository.addPhaseToProjectPhases(
			new ProjectsPhasesDTO({ phaseId, projectId })
		);
	}

	/**
	 * Remove uma fase de um projeto.
	 *
	 * @param {number} phaseId
	 * @param {number} projectId
	 * @returns {DeleteResult}
	 */
	async removePhaseFromProjectPhases(phaseId, projectId) {
		return await this.ProjectsPhasesRepository.removePhaseFromProjectPhases(
			new ProjectsPhasesDTO({ phaseId, projectId })
		);
	}
}

module.exports = ProjectsPhasesService;
