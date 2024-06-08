const EmailTransporter = require("../../../context/nodemailer/EmailTransporter");
const UsersDTO = require("../UsersDTO");

const Session = require("../../../context/session/Session");

class EmailValidatorComponent {
	Controller;

	constructor(controller) {
		this.Controller = controller;
	}

	/**
	 * Envia um email de validação para o usuário
	 *
	 * @param {UsersDTO} user
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

		try {
			const { affected } = await this.Controller.Service.updateUser(user, ["emailValidationToken"]);
			if (affected < 1) {
				return false;
			}
		} catch {
			return false;
		}

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
	 * @param {UsersDTO} validationToken
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	async validateValidationEmail(validationToken) {
		const [validated, { userId }] = Session.validate(validationToken);
		if (!validated) {
			return false;
		}

		// Verifica se o usuário existe e se o email foi validado
		const user = await this.Controller.Service.getUserById(userId);
		if (!user || user.emailVerified || user.emailValidationToken != validationToken) {
			return false;
		}

		// Troca o valor que indica que o email foi validado
		user.emailVerified = true;

		try {
			const { affected } = await this.Controller.Service.updateUser(user, ["emailVerified"]);
			if (affected < 1) {
				return false;
			}
		} catch {
			return false;
		}

		return true;
	}
}

module.exports = EmailValidatorComponent;
