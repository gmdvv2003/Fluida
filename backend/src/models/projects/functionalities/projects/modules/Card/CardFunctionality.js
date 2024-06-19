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
	@Validate({ NAME: "cardName", TYPE: "string", LENGTH: 100, INDEX: 3 })
	#IOCreateCard(projectsIO, socket, project, data, acknowledgement) {
		// Cria o DTO para o card
		let cardDTO = new CardsDTO({
			phaseId: data.phaseId,
			cardName: data.cardName,
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
				projectsIO.to(project.projectId).emit("cardCreated", cardDTO);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { card: cardDTO });
			})
			.catch((error) => {
				console.error("Erro ao criar o card: ", error);

				socket.emit("error", { message: "Erro ao criar o card da fase", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} param3
	 */
	#IODeleteCard(projectsIO, socket, project, data, acknowledgement) {
		const { cardId } = data;

		const card = project.getCard(cardId);
		if (!card) {
			return socket.emit("error", { message: "Card não encontrado." });
		}

		const { phaseId } = card;

		// Deleta o card do banco de dados
		this.ProjectsController.CardsService.deleteCard(new CardsDTO({ cardId }))
			.then(() => {
				// Emite o evento de deleção do card
				projectsIO.to(project.projectId).emit("cardDeleted", { phaseId, cardId });

				// Remove o card do projeto localmente
				project.removeCard(cardId);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { cardId });
			})
			.catch((error) => {
				console.error("Erro ao deletar o card: ", error);

				socket.emit("error", { message: "Erro ao deletar o card", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOUpdateCard(projectsIO, socket, project, data, acknowledgement) {
		const { cardId, newCardName, newCardDescription } = data;

		const card = project.getCard(cardId);
		if (!card) {
			return socket.emit("error", { message: "Card não encontrado." });
		}

		const { phaseId } = card;

		this.ProjectsController.CardsService.updateCard(cardId, newCardName, newCardDescription)
			.then((result) => {
				// Emite o evento de atualização do card
				projectsIO.to(project.projectId).emit("cardUpdated", { phaseId, cardId, newCardName, newCardDescription });

				// Atualiza a fase do projeto localmente
				project.updateCard(cardId, newCardName, newCardDescription);

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(true, { cardId });
			})
			.catch((error) => {
				console.error("Erro ao atualizar o card: ", error);

				socket.emit("error", { message: "Erro ao atualizar o card", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 * @returns
	 */
	#IOMoveCard(projectsIO, socket, project, data, acknowledgement) {
		const { cardId, targetPositionIndex, targetPhaseId } = data;

		const card = project.getCard(cardId);
		if (!card) {
			return socket.emit("error", { message: "Card não encontrado." });
		}

		const { phaseId } = card;

		this.ProjectsController.CardsService.moveCard(new CardsDTO({ projectId: project.projectId, phaseId: phaseId, cardId }), targetPositionIndex, targetPhaseId)
			.then((result) => {})
			.catch((error) => {
				socket.emit("error", { message: "Erro ao mover o card", error: error });

				// Emite a resposta pessoal do evento
				acknowledgement && acknowledgement(false, { error: error });
			});
	}

	/**
	 *
	 * @param {*} projectsIO
	 * @param {*} socket
	 * @param {*} project
	 * @param {*} data
	 */
	#IOFetchCards(projectsIO, socket, project, data, acknowledgement) {
		project.getCards(data?.page, data?.phaseId).then((result) => {
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
	#IOGetTotalCards(projectsIO, socket, project, data, acknowledgement) {
		project.getTotalCardsInPhase(data?.phaseId).then((result) => {
			acknowledgement && acknowledgement({ amount: result });
		});
	}
}

module.exports = CardFunctionality;
