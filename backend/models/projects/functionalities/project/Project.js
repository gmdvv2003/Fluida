class Participant {
	constructor(user) {}
}

class Project {
	constructor(ProjectsController) {
		// Injetando dependências
		ProjectsController.IOCreateCard = this.#IOCreateCard.bind(this);
		ProjectsController.IODeleteCard = this.#IODeleteCard.bind(this);
		ProjectsController.IOUpdateCard = this.#IOUpdateCard.bind(this);

		ProjectsController.IOCreatePhase = this.#IOCreatePhase.bind(this);
		ProjectsController.IODeletePhase = this.#IODeletePhase.bind(this);
		ProjectsController.IOUpdatePhase = this.#IOUpdatePhase.bind(this);
	}

	addParticipant(participant) {}

	removeParticipant(participant) {}

	IOSubscribeToProject(socket, data) {}
	IOUnsubscribeFromProject(socket, data) {}

	#IOCreateCard(socket, data) {}
	#IODeleteCard(socket, data) {}
	#IOUpdateCard(socket, data) {}

	#IOCreatePhase(socket, data) {}
	#IODeletePhase(socket, data) {}
	#IOUpdatePhase(socket, data) {}
}

module.exports = {
	Participant,
	Project,
};
