const { Like, InsertResult, DeleteResult } = require("typeorm");

const Repository = require("../../../__types/Repository");

const PhasesCardsDTO = require("./PhasesCardsDTO");
const PhasesCardsEntity = require("./PhasesCardsEntity");

const { Paginate, Page } = require("../../../../context/decorators/typeorm/pagination/Pagination");

class PhasesCardsRepository extends Repository {
	constructor(service) {
		super(service, PhasesCardsDTO);
	}

	/**
	 * Retorna os cartões de uma fase do banco de dados.
	 *
	 * @param {number} phaseId
	 * @returns {Page}
	 */
	@Paginate({ GROUP_BY: "cardId" })
	async getCardsOfPhase(phaseId) {
		/**
		 * @type {import("typeorm").FindManyOptions<Entity>}
		 */
		const query = {
			// Filtra pelo id da fase.
			where: { phaseId: Like(`%${phaseId}%`) },

			// Adiciona a relação com o cartão.
			relations: { card: true },

			// Seleciona apenas os campos necessários.
			// select: { card: true, log: true },
		};

		return { repository: this.Repository, query: query, pick: "card" };
	}

	/**
	 * Adiciona um cartão a uma fase do banco de dados.
	 *
	 * @param {PhasesCardsDTO} phasesCards
	 * @returns {InsertResult}
	 */
	async addCardToPhase(phasesCards) {
		return await this.Repository.createQueryBuilder("PhasesCards")
			.insert()
			.into(PhasesCardsEntity, ["phaseId", "cardId"])
			.values(phasesCards)
			.execute();
	}

	/**
	 * Remove um cartão de uma fase do banco de dados.
	 *
	 * @param {PhasesCardsDTO} phasesCards
	 * @returns {DeleteResult}
	 */
	async removeCardFromPhase(phasesCards) {
		return await this.Repository.createQueryBuilder("PhasesCards")
			.delete()
			.from(PhasesCardsEntity)
			.where(`phaseId = :phaseId AND cardId = :cardId`, phasesCards)
			.execute();
	}
}

module.exports = PhasesCardsRepository;
