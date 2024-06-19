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
				order: () => "(COALESCE((SELECT MAX(`order`) FROM (SELECT * FROM `Cards` WHERE `phaseId` = :phaseId) AS temporary) + 2, 2))",
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
		cardName = cardName || "Novo Card";
		cardDescription = cardDescription || "Descrição do card";

		return await this.Repository.createQueryBuilder("Cards").update(CardsEntity).set({ cardName, cardDescription }).where("cardId = :cardId", { cardId }).execute();
	}

	/**
	 * Move as ordens das fases para a posição alvo.
	 *
	 * @param {PhasesDTO} cardDTO
	 * @param {number} targetPositionIndex
	 * @returns
	 */
	async moveCard(cardDTO, targetPositionIndex, targetPhaseId) {
		targetPositionIndex = Math.max(targetPositionIndex + (targetPositionIndex % 2), 2);

		// Pega a posição atual do card
		const { order } = (await this.Repository.createQueryBuilder("Cards").select("Cards.order", "order").where(`cardId = :cardId`, cardDTO).getRawOne()) || {};

		if (!order) {
			throw new Error("Card não encontrado.");
		}

		let rangeStart, rangeEnd;
		if (order < targetPositionIndex) {
			rangeStart = order;
			rangeEnd = targetPositionIndex;
		} else {
			rangeStart = targetPositionIndex;
			rangeEnd = order;
		}

		return await this.Repository.manager.transaction(async (transactionalEntityManager) => {
			// Pega todos os cards que precisam ser atualizados
			const cardsToUpdate = await transactionalEntityManager
				.createQueryBuilder("Cards", "Card")
				.where("Card.phaseId = :phaseId AND Card.order >= :rangeStart AND Card.order <= :rangeEnd", {
					phaseId: cardDTO.phaseId,
					rangeStart,
					rangeEnd,
				})
				.orderBy("Card.order")
				.limit(rangeEnd - rangeStart + 2)
				.getMany();

			// Atualiza a posição das fases
			cardsToUpdate.forEach((card) => {
				if (card.cardId === cardDTO.cardId) {
					card.order = targetPositionIndex;
				} else if (card.order < order && card.order >= targetPositionIndex) {
					card.order += 2;
				} else if (card.order > order && card.order <= targetPositionIndex) {
					card.order -= 2;
				}
			});

			// Salva as fases atualizadas no banco de dados
			await transactionalEntityManager.save(cardsToUpdate);
		});
	}
}

module.exports = CardsRepository;
