const { UpdateResult } = require("typeorm");

const Service = require("../__types/Service");

const PhasesDTO = require("./PhasesDTO");
const PhasesRepository = require("./PhasesRepository");

const PhasesCardsService = require("./relationship/phases-cards/PhasesCardsService");

class PhasesService extends Service {
	PhasesRepository;

	PhasesCardsService;

	constructor() {
		super();
		this.PhasesRepository = new PhasesRepository(this);

		// Inicializa os serviços de relacionamento
		this.PhasesCardsService = new PhasesCardsService();

		// Define o serviço pai
		this.PhasesCardsService.setService(this);
	}

	/**
	 * Retorna o total de cartões em uma fase.
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async getTotalCardsInPhase(phaseId) {
		return await this.PhasesRepository.getTotalCardsInPhase(phaseId);
	}

	/**
	 * Retorna uma fase pelo id.
	 *
	 * @param {number} phaseId
	 * @returns {PhasesDTO}
	 */
	async getPhaseById(phaseId) {
		return await this.PhasesRepository.getPhaseById(phaseId);
	}

	/**
	 * Insere uma fase no banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {InsertResult}
	 */
	async createPhase(phasesDTO) {
		return await this.PhasesRepository.createPhase(phasesDTO);
	}

	/**
	 * Deleta uma fase do banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {DeleteResult}
	 */
	async deletePhase(phasesDTO) {
		return await this.PhasesRepository.deletePhase(phasesDTO);
	}

	/**
	 * Atualiza uma fase do banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {UpdateResult}
	 */
	async updatePhase(phaseId, phaseName) {
		return await this.PhasesRepository.updatePhase(phaseId, phaseName);
	}

	/**
	 *
	 * @param {*} phaseDTO
	 * @param {*} targetPositionIndex
	 * @returns
	 */
	async movePhase(phaseDTO, targetPositionIndex) {
		return await this.PhasesRepository.movePhase(phaseDTO, targetPositionIndex);
	}

	/**
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async incrementTotalCardsInPhase(phaseId) {
		return await this.PhasesRepository.incrementTotalCardsInPhase(phaseId);
	}

	/**
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async decrementTotalCardsInPhase(phaseId) {
		return await this.PhasesRepository.decrementTotalCardsInPhase(phaseId);
	}
}

module.exports = PhasesService;
