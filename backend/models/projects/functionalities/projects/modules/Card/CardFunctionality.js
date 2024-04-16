class CardFunctionality {
	constructor(ProjectsFunctionalityInterface, inject) {
		inject("IOCreateCard", this.#IOCreateCard);
		inject("IODeleteCard", this.#IODeleteCard);
		inject("IOUpdateCard", this.#IOUpdateCard);
	}

	#IOCreateCard(projectsIO, project, socket, data) {}

	#IODeleteCard(projectsIO, project, socket, data) {}

	#IOUpdateCard(projectsIO, project, socket, data) {}
}

module.exports = CardFunctionality;
