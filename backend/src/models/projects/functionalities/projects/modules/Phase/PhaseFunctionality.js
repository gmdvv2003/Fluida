const { Socket, Namespace } = require("socket.io");

const { Validate } = require("../../../../../../context/decorators/input-validator/InputValidator");

const PhasesDTO = require("../../../../../phases/PhasesDTO");

class PhaseFunctionality {
	constructor(_, inject) {
		inject("IOCreatePhase", this.#IOCreatePhase);
		inject("IODeletePhase", this.#IODeletePhase);
		inject("IOUpdatePhase", this.#IOUpdatePhase);
		inject("IOMovePhase", this.#IOMovePhase);
		inject("IOFetchPhases", this.#IOFetchPhases);
		inject("IOGetTotalPhases", this.#IOGetTotalPhases);
	}

	/**
	 * Cria uma fase.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	@Validate({ NAME: "phaseName", TYPE: "string", LENGTH: 100, INDEX: 3 })
	#IOCreatePhase(projectsIO, socket, project, data, acknowledgement) {
		// Cria um DTO para a fase
		let phaseDTO = new PhasesDTO({
			projectId: project.projectId,
			phaseName: data.phaseName,
		});

		// Cria a fase no banco de dados
		this.ProjectsController.PhasesService.createPhase(phaseDTO)
			.then(({ generatedMaps }) => {
				let generatedMap = generatedMaps[0];

				// Atualiza o DTO com os valores gerados
				phaseDTO = { ...phaseDTO, ...generatedMap };

				// Adiciona a fase ao projeto localmente
				project.addPhase(phaseDTO);

				// Emite o evento de criação da fase
				projectsIO.to(project.projectId).emit("phaseCreated", phaseDTO);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { phase: phaseDTO });
			})
			.catch((error) => {
				socket.emit("error", { message: "Erro ao criar a fase", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 * @returns
	 */
	#IODeletePhase(projectsIO, socket, project, data, acknowledgement) {
		const { phaseId } = data;

		if (project.getPhase(phaseId) == undefined) {
			return socket.emit("error", { message: "Fase não encontrada." });
		}

		this.ProjectsController.PhasesService.deletePhase(new PhasesDTO({ phaseId }))
			.then((result) => {
				// Emite o evento de deleção da fase
				projectsIO.to(project.projectId).emit("phaseDeleted", { phaseId });

				// Remove a fase do projeto localmente
				project.removePhase(phaseId);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { phaseId });
			})
			.catch((error) => {
				socket.emit("error", { message: "Erro ao deletar a fase", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOUpdatePhase(projectsIO, socket, project, data, acknowledgement) {
		const { phaseId, newPhaseName } = data;

		if (project.getPhase(phaseId) == undefined) {
			return socket.emit("error", { message: "Fase não encontrada." });
		}

		this.ProjectsController.PhasesService.updatePhase(phaseId, newPhaseName)
			.then((result) => {
				// Emite o evento de deleção da fase
				projectsIO.to(project.projectId).emit("phaseUpdated", { phaseId, newPhaseName });

				// Atualiza a fase do projeto localmente
				project.updatePhase(phaseId, newPhaseName);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { phaseId });
			})
			.catch((error) => {
				socket.emit("error", { message: "Erro ao atualizar a fase", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 * Realiza a movimentação de uma fase.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 * @param {Function} acknowledgement
	 */
	#IOMovePhase(projectsIO, socket, project, data, acknowledgement) {
		const { phaseId, targetPositionIndex } = data;

		if (project.getPhase(phaseId) == undefined) {
			return socket.emit("error", { message: "Fase não encontrada." });
		}

		this.ProjectsController.PhasesService.movePhase(new PhasesDTO({ projectId: project.projectId, phaseId }), targetPositionIndex)
			.then((result) => {})
			.catch((error) => {
				socket.emit("error", { message: "Erro ao mover a fase", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 * Busca as fases do projeto.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	#IOFetchPhases(projectsIO, socket, project, data, acknowledgement) {
		project.getPhases(data?.page).then((result) => {
			acknowledgement ? acknowledgement({ phases: result }) : socket.emit("phasesFetched", result);
		});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOGetTotalPhases(projectsIO, socket, project, data, acknowledgement) {
		project.getTotalPhasesInProject().then((result) => {
			acknowledgement && acknowledgement({ amount: result });
		});
	}
}

module.exports = PhaseFunctionality;
