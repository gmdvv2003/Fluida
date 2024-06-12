const { Socket, Namespace } = require("socket.io");

const { Validate } = require("../../../../../../context/decorators/input-validator/InputValidator");

const CardsDTO = require("../../../../../cards/CardsDTO");

class CardFunctionality {
	constructor(_, inject) {
		inject("IOCreateCard", this.#IOCreateCard);
		inject("IODeleteCard", this.#IODeleteCard);
		inject("IOUpdateCard", this.#IOUpdateCard);
		inject("IOMoveCard", this.#IOMoveCard);
		inject("IOFetchCards", this.#IOFetchCards);
		inject("IOGetTotalCards", this.#IOGetTotalCards);
	}

	/**
	 *
	 * @param {Namespace} projectsIO
	 * @param {Socket} socket
	 * @param {Projec} project
	 * @param {Object} data
	 */
	@Validate({ NAME: "title", TYPE: "string", LENGTH: 100, INDEX: 3 })
	#IOCreateCard(projectsIO, socket, project, data) {
		// Cria o DTO para o card
		let cardDTO = new CardsDTO({
			phaseId: data.phaseId,
			title: data.title,
		});

		// Cria o card no banco de dados
		this.ProjectsController.CardsService.createCard(cardDTO)
			.then(({ generatedMaps }) => {
				let generatedMap = generatedMaps[0];

				// Atualiza o DTO com os valores gerados
				cardDTO = { ...cardDTO, ...generatedMap };

				// Adiciona o card a phase localmente
				project.addCard(cardDTO);

				// Emite o evento de criaçao de card
				projectsIO.to(project.projectId).emit("createCard", cardDTO);
			})
			.catch((error) => socket.emit("error", { message: "Erro ao criar o card da fase", error: error }));
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} param3
	 */
	#IODeleteCard(projectsIO, socket, project, { cardId }) {
		const cardDTO = new CardsDTO({ cardId });

		// Deleta o card do banco de dados
		this.ProjectsController.CardsService.deleteCard(cardDTO)
			.then(({ generatedMaps }) => {
				let { phaseId } = generatedMaps[0];

				// Emite o evento de deleção da fase
				projectsIO.to(project.projectId).emit("cardDeleted", { phaseId, cardId });

				// Remove a fase do projeto localmente
				project.removePhase(phaseId);
			})
			.catch((error) => socket.emit("error", { message: "Erro ao deletar o card", error: error }));
	}

	#IOUpdateCard(projectsIO, socket, project, data) {}

	#IOMoveCard(projectsIO, socket, project, data) {}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOFetchCards(projectsIO, socket, project, data) {
		project.getCards(data?.phaseId, data?.page).then((result) => {
			acknowledgement ? acknowledgement({ cards: result }) : socket.emit("cardsFetched", result);
		});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOGetTotalCards(projectsIO, socket, project, data) {
		project.getTotalCardsInPhase(data?.phaseId).then((result) => {
			acknowledgement && acknowledgement({ amount: result });
		});
	}
}

module.exports = CardFunctionality;
