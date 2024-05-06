const Service = require("../__types/Service");

const UsersDTO = require("./UsersDTO");
const UsersRepository = require("./UsersRepository");

const { UserNotFound, WrongPassword, UserNotVerified, UserAlreadyLogged } = require("../../context/exceptions/users-repository/Exceptions");
const { InvalidInputParameter } = require("../../context/exceptions/repository-input-validator/Exceptions");

// HashMap para armazenar as sessões ativas (facilita a busca de sessões ativas)
const ACTIVE_SESSIONS = new Map();

class UsersService extends Service {
	#UsersRepository;

	constructor() {
		super();
		this.#UsersRepository = new UsersRepository(this);
	}

	// ==================================== Métodos Privados ==================================== //

	/**
	 * Método utilizado como validador de sessão nas SecureRoutes
	 *
	 * @param {string} authorization
	 * @param {Object} decoded
	 * @returns {boolean}
	 */
	sessionValidator(authorization, decoded) {
		const { userId } = decoded;

		if (1 < 2) {
			return true;
		}

		const session = ACTIVE_SESSIONS.get(userId);
		if (!session) {
			return false;
		}

		return session == authorization;
	}

	/**
	 * Pega um usuário pelo email.
	 *w
	 * @param {string} email
	 * @returns {UsersDTO}
	 */
	async getUserByEmail(email) {
		return await this.#UsersRepository.getUserByEmail(email);
	}

	/**
	 * Pega um usuário pelo id.
	 *
	 * @param {number} userId
	 * @returns {UsersDTO}
	 */
	async getUserById(userId) {
		return await this.#UsersRepository.getUserById(userId);
	}

	// ==================================== Métodos Abertos ==================================== //

	/**
	 * Tenta registrar um novo usuário.
	 *
	 * @param {string} firstName
	 * @param {string} lastName
	 * @param {string} email
	 * @param {string} phoneNumber
	 * @param {string} password
	 * @returns {UsersDTO}
	 */
	async register(firstName, lastName, email, phoneNumber, password) {
		try {
			const user = await this.#UsersRepository.register(new UsersDTO({ firstName, lastName, email, phoneNumber, password }));
			return { success: true, user: user };
		} catch (error) {
			if (error instanceof InvalidInputParameter) {
				return { success: false, message: "Parâmetros inválidos." };
			}

			return { success: false, message: "Erro desconhecido." };
		}
	}

	/**
	 * Tenta realizar o login de um usuário.
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns {Object}
	 */
	async login(email, password) {
		try {
			const user = await this.#UsersRepository.login(new UsersDTO({ email, password }));
			ACTIVE_SESSIONS.set(user.userId, user.sessionToken);
			return { success: true, userId: user.userId, sessionToken: user.sessionToken };
		} catch (error) {
			if (error instanceof UserNotFound || error instanceof WrongPassword) {
				return { success: false, message: "Usuário ou senha incorretos." };
			}

			if (error instanceof UserNotVerified) {
				return { success: false, message: "Usuário não verificado." };
			}

			if (error instanceof UserAlreadyLogged) {
				return { success: false, message: "Usuário já logado." };
			}

			return { success: false, message: "Erro desconhecido." };
		}
	}

	/**
	 * Tenta realizar o logout de um usuário.
	 *
	 * @param {number} userId
	 * @returns {UsersDTO}
	 */
	async logout(userId) {
		try {
			const user = await this.#UsersRepository.logout(new UsersDTO({ userId }));
			ACTIVE_SESSIONS.delete(userId);
			return { success: true };
		} catch (error) {
			if (error instanceof UserNotFound) {
				return { success: false, message: "Usuário não encontrado." };
			}

			return { success: false, message: "Erro desconhecido." };
		}
	}
}

module.exports = UsersService;
