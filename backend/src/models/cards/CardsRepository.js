const Repository = require("../__types/Repository");

const CardsDTO = require("./CardsDTO");
const CardsEntity = require("./CardsEntity");

const { Subscribe } = require("../../context/decorators/typeorm/subscriber/Subscriber");
const { InsertResult, DeleteResult } = require("typeorm");

class CardsRepository extends Repository {
	// ==================================== Triggers ==================================== //
	/**
	 * Trigger que adiciona o cartão à fase.
	 */
	async afterInsert_addCardToPhasesCards({ entity }) {
		await this.Service.Service.Controller.PhasesService.PhasesCardsService.addPhaseToProjectPhases(
			entity.phaseId,
			entity.projectId
		);
	}

	async afterDelete_removeCardFromPhasesCards({ entity }) {}

	constructor(service) {
		super(service, CardsDTO);
		Subscribe(CardsDTO, this);
	}

	/**
	 * Retorna um cartão pelo id.
	 *
	 * @param {number} cardId
	 * @returns {CardsDTO}
	 */
	async getCardById(cardId) {
		return await this.Repository.createQueryBuilder("Cards").where(`cardId = :cardId`, { cardId }).getOne();
	}

	/**
	 * Insere um cartão no banco de dados.
	 *
	 * @param {CardsDTO} cardsDTO
	 * @returns {InsertResult}
	 */
	async createCard(cardsDTO) {
		return await this.Repository.createQueryBuilder("Cards").insert().into("Cards").values(cardsDTO).execute();
	}

	/**
	 * Deleta um cartão do banco de dados.
	 *
	 * @param {CardsDTO} cardsDTO
	 * @returns {DeleteResult}
	 */
	async deleteCard(cardsDTO) {
		return await this.Repository.createQueryBuilder("Cards")
			.delete()
			.from("Cards")
			.where(`cardId = :cardId`, cardsDTO)
			.execute();
	}
}

module.exports = CardsRepository;
