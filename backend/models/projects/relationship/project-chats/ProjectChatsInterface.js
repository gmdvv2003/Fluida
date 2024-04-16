class ProjectChatsInterface {
	#controller;

	constructor(controller) {
		this.#controller = controller;
	}

	getMessagesOfProject(projectId) {}
	getMessagesOfProjectByUser(projectId, userId) {}

	getMessagesOfProjectGroupChat(projectId) {}
	getMessagesOfProjectGroupChatByUser(projectId, userId) {}

	getMessagesOfDirectChat(projectId, directChatId) {}
	getMessagesOfDirectChatByUser(projectId, directChatId, userId) {}

	sendMessage(projectId, chatId, userId, content) {}
	editMessage(messageId, content) {}
	deleteMessage(messageId) {}
}

module.exports = ProjectChatsInterface;
