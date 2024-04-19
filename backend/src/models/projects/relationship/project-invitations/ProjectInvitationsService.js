const Service = require("../../../__types/Service");

const ProjectInvitationsEntity = require("./ProjectInvitationsEntity");
const ProjectInvitationsRepository = require("./ProjectInvitationsRepository");

class ProjectInvitationsService extends Service {
	#ProjectInvitationsRepository;

	constructor() {
		super();
		this.#ProjectInvitationsRepository = new ProjectInvitationsRepository(this);
	}

	/**
	 * Adiciona um convite para um usuário em um projeto
	 *
	 * @param {number} userId
	 * @param {number} projectId
	 */
	addInvite(userId, projectId) {
		if (!this.isUserInvitedToProject(userId, projectId)) {
			this.getController().getService().Invitations.push(new ProjectInvitationsEntity(userId, projectId));

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
		return this.getController()
			.getService()
			.Invitations.some((invitation) => invitation.userId === userId && invitation.projectId === projectId);
	}
}

module.exports = ProjectInvitationsService;
