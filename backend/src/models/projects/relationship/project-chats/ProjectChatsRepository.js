const Repository = require("../../../__types/Repository");

const ProjectChatsEntity = require("./ProjectChatsEntity");

class ProjectChatsRepository extends Repository {
	constructor(service) {
		super(service, ProjectChatsEntity);
	}
}

module.exports = ProjectChatsRepository;
