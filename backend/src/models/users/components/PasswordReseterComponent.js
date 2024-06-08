const bcrypt = require("bcrypt");

const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");

const Session = require("../../../context/session/Session");
const UsersDTO = require("../UsersDTO");

class PasswordReseterComponent {
	Controller;

	constructor(controller) {
		this.Controller = controller;
	}

	/**
	 * Envia um email de reset de senha para o usuário
	 *
	 * @param {string} email
	 * @returns {Promise} Promise contendo informação sobre se o email foi enviado com sucesso
	 */
	async requestPasswordReset(email) {
		const user = await this.Controller.Service.getUserByEmail(email);
		if (!user || !user.emailVerified) {
			return { success: false };
		}

		// Cria um token de reset de senha para o usuário
		const token = Session.newSession({ email: user.email }, { expiresIn: "24h" });

		// Associa o token ao usuário
		user.passwordResetToken = token;

		try {
			const { affected } = await this.Controller.Service.updateUser(user, ["passwordResetToken"]);
			if (affected < 1) {
				return false;
			}
		} catch {
			return false;
		}

		// URL que ira redirecionar o usuário para a página de validação de email
		const resetUrl = global.__URLS__.resetPassword.edit({
			query: {
				token: token,
			},
		});

		return await EmailTransporter.send("ResetPassword", user, resetUrl);
	}

	/**
	 * Valida um token de reset de senha para um usuário
	 *
	 * @param {string} resetPasswordToken
	 * @param {string} newPassword
	 * @returns {Object} Estrutura que diz se a ação foi bem sucedida ou não
	 */
	async resetPassword(resetPasswordToken, newPassword) {
		const [validated, { email }] = Session.validate(resetPasswordToken);
		if (!validated) {
			return { success: false };
		}

		// Verifica se o usuário existe e se o token de reset de senha é válido
		const user = await this.Controller.Service.getUserByEmail(email);
		if (!user || user.passwordResetToken != resetPasswordToken) {
			return { success: false };
		}

		if (await bcrypt.compare(newPassword, user.password)) {
			return { success: false, samePasswordAsBefore: true };
		}

		const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.PASSWORD_SALT_ROUNDS));

		// Atualiza a senha do usuário
		user.password = hashedPassword;

		// Remove o token de reset de senha
		user.passwordResetToken = undefined;

		try {
			const { affected } = await this.Controller.Service.updateUser(user, ["password", "passwordResetToken"]);
			if (affected < 1) {
				return { success: false };
			}
		} catch {
			return { success: false };
		}

		return { success: true };
	}
}

module.exports = PasswordReseterComponent;
