const { Socket, Namespace } = require("socket.io");

class CardFunctionality {
	constructor(_, inject) {
		inject("IOCreateCard", this.#IOCreateCard);
		inject("IODeleteCard", this.#IODeleteCard);
		inject("IOUpdateCard", this.#IOUpdateCard);
		inject("IOMoveCard", this.#IOMoveCard);
	}

	/**
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	#IOCreateCard(projectsIO, socket, project, data) {}

	#IODeleteCard(projectsIO, socket, project, data) {}

	#IOUpdateCard(projectsIO, socket, project, data) {}

	#IOMoveCard(projectsIO, socket, project, data) {}
}

module.exports = CardFunctionality;
