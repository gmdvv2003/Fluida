class CardFunctionality {
	constructor(ProjectsFunctionalityInterface, inject) {
		inject("IOCreateCard", this.#IOCreateCard);
		inject("IODeleteCard", this.#IODeleteCard);
		inject("IOUpdateCard", this.#IOUpdateCard);
	}

	#IOCreateCard(project, socket, data) {}

	#IODeleteCard(project, socket, data) {}

	#IOUpdateCard(project, socket, data) {}
}

module.exports = CardFunctionality;
