const ProjectInvitationsDTO = require("./ProjectInvitationsDTO");
const ProjectInvitationsEntity = require("./ProjectInvitationsEntity");

class ProjectInvitationsInterface {
	#controller;

	constructor(controller) {
		this.#controller = controller;
	}

	/**
	 * Adiciona um convite para um usuário em um projeto
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 */
	addInvite(userId, projectId) {
		if (!this.isUserInvitedToProject(userId, projectId)) {
			this.#controller
				.getService()
				.Invitations.push(new ProjectInvitationsEntity(userId, projectId));

			return true;
		}

		return false;
	}

	/**
	 * Remove um convite para um usuário em um projeto
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 */
	removeInvite(userId, projectId) {}

	/**
	 * Indica se um usuário foi convidado para um projeto
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 * @returns {boolean}
	 */
	isUserInvitedToProject(userId, projectId) {
		return this.#controller
			.getService()
			.Invitations.some(
				(invitation) => invitation.userId === userId && invitation.projectId === projectId
			);
	}
}

module.exports = ProjectInvitationsInterface;
