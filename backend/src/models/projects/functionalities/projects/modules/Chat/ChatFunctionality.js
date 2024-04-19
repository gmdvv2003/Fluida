class ChatFunctionality {
	constructor(_, inject) {
		inject("IOSendMessage", this.#IOSendMessage);
		inject("IOEditMessage", this.#IOEditMessage);
		inject("IODeleteMessage", this.#IODeleteMessage);
	}

	#IOSendMessage(projectsIO, socket, project, data) {}

	#IOEditMessage(projectsIO, socket, project, data) {}

	#IODeleteMessage(projectsIO, socket, project, data) {}
}

module.exports = ChatFunctionality;
