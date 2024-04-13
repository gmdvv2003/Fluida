const Controller = require("../__types/Controller");

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
		this.getService().setController(this);

		// Inicializa os componentes do controller
		this.#EmailValidatorComponent = new EmailValidatorComponent(this);
		this.#PasswordReseterComponent = new PasswordReseterComponent(this);
		this.#UserSettingsComponent = new UserSettingsComponent(this);

		// Inicializa as funcionalidades do controller
	}

	// ==================================== Métodos publicos ==================================== //
	/**
	 * Retorna todos os usuários ao requisitante
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async getUsers(_, response) {
		response.status(200).json(this.getService().getUsers());
	}

	/**
	 * Pega um usuário pelo id para o requisitante
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async getUserById(request, response) {
		const { userId } = request.params;

		const user = this.getService().getUserById(userId);
		if (!user) {
			return response.status(404).json({ message: "Usuário não encontrado." });
		}

		response.json(user);
	}

	/**
	 * Realiza o registro de um novo usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async register(request, response) {
		const { firstName, lastName, email, phoneNumber, password } = request.body;

		const result = this.getService().register(firstName, lastName, email, phoneNumber, password);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		// TODO: Garantir que o email seja enviado em caso de falha
		this.#EmailValidatorComponent
			.sendValidationEmail(result.user)
			.then(() => {
				console.log(`Email de validação enviado para ${result.user.email}`);
			})
			.catch((error) => {
				console.error(`Falha ao enviar email de validação. Erro: ${error}`);
			});

		response.status(201).json({ message: "Usuário cadastrado com sucesso.", successfullyRegistered: true });
	}

	/**
	 * Realiza o login de um usuário
	 *
	 * @param {Request} request
	 * @param {Response} response
	 */
	async login(request, response) {
		const { email, password } = request.body;

		const result = this.getService().login(email, password);
		if (!result.success) {
			return response.status(400).json({ message: result.message });
		}

		response.status(200).json(result.user);
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

		const result = this.getService().logoutAuthenticated(userId);
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
			const success = this.#EmailValidatorComponent.validateValidationEmail(token);
			if (!success) {
				return response.status(400).json({ message: "Falha ao validar email. Token inválido." });
			}

			return response.status(200).json({ message: "Email validado com sucesso.", isValidated: true });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao validar email. Erro: ${error}` });
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
			return response.status(201);
		}

		try {
			await this.#PasswordReseterComponent.requestPasswordReset(email);
		} catch (error) {
			console.error(`Falha ao solicitar reset de senha. Erro: ${error}`);
		}

		return response.status(201);
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
			const result = this.#PasswordReseterComponent.resetPassword(token, newPassword);
			if (!result.success) {
				return response.status(400).json({ message: "Falha ao resetar senha." });
			}

			if (result.samePasswordAsBefore) {
				return response.status(200).json({ message: "Senha igual a anterior.", samePasswordAsBefore: true });
			}

			return response.status(200).json({ message: "Senha resetada com sucesso." });
		} catch (error) {
			return response.status(400).json({ message: `Falha ao resetar senha. Erro: ${error}` });
		}
	}
}

module.exports = UsersController;
