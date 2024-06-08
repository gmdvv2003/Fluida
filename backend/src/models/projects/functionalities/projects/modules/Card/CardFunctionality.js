const { Socket, Namespace } = require("socket.io");
const CardsDTO = require("../../../../../cards/CardsDTO");

class CardFunctionality {
	constructor(_, inject) {
		inject("IOCreateCard", this.#IOCreateCard);
		inject("IODeleteCard", this.#IODeleteCard);
		inject("IOUpdateCard", this.#IOUpdateCard);
		inject("IOMoveCard", this.#IOMoveCard);
		inject("IOFetchCards", this.#IOFetchCards);
	}

	/**
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	#IOCreateCard(projectsIO, socket, project, data) {}

	#IODeleteCard(projectsIO, socket, project, { cardId }) {
		const cardDTO = new CardsDTO({ cardId });

		// Deleta o card do banco de dados
		this.ProjectsController.CardsService.deleteCard(cardDTO)
			.then(({ generatedMaps }) => {
				console.log(generatedMaps);
			})
			.catch((error) => socket.emit("error", { message: "Erro ao deletar o card", error: error }));
	}

	#IOUpdateCard(projectsIO, socket, project, data) {}

	#IOMoveCard(projectsIO, socket, project, data) {}

	#IOFetchCards(projectsIO, socket, project, data) {}

	#IOGetTotalCards(projectsIO, socket, project, data) {}
}

module.exports = CardFunctionality;
