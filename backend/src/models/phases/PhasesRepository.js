const Repository = require("../__types/Repository");

const PhasesDTO = require("./PhasesDTO");
const PhasesEntity = require("./PhasesEntity");

const { Subscribe } = require("../../context/decorators/typeorm/subscriber/Subscriber");
const { InsertResult, DeleteResult } = require("typeorm");

class PhasesRepository extends Repository {
	// ==================================== Triggers ==================================== //
	/**
	 * Trigger que adiciona a fase ao projeto.
	 */
	async afterInsert_addPhaseToProjectPhases({ entity }) {
		const { ProjectsPhasesService } = this.Service.Controller.Service;
		await ProjectsPhasesService.addPhaseToProjectPhases(entity.phaseId, entity.projectId);
	}

	/**
	 * Trigger que incrementa o total de fases em um projeto.
	 */
	async afterInsert_incrementProjectTotalPhasesCount({ entity }) {
		const ProjectsService = this.Service.Controller.Service;
		await ProjectsService.incrementTotalPhasesInProject(entity.projectId);
	}

	constructor(service) {
		super(service, PhasesDTO);
		Subscribe(PhasesDTO, this);
	}

	/**
	 * Retorna uma fase pelo id.
	 *
	 * @param {number} phaseId
	 * @returns {PhasesDTO}
	 */
	async getPhaseById(phaseId) {
		return await this.Repository.createQueryBuilder("Phases").where(`phaseId = :phaseId`, { phaseId }).getOne();
	}

	/**
	 * Insere uma fase no banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {InsertResult}
	 */
	async createPhase(phasesDTO) {
		return await this.Repository.createQueryBuilder("Phases")
			.insert()
			.into("Phases")
			.values({
				...phasesDTO,
				order: () => "(COALESCE((SELECT MAX(`order`) FROM (SELECT * FROM `Phases` WHERE `projectId` = :projectId) AS _) + 1, 0))",
			})
			.setParameter("projectId", phasesDTO.projectId)
			.execute();
	}

	/**
	 * Deleta uma fase do banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {DeleteResult}
	 */
	async deletePhase(phasesDTO) {
		return await this.Repository.createQueryBuilder("Phases").delete().from("Phases").where(`phaseId = :phaseId`, phasesDTO).execute();
	}
}

module.exports = PhasesRepository;
