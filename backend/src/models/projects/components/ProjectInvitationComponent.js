const jwt = require("jsonwebtoken");

const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");

class ProjectInvitationComponent {
	Controller;

	constructor(controller) {
		this.Controller = controller;
	}

	/**
	 * Envia um email de convite para um usuário participar de um projeto
	 *
	 * @param {number} userIdToInvite
	 * @param {number} projectId
	 */
	async sendProjectEmailInvitation(userIdToInvite, projectId) {
		// Verifica se o usuário existe
		const user = this.Controller.getService("users").getUserById(userIdToInvite);
		if (!user) {
			return { success: false, message: "Usuário não encontrado." };
		}

		// Verifica se o projeto existe
		const project = this.Controller.Service.getProjectById(projectId);
		if (!project) {
			return { success: false, message: "Projeto não encontrado." };
		}

		// Verifica se o usuário já é membro do projeto
		const isMemberOfProject = this.Controller.ProjectMembersInterface.isUserMemberOfProject(
			userIdToInvite,
			projectId
		);
		if (isMemberOfProject) {
			return { success: false, message: "Usuário já é membro do projeto." };
		}

		// Verifica se o usuário já foi convidado para o projeto
		const isUserInvited = this.Controller.ProjectInvitationsInterface.isUserInvitedToProject(
			userIdToInvite,
			projectId
		);
		if (isUserInvited) {
			return { success: false, message: "Usuário já foi convidado para o projeto." };
		}

		if (!this.project.ProjectInvitationsInterface.addInvitation(userIdToInvite, projectId)) {
			return { success: false, message: "Erro ao adicionar convite no banco de dados." };
		}

		// Cria um token de validação para o convite
		const token = jwt.sign(
			{ userId: userIdToInvite, projectId: projectId },
			process.env.JWT_PRIVATE_KEY,
			{
				algorithm: "RS256",
			}
		);

		// Url que irá redirecionar o usuário para a página de validação do convite
		const invitationUrl = global.__URLS__.validateInvitation.edit({
			query: {
				token: token,
			},
		});

		return await EmailTransporter.send("ValidateInvitation", user, invitationUrl);
	}

	/**
	 * Valida um token de convite de participação de um projeto
	 *
	 * @param {string} validationToken
	 */
	validateEmailInvitation(validationToken) {
		return jwt.verify(
			validationToken,
			process.env.JWT_PUBLIC_KEY,
			function (error, decoded) {
				if (error) {
					return false;
				}

				// Verifica se o usuário existe
				const user = this.Controller.getService("users").getUserById(decoded.userId);
				if (!user) {
					return false;
				}

				// Verifica se o projeto existe
				const project = this.Controller.Service.getProjectById(decoded.projectId);
				if (!project) {
					return false;
				}

				// Adiciona o usuário ao projeto
				this.Controller.ProjectMembersInterface.addUserToProject(
					decoded.userId,
					decoded.projectId
				);

				return true;
			}.bind(this)
		);
	}
}

module.exports = ProjectInvitationComponent;
