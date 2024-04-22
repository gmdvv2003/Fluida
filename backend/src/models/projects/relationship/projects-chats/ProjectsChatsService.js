const Service = require("../../../__types/Service");

const ProjectsChatsDTO = require("./ProjectsChatsDTO");
const ProjectsChatsRepository = require("./ProjectsChatsRepository");

class ProjectsChatsService extends Service {
	#ProjectsChatsRepository;

	constructor() {
		super();
		this.#ProjectsChatsRepository = new ProjectsChatsRepository(this);
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

module.exports = ProjectsChatsService;
