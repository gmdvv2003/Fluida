const Controller = require("../__types/Controller");

const { retrieveUserProfileIcon } = require("../../database/content/users-profile-icons/UsersProfileIcons");

const PasswordReseterComponent = require("./components/PasswordReseterComponent");
const EmailValidatorComponent = require("./components/EmailValidatorComponent");
const UserSettingsComponent = require("./components/UserSettings/UserSettingsComponent");

const UsersService = require("./UsersService");

class UsersController extends Controller {
	#EmailValidatorComponent;
	#PasswordReseterComponent;
	#UserSettingsComponent;

	constructor(servicesProvider) {
		// Inicializa o controller e o serviço
		super(new UsersService(), servicesProvider);
		this.Service.setController(this);

		// Inicializa os componentes do controller
		this.#EmailValidatorComponent = new EmailValidatorComponent(this);
		this.#PasswordReseterComponent = new PasswordReseterComponent(this);
		this.#UserSettingsComponent = new UserSettingsComponent(this);
	}

	// ==================================== Métodos Publicos ==================================== //
	/**
	 * Realiza o registro de um novo usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async register(request, response) {
		const { firstName, lastName, email, phoneNumber, password } = request.body;

		const result = await this.Service.register(firstName, lastName, email, phoneNumber, password);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		// TODO: Garantir que o email seja enviado em caso de falha
		this.#EmailValidatorComponent.sendValidationEmail(result.user).catch((error) => {
			console.error(`Falha ao enviar email de validação. Erro: ${error}`);
		});

		response.status(201).json({ successfullyRegistered: true, message: "Usuário cadastrado com sucesso." });
	}

	/**
	 * Indica se um email já está em uso
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async isEmailInUse(request, response) {
		const { email } = request.body;
		if (!email) {
			return response.status(400).json({ message: "Email não encontrado na requisição." });
		}

		const result = await this.Service.isEmailInUse(email);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(200).json({ isEmailInUse: result.isEmailInUse });
	}

	/**
	 * Realiza o login de um usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async login(request, response) {
		const { email, password } = request.body;

		const result = await this.Service.login(email, password);
		if (!result.success) {
			return response.status(400).json({ ...result });
		}

		response.status(200).json({ ...result, redirect: global.__URLS__.home.url });
	}

	async getProfileIcon(request, response) {
		const { userId } = request.params;
		if (!userId) {
			return response.status(400).json({ message: "ID do usuário não encontrado na requisição." });
		}
	}

	// ==================================== Métodos Seguros ==================================== //

	/**
	 * Realiza o logout de um usuário autenticado
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async logoutAuthenticated(request, response) {
		const { userId } = request.body;

		const result = await this.Service.logout(userId);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(200).json({ message: "Logout realizado com sucesso." });
	}

	/**
	 * Altera as configurações de um usuário autenticado
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async alterSettingsAuthenticated(request, response) {
		const { userId, toAlter } = request.body;

		const result = this.#UserSettingsComponent.alterSettings(userId, toAlter);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(200).json({ message: "Configurações alteradas com sucesso.", altered: result.altered });
	}

	// ==================================== Métodos Intermediários ==================================== //
	/**
	 * Realiza a validação de um email
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async validateEmail(request, response) {
		const { token } = request.body;
		if (!token) {
			return response.status(400).json({ message: "Token não encontrado." });
		}

		try {
			const success = await this.#EmailValidatorComponent.validateValidationEmail(token);
			if (!success) {
				return response.status(400).json({ message: "Falha ao validar email. Token inválido." });
			}

			return response.status(200).json({ message: "Email validado com sucesso.", isValidated: true });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao validar email. Erro: ${error}` });
		}
	}

	/**
	 * Realiza o reenvio de um email de validação
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async requestValidationEmail(request, response) {
		const { email } = request.body;
		if (!email) {
			return response.status(400).json({ message: "Email não encontrado na requisição." });
		}

		const user = await this.Service.getUserByEmail(email);
		if (!user) {
			return response.status(400).json({ message: "Email não encontrado." });
		}

		try {
			const result = await this.#EmailValidatorComponent.sendValidationEmail(user);
			if (!result?.success) {
				return response.status(400).json({ message: result?.message });
			}

			return response.status(201).json({ message: "Email de validação reenviado com sucesso." });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao reenviar email de validação. Erro: ${error}` });
		}
	}

	/**
	 * Realiza a solicitação de reset de senha
	 * Todas as resposta de erro são 201 para evitar que um usuário mal intencionado saiba se um email está cadastrado ou não
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async requestPasswordReset(request, response) {
		const { email } = request.body;
		if (!email) {
			return response.status(400).json({ message: "Email não encontrado na requisição." });
		}

		try {
			const result = await this.#PasswordReseterComponent.requestPasswordReset(email);
			if (!result?.success) {
				return response.status(400).json({ message: "Falha ao solicitar reset de senha." });
			}

			return response.status(201).json({ message: "Solicitação de reset de senha realizada com sucesso." });
		} catch (error) {
			console.error(`Falha ao solicitar reset de senha. Erro: ${error}`);
		}
	}

	/**
	 * Realiza a troca da senha de um usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async resetPassword(request, response) {
		const { token, newPassword } = request.body;
		if (!token || !newPassword) {
			return response.status(400).json({ message: "Token ou nova senha não encontrados na requisição" });
		}

		try {
			const result = await this.#PasswordReseterComponent.resetPassword(token, newPassword);
			if (result?.samePasswordAsBefore) {
				return response.status(400).json({ message: "Senha igual a anterior.", samePasswordAsBefore: true });
			}

			if (!result?.success) {
				return response.status(400).json({ message: "Falha ao resetar senha." });
			}

			return response.status(200).json({ message: "Senha resetada com sucesso." });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao resetar senha. Erro: ${error}` });
		}
	}
}

module.exports = UsersController;
