const { InsertResult, DeleteResult } = require("typeorm");

const { Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

const Service = require("../../../__types/Service");

const PhasesCardsDTO = require("./PhasesCardsDTO");
const PhasesCardsRepository = require("./PhasesCardsRepository");

class PhasesCardsService extends Service {
	PhasesCardsRepository;

	constructor() {
		super();
		this.PhasesCardsRepository = new PhasesCardsRepository(this);
	}

	/**
	 * Retorna as fases de um cartão.
	 *
	 * @param {Object} pageOptions { PAGE: number, PAGE_SIZE: number }
	 * @param {number} phaseId
	 * @returns {Page}
	 */
	async getCardsOfPhase(pageOptions, phaseId) {
		return await this.PhasesCardsRepository.getCardsOfPhase(pageOptions, phaseId);
	}

	/**
	 * Adiciona um cartão a uma fase.
	 *
	 * @param {number} phaseId
	 * @param {number} cardId
	 * @returns {InsertResult}
	 */
	async addCardToPhase(phaseId, cardId) {
		return await this.PhasesCardsRepository.addCardToPhase(new PhasesCardsDTO({ phaseId, cardId }));
	}

	/**
	 * Remove um cartão de uma fase.
	 *
	 * @param {number} phaseId
	 * @param {number} cardId
	 * @returns {DeleteResult}
	 */
	async removeCardFromPhase(phaseId, cardId) {
		return await this.PhasesCardsRepository.removeCardFromPhase(new PhasesCardsDTO({ phaseId, cardId }));
	}
}

module.exports = PhasesCardsService;
