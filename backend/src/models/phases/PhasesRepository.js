const Repository = require("../__types/Repository");

const PhasesDTO = require("./PhasesDTO");
const PhasesEntity = require("./PhasesEntity");

const { Subscribe } = require("../../context/decorators/typeorm/subscriber/Subscriber");
const { InsertResult, DeleteResult } = require("typeorm");

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

	constructor(service) {
		super(service, PhasesDTO);
		Subscribe(PhasesDTO, this);
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
					"(COALESCE((SELECT MAX(`order`) FROM (SELECT * FROM `Phases` WHERE `projectId` = :projectId) AS temporary) + 1, 1))",
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
		return await this.Repository.createQueryBuilder("Phases")
			.delete()
			.from("Phases")
			.where(`phaseId = :phaseId`, phasesDTO)
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
				.limit(rangeEnd - rangeStart + 1)
				.getMany();

			// Atualiza a posição das fases
			phasesToUpdate.forEach((phase) => {
				if (phase.phaseId === phaseDTO.phaseId) {
					phase.order = targetPositionIndex;
				} else if (phase.order < order && phase.order >= targetPositionIndex) {
					phase.order += 1;
				} else if (phase.order > order && phase.order <= targetPositionIndex) {
					phase.order -= 1;
				}
			});

			// Salva as fases atualizadas no banco de dados
			await transactionalEntityManager.save(phasesToUpdate);
		});
	}
}

module.exports = PhasesRepository;
