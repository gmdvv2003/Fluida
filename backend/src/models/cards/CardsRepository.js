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
		await this.Service.Controller.PhasesService.PhasesCardsService.addCardToPhase(entity.phaseId, entity.cardId).catch((error) =>
			console.error(`Erro ao adicionar o cartão à fase: ${error.message}`)
		);
	}

	/**
	 *
	 * @param {*} param0
	 */
	async afterInsert_incrementPhaseTotalCardsCount({ entity }) {
		await this.Service.Controller.PhasesService.incrementTotalCardsInPhase(entity.phaseId).catch((error) =>
			console.error(`Erro ao incrementar o total de cartões na fase: ${error.message}`)
		);
	}

	/**
	 *
	 * @param {*} param0
	 */
	async afterRemove_decrementPhaseTotalCardsCount({ databaseEntity }) {
		await this.Service.Controller.PhasesService.decrementTotalCardsInPhase(databaseEntity.phaseId).catch((error) =>
			console.error(`Erro ao decrementar o total de cartões na fase: ${error.message}`)
		);
	}

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
		return await this.Repository.createQueryBuilder("Cards")
			.insert()
			.into("Cards")
			.values({
				...cardsDTO,
				order: () =>
					"(COALESCE((SELECT MAX(`order`) FROM (SELECT * FROM `Cards` WHERE `phaseId` = :phaseId) AS temporary) + 1, 1))",
			})
			.setParameter("phaseId", cardsDTO.phaseId)
			.execute();
	}

	/**
	 * Deleta um cartão do banco de dados.
	 *
	 * @param {CardsDTO} cardsDTO
	 * @returns {DeleteResult}
	 */
	async deleteCard(cardsDTO) {
		return await this.Repository.remove(cardsDTO);
	}

	/**
	 *
	 * @param {*} cardId
	 * @param {*} cardName
	 * @param {*} cardDescription
	 * @returns
	 */
	async updateCard(cardId, cardName, cardDescription) {
		console.log("FUBNCIONA VAI KRL POIR FAVOR QUERO MDORMI");
		cardName = cardName || "Novo Card";
		cardDescription = cardDescription || "Descrição do card";

		console.log(cardId, cardName, cardDescription);
		return await this.Repository.createQueryBuilder("Cards")
			.update(CardsEntity)
			.set({ cardName, cardDescription })
			.where("cardId = :cardId", { cardId })
			.execute();
	}
}

module.exports = CardsRepository;
