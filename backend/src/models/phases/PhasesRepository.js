const Repository = require("../__types/Repository");

const PhasesDTO = require("./PhasesDTO");
const PhasesEntity = require("./PhasesEntity");

const { Subscribe } = require("../../context/decorators/typeorm/subscriber/Subscriber");
const { InsertResult, DeleteResult, UpdateResult } = require("typeorm");

class PhasesRepository extends Repository {
	// ==================================== Triggers ==================================== //
	/**
	 * Trigger que adiciona a fase ao projeto.
	 */
	async afterInsert_addPhaseToProjectPhases({ entity }) {
		const { ProjectsPhasesService } = this.Service.Controller.Service;
		await ProjectsPhasesService.addPhaseToProjectPhases(entity.phaseId, entity.projectId);
	}

	/**
	 * Trigger que incrementa o total de fases em um projeto.
	 */
	async afterInsert_incrementProjectTotalPhasesCount({ entity }) {
		const ProjectsService = this.Service.Controller.Service;
		await ProjectsService.incrementTotalPhasesInProject(entity.projectId);
	}

	async afterRemove_decrementProjectTotalPhasesCount({ databaseEntity }) {
		const ProjectsService = this.Service.Controller.Service;
		await ProjectsService.decrementTotalPhasesInProject(databaseEntity.projectId);
	}

	constructor(service) {
		super(service, PhasesDTO);
		Subscribe(PhasesDTO, this);
	}

	/**
	 * Retorna o total de cartões em uma fase.
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async getTotalCardsInPhase(phaseId) {
		return await this.Repository.createQueryBuilder("Phases").select("totalCards").where("phaseId = :phaseId", { phaseId }).getRawOne();
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
		return await this.Repository.createQueryBuilder("Phases")
			.insert()
			.into("Phases")
			.values({
				...phasesDTO,
				order: () =>
					"(COALESCE((SELECT MAX(`order`) FROM (SELECT * FROM `Phases` WHERE `projectId` = :projectId) AS temporary) + 2, 2))",
			})
			.setParameter("projectId", phasesDTO.projectId)
			.execute();
	}

	/**
	 * Deleta uma fase do banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {DeleteResult}
	 */
	async deletePhase(phasesDTO) {
		return await this.Repository.remove(phasesDTO);
	}

	/**
	 * Atualiza uma fase do banco de dados.
	 *
	 * @param {PhasesDTO} phasesDTO
	 * @returns {UpdateResult}
	 */
	async updatePhase(phaseId, phaseName) {
		return await this.Repository.createQueryBuilder("Phases")
			.update(PhasesEntity)
			.set({ phaseName })
			.where("phaseId = :phaseId", { phaseId })
			.execute();
	}

	/**
	 * Move as ordens das fases para a posição alvo.
	 *
	 * @param {PhasesDTO} phaseDTO
	 * @param {number} targetPositionIndex
	 * @returns
	 */
	async movePhase(phaseDTO, targetPositionIndex) {
		targetPositionIndex = Math.max(targetPositionIndex + (targetPositionIndex % 2), 2);

		// Pega a posição atual da fase
		const { order } =
			(await this.Repository.createQueryBuilder("Phases")
				.select("Phases.order", "order")
				.where(`phaseId = :phaseId`, phaseDTO)
				.getRawOne()) || {};

		if (!order) {
			throw new Error("Fase não encontrada.");
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
			// Pega todas as fases que precisam ser atualizadas
			const phasesToUpdate = await transactionalEntityManager
				.createQueryBuilder("Phases", "Phase")
				.where("Phase.projectId = :projectId AND Phase.order >= :rangeStart AND Phase.order <= :rangeEnd", {
					projectId: phaseDTO.projectId,
					rangeStart,
					rangeEnd,
				})
				.orderBy("Phase.order")
				.limit(rangeEnd - rangeStart + 2)
				.getMany();

			// Atualiza a posição das fases
			phasesToUpdate.forEach((phase) => {
				if (phase.phaseId === phaseDTO.phaseId) {
					phase.order = targetPositionIndex;
				} else if (phase.order < order && phase.order >= targetPositionIndex) {
					phase.order += 2;
				} else if (phase.order > order && phase.order <= targetPositionIndex) {
					phase.order -= 2;
				}
			});

			// Salva as fases atualizadas no banco de dados
			await transactionalEntityManager.save(phasesToUpdate);
		});
	}

	/**
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async incrementTotalCardsInPhase(phaseId) {
		return await this.Repository.createQueryBuilder("Phases")
			.update(PhasesEntity)
			.set({ totalCards: () => "totalCards + 1" })
			.where("phaseId = :phaseId", { phaseId })
			.execute();
	}

	/**
	 *
	 * @param {*} phaseId
	 * @returns
	 */
	async decrementTotalCardsInPhase(phaseId) {
		return await this.Repository.createQueryBuilder("Phases")
			.update(PhasesEntity)
			.set({ totalCards: () => "GREATEST(totalCards - 1, 0)" })
			.where("phaseId = :phaseId", { phaseId })
			.execute();
	}
}

module.exports = PhasesRepository;
