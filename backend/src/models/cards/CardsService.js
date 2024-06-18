const Service = require("../__types/Service");

const CardsDTO = require("./CardsDTO");
const CardsRepository = require("./CardsRepository");

class CardsService extends Service {
	CardsRepository;

	constructor() {
		super();
		this.CardsRepository = new CardsRepository(this);
	}

	/**
	 * Retorna um cartão pelo id.
	 *
	 * @param {number} cardId
	 * @returns {CardsDTO}
	 */
	async getCardById(cardId) {
		return await this.CardsRepository.getCardById(cardId);
	}

	/**
	 * Insere um cartão no banco de dados.
	 *
	 * @param {CardsDTO} cardsDTO
	 * @returns {InsertResult}
	 */
	async createCard(cardsDTO) {
		return await this.CardsRepository.createCard(cardsDTO);
	}

	/**
	 * Deleta um cartão do banco de dados.
	 *
	 * @param {CardsDTO} cardsDTO
	 * @returns {DeleteResult}
	 */
	async deleteCard(cardsDTO) {
		return await this.CardsRepository.deleteCard(cardsDTO);
	}

	/**
	 *
	 * @param {*} cardId
	 * @param {*} newCardName
	 * @param {*} newCardDescription
	 * @returns
	 */
	async updateCard(cardId, newCardName, newCardDescription) {
		return await this.CardsRepository.updateCard(cardId, newCardName, newCardDescription);
	}

	/**
	 *
	 * @param {*} cardDto
	 * @param {*} targetPositionIndex
	 * @returns
	 */
	async moveCard(cardDTO, targetPositionIndex, targetPhaseId) {
		return await this.CardsRepository.moveCard(cardDTO, targetPositionIndex, targetPhaseId);
	}
}

module.exports = CardsService;
