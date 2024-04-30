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
	#IOCreatePhase(projectsIO, socket, project, data) {
		// Cria um DTO para a fase
		const phaseDTO = new PhasesDTO({
			projectId: project.projectId,
			phaseName: data.phaseName,
		});

		// Adiciona a fase ao projeto localmente
		project.addPhase(phaseDTO);

		// Cria a fase no banco de dados
		this.ProjectsController.PhasesService.createPhase(phaseDTO)
			.then(() => {
				// Emite o evento de criação da fase
				projectsIO.to(project.projectId).emit("phaseCreated", phaseDTO);
			})
			.catch((error) =>
				socket.emit("error", { message: "Erro ao criar a fase", error: error })
			);
	}

	#IODeletePhase(projectsIO, socket, project, data) {}

	#IOUpdatePhase(projectsIO, socket, project, data) {}

	#IOMovePhase(projectsIO, socket, project, data) {}

	/**
	 * Busca as fases do projeto.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	#IOFetchPhases(projectsIO, socket, project, data) {
		project.fetchPhases(data?.page).then((result) => socket.emit("phasesFetched", result));
	}
}

module.exports = PhaseFunctionality;
