const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");

const Session = require("../../../context/session/Session");

class PasswordReseterComponent {
	controller;

	constructor(controller) {
		this.controller = controller;
	}

	/**
	 * Envia um email de reset de senha para o usuário
	 *
	 * @param {string} email
	 * @returns Promise contendo informação sobre se o email foi enviado com sucesso
	 */
	async requestPasswordReset(email) {
		const user = this.controller.UsersService.getUserByEmail(email);
		if (!user || !user.emailVerified) {
			return { success: false };
		}

		// Cria um token de reset de senha para o usuário
		const token = Session.newSession({ email: user.email });

		// Associa o token ao usuário
		user.passwordResetToken = token;

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
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	resetPassword(resetPasswordToken, newPassword) {
		return jwt.verify(
			resetPasswordToken,
			process.env.JWT_PUBLIC_KEY,
			function (error, decoded) {
				if (error) {
					return { success: false };
				}

				// Verifica se o usuário existe e se o token de reset de senha é válido
				const user = this.controller.UsersService.getUserByEmail(decoded.email);
				if (!user || user.passwordResetToken != resetPasswordToken) {
					return { success: false };
				}

				// TODO: Atualmente a senha no banco de dados esta descriptografada, então a comparação é feita diretamente
				if (user.password === newPassword) {
					return { success: false, samePasswordAsBefore: true };
				}

				// Atualiza a senha do usuário
				user.password = newPassword;

				// Remove o token de reset de senha
				user.passwordResetToken = undefined;

				return { success: true };
			}.bind(this)
		);
	}
}

module.exports = PasswordReseterComponent;
