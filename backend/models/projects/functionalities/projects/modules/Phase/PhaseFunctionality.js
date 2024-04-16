class PhaseFunctionality {
	constructor(ProjectsFunctionalityInterface, inject) {
		inject("IOCreatePhase", this.#IOCreatePhase);
		inject("IODeletePhase", this.#IODeletePhase);
		inject("IOUpdatePhase", this.#IOUpdatePhase);
	}

	#IOCreatePhase(projectsIO, project, socket, data) {}

	#IODeletePhase(projectsIO, project, socket, data) {}

	#IOUpdatePhase(projectsIO, project, socket, data) {}
}

module.exports = PhaseFunctionality;
