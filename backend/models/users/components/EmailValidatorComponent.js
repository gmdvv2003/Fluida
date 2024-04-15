const jwt = require("jsonwebtoken");

const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");
const UserEntity = require("../UsersEntity");

const Session = require("../../../context/session/Session");

class EmailValidatorComponent {
	controller;

	constructor(controller) {
		this.controller = controller;
	}

	/**
	 * Envia um email de validação para o usuário
	 *
	 * @param {UserEntity} user
	 * @returns Promise contendo informação sobre se o email foi enviado com sucesso
	 */
	async sendValidationEmail(user) {
		if (user.emailVerified) {
			return true;
		}

		// Cria um token de validação para o email
		const token = Session.newSession({ userId: user.userId }, { expiresIn: "24h" });

		// Associa o token ao usuário
		user.emailValidationToken = token;

		// URL que ira redirecionar o usuário para a página de validação de email
		const validationUrl = global.__URLS__.validateEmail.edit({
			query: {
				token: token,
			},
		});

		return await EmailTransporter.send("ValidateEmail", user, validationUrl);
	}

	/**
	 * Valida um token de validação de email para um usuário
	 *
	 * @param {UserEntity} validationToken
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	validateValidationEmail(validationToken) {
		return jwt.verify(
			validationToken,
			process.env.JWT_PUBLIC_KEY,
			function (error, decoded) {
				if (error) {
					return false;
				}

				// Verifica se o usuário existe e se o email foi validado
				const user = this.controller.UsersService.getUserById(decoded.userId);
				if (!user || user.emailVerified || user.emailValidationToken != validationToken) {
					return false;
				}

				// Troca o valor que indica que o email foi validado
				user.emailVerified = true;

				return true;
			}.bind(this)
		);
	}
}

module.exports = EmailValidatorComponent;
