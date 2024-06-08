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
	#IOCreateCard(projectsIO, socket, project, data) {
		// console.log(data.phaseId);
		// console.log(data.cardTitle);
		// // Cria o DTO para o card
		// let cardDTO = new CardsDTO({
		// 	phaseId: data.phaseId,
		// 	title: data.cardTitle,
		// });
		// // Cria o card no banco de dados
		// this.ProjectsController.CardsService.createCard(cardDTO)
		// 	.then(({ generatedMaps }) => {
		// 		let generatedMap = generatedMaps[0];
		// 		// Atualiza o DTO com os valores gerados
		// 		cardDTO = { ...cardDTO, ...generatedMap };
		// 		// Adiciona o card a phase localmente
		// 		project.addCard(cardDTO);
		// 		// Emite o evento de criaçao de card
		// 		projectsIO.to(project.projectId).emit("createCard", cardDTO);
		// 	})
		// 	.catch((error) =>
		// 		socket.emit("error", { message: "Erro ao criar o card da fase", error: error })
		// 	);
	}

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
