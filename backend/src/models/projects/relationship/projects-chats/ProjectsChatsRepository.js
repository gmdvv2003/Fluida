const Repository = require("../../../__types/Repository");

const ProjectsChatsDTO = require("./ProjectsChatsDTO");
const ProjectsChatsEntity = require("./ProjectsChatsEntity");

class ProjectsChatsRepository extends Repository {
	constructor(service) {
		super(service, ProjectsChatsDTO);
	}
}

module.exports = ProjectsChatsRepository;
