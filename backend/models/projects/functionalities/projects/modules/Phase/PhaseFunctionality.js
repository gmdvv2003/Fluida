class PhaseFunctionality {
	constructor(ProjectsFunctionalityInterface, inject) {
		inject("IOCreatePhase", this.#IOCreatePhase);
		inject("IODeletePhase", this.#IODeletePhase);
		inject("IOUpdatePhase", this.#IOUpdatePhase);
	}

	#IOCreatePhase(project, socket, data) {}

	#IODeletePhase(project, socket, data) {}

	#IOUpdatePhase(project, socket, data) {}
}

module.exports = PhaseFunctionality;
