const { Socket, Namespace } = require("socket.io");

const { Validate } = require("../../../../../../context/decorators/input-validator/InputValidator");

const PhasesDTO = require("../../../../../phases/PhasesDTO");

class PhaseFunctionality {
	constructor(_, inject) {
		inject("IOCreatePhase", this.#IOCreatePhase);
		inject("IODeletePhase", this.#IODeletePhase);
		inject("IOUpdatePhase", this.#IOUpdatePhase);
		inject("IOMovePhase", this.#IOMovePhase);
	}

	/**
	 * Cria uma fase.
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	@Validate({ NAME: "phaseTitle", TYPE: "string", LENGTH: 100 })
	#IOCreatePhase(projectsIO, socket, project, data) {
		const phaseDTO = new PhasesDTO({ projectId: project.project, phaseTitle: data.phaseTitle });

		const projectsService = project.ProjectsController.getService();
		projectsService.PhasesService.createPhase(phaseDTO)
			.then(() => socket.to(project.projectId).emit("phaseCreated", phaseDTO))
			.catch(() => socket.emit("error", { message: "Erro ao criar a fase" }));
	}

	#IODeletePhase(projectsIO, socket, project, data) {}

	#IOUpdatePhase(projectsIO, socket, project, data) {}

	#IOMovePhase(projectsIO, socket, project, data) {}
}

module.exports = PhaseFunctionality;
