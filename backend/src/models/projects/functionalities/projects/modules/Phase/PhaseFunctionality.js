class PhaseFunctionality {
	constructor(_, inject) {
		inject("IOCreatePhase", this.#IOCreatePhase);
		inject("IODeletePhase", this.#IODeletePhase);
		inject("IOUpdatePhase", this.#IOUpdatePhase);
		inject("IOMovePhase", this.#IOMovePhase);
	}

	#IOCreatePhase(projectsIO, socket, project, data) {}

	#IODeletePhase(projectsIO, socket, project, data) {}

	#IOUpdatePhase(projectsIO, socket, project, data) {}

	#IOMovePhase(projectsIO, socket, project, data) {}
}

module.exports = PhaseFunctionality;
