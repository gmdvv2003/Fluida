const Service = require("../__types/Service");

const PhasesDTO = require("./PhasesDTO");
const PhasesRepository = require("./PhasesRepository");

class PhasesService extends Service {
	PhasesRepository;

	constructor() {
		super();
		this.PhasesRepository = new PhasesRepository(this);
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
}

module.exports = PhasesService;
