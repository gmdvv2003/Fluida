const jwt = require("jsonwebtoken");

const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");

const ProjectEntity = require("../ProjectsEntity");
const UserEntity = require("../UsersEntity");

class ProjectInvitationComponent {
	controller;

	constructor(controller) {
		this.controller = controller;
	}

	/**
	 *
	 * @param {ProjectEntity} project
	 * @param {UserEntity} user
	 */
	async sendProjectEmailInvitation(project, user) {}

	/**
	 *
	 * @param {string} validationToken
	 */
	validateEmailInvitation(validationToken) {}
}

module.exports = ProjectInvitationComponent;
