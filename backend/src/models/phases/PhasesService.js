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
	 *
	 * @param {*} phaseDTO
	 * @param {*} targetPositionIndex
	 * @returns
	 */
	async movePhase(phaseDTO, targetPositionIndex) {
		return await this.PhasesRepository.movePhase(phaseDTO, targetPositionIndex);
	}

	async incrementTotalCardsInPhase(phaseId) {
		return await this.PhasesRepository.incrementTotalCardsInPhase(phaseId);
	}
}

module.exports = PhasesService;
