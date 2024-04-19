const Service = require("../../../__types/Service");

const ProjectChatsEntity = require("./ProjectChatsEntity");
const ProjectChatsRepository = require("./ProjectChatsRepository");

class ProjectChatsService {
	#ProjectChatsRepository;

	constructor() {
		super();
		this.#ProjectChatsRepository = new ProjectChatsRepository(this);
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

module.exports = ProjectChatsService;
