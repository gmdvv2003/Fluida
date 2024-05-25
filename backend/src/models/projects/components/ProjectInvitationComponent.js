const jwt = require("jsonwebtoken");

const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");

class ProjectInvitationComponent {
	Controller;

	constructor(controller) {
		this.Controller = controller;
	}

	/**
	 * Retorna um link de convite para um projeto se possível
	 *
	 * @param {number} projectId
	 * @param {number?} targetUserId
	 * @returns {string | boolean}
	 */
	createProjectInvitationLink(projectId, targetUserId = false) {
		const jwtSignOptions = { projectId, targetUserId, isPublicInvite: !targetUserId };

		// Verifica se o projeto existe
		const project = this.Controller.Service.getProjectById(projectId);
		if (!project) {
			return false;
		}

		// Cria um token de validação para o convite
		const token = jwt.sign(jwtSignOptions, process.env.JWT_PRIVATE_KEY, {
			algorithm: "RS256",
		});

		// Url que irá redirecionar o usuário para a página de validação do convite
		const invitationLink = global.__URLS__.validateInvitation.edit({
			query: {
				token: token,
			},
		});

		return invitationLink;
	}

	/**
	 * Envia um email de convite para um usuário participar de um projeto
	 *
	 * @param {number} userIdToInvite
	 * @param {number} projectId
	 */
	async sendProjectEmailInvitation(projectId, userIdToInvite) {
		const user = this.Controller.getService("users").getUserById(userIdToInvite);
		if (!user) {
			return { success: false, message: "Usuário não encontrado." };
		}

		const invitationLink = this.createProjectInvitationLink(projectId, userIdToInvite);
		if (!invitationLink) {
			return { success: false, message: "Erro ao criar link de convite." };
		}

		return await EmailTransporter.send("ValidateInvitation", user, invitationLink);
	}

	/**
	 * Valida um token de convite de participação de um projeto
	 *
	 * @param {string} validationToken
	 * @returns {boolean}
	 */
	validateProjectInvitation(userIdRequestingValidation, validationToken) {
		return jwt.verify(
			validationToken,
			process.env.JWT_PUBLIC_KEY,
			function (error, decoded) {
				if (error) {
					return false;
				}

				const { projectId, userId, isPublicInvite } = decoded;

				// Verifica se o projeto existe
				const project = this.Controller.Service.getProjectById(projectId);
				if (!project) {
					return false;
				}

				if (!isPublicInvite) {
					// Verifica se o usuário existe e é o mesmo que está tentando validar o convite
					const user = this.Controller.getService("users").getUserById(userId);
					if (!user || user.userId !== userIdRequestingValidation) {
						return false;
					}
				}

				const isMemberOfProject =
					this.Controller.ProjectMembersInterface.isUserMemberOfProject(
						userIdRequestingValidation,
						projectId
					);
				if (isMemberOfProject) {
					return false;
				}

				// Adiciona o usuário ao projeto
				this.Controller.ProjectMembersInterface.addUserToProject(
					userIdRequestingValidation,
					projectId
				);

				return true;
			}.bind(this)
		);
	}
}

module.exports = ProjectInvitationComponent;
