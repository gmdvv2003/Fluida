const Repository = require("../../../__types/Repository");

const ProjectsInvitationsDTO = require("./ProjectsInvitationsDTO");
const ProjectsInvitationsEntity = require("./ProjectsInvitationsEntity");

class ProjectsMembersRepository extends Repository {
	constructor(service) {
		super(service, ProjectsInvitationsDTO);
	}
}

module.exports = ProjectsMembersRepository;
