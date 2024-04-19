const Repository = require("../../../__types/Repository");

const ProjectInvitationsEntity = require("./ProjectInvitationsEntity");

class ProjectMembersRepository extends Repository {
	constructor(service) {
		super(service, ProjectInvitationsEntity);
	}
}

module.exports = ProjectMembersRepository;
