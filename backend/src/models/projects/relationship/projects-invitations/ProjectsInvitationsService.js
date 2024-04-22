const Service = require("../../../__types/Service");

const ProjectsInvitationsDTO = require("./ProjectsInvitationsDTO");
const ProjectsInvitationsRepository = require("./ProjectsInvitationsRepository");

class ProjectInvitationsService extends Service {
	#ProjectsInvitationsRepository;

	constructor() {
		super();
		this.#ProjectsInvitationsRepository = new ProjectsInvitationsRepository(this);
	}

	addInvite(userId, projectId) {}

	removeInvite(userId, projectId) {}
}

module.exports = ProjectInvitationsService;
