class ProjectInvitationsInterface {
	#controller;

	constructor(controller) {
		this.#controller = controller;
	}

	isUserInvitedToProject(userId, projectId) {}

	addInvite(userId, projectId) {}

	removeInvite(userId, projectId) {}
}

module.exports = ProjectInvitationsInterface;
