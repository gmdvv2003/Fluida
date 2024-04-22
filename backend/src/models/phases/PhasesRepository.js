const Repository = require("../__types/Repository");

const PhasesDTO = require("./PhasesDTO");
const PhasesEntity = require("./PhasesEntity");

const { Subscribe } = require("../../context/typeorm/subscriber/Subscriber");
const { InsertResult, DeleteResult } = require("typeorm");

class PhasesRepository extends Repository {
	// ==================================== Triggers ==================================== //
	/**
	 * Trigger que adiciona a fase ao projeto.
	 */
	async afterInsert_addPhaseToProjectPhases({ entity }) {
		await this.Service.ProjectsPhasesService.addPhaseToProjectPhases(entity.phaseId, entity.projectId);
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
		return await this.Repository.createQueryBuilder("Phases").insert().into("Phases").values(phasesDTO).execute();
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
