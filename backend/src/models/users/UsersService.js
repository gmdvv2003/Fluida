const Service = require("../__types/Service");

const UsersDTO = require("./UsersDTO");
const UsersRepository = require("./UsersRepository");

const {
	UserNotFound,
	WrongPassword,
	UserNotVerified,
	UserAlreadyLogged,
} = require("../../context/exceptions/users-repository/Exceptions");
const { InvalidInputParameter } = require("../../context/exceptions/repository-input-validator/Exceptions");

const PBKDF2Encrypt = require("../../utilities/PBKDF2Encrypt/PBKDF2Encrypt");

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
		return await this.#UsersRepository.getUserByEmail(new UsersDTO({ email }));
	}

	/**
	 * Pega um usuário pelo id.
	 *
	 * @param {number} userId
	 * @returns {UsersDTO}
	 */
	async getUserById(userId) {
		return await this.#UsersRepository.getUserById(new UsersDTO({ userId }));
	}

	/**
	 * Atualiza um usuário no banco de dados.
	 *
	 * @param {UsersDTO} userDTO
	 * @returns {UsersDTO}
	 */
	async updateUser(userDTO, fieldsToUpdate = []) {
		return await this.#UsersRepository.updateUser(userDTO, fieldsToUpdate);
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
	 * @returns {Object}
	 */
	async register(firstName, lastName, email, phoneNumber, password) {
		const userDTO = new UsersDTO({ firstName, lastName, email, phoneNumber, password });

		try {
			const { raw, identifiers } = await this.#UsersRepository.register(userDTO);
			if (raw?.affectedRows != 1) {
				return { success: false, message: "Erro ao registrar usuário." };
			}

			return { success: true, user: { ...userDTO, ...identifiers[0] } };
		} catch (error) {
			if (error instanceof InvalidInputParameter) {
				return { success: false, message: "Parâmetros inválidos." };
			}

			return { success: false, message: `Erro desconhecido. Erro: ${error}` };
		}
	}

	/**
	 * Verifica se um email já está em uso.
	 *
	 * @param {string} email
	 * @returns {Object}
	 */
	async isEmailInUse(email) {
		try {
			return {
				success: true,
				isEmailInUse: await this.#UsersRepository.isEmailInUse(new UsersDTO({ email })),
			};
		} catch (error) {
			return { success: false, message: `Erro desconhecido. Erro: ${error}` };
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

			// Adiciona a sessão a lista de sessões ativas
			ACTIVE_SESSIONS.set(user.userId, user.sessionToken);

			// Criptografa informações sensíveis que serão enviadas ao frontend
			return {
				success: true,
				data: PBKDF2Encrypt.encryptData(
					{
						userId: user.userId,
						firstName: user.firstName,
						lastName: user.lastName,
						phoneNumber: user.phoneNumber,
						email: user.email,
					},
					email + password
				),
				sessionToken: user.sessionToken,
			};
		} catch (error) {
			if (error instanceof UserNotFound || error instanceof WrongPassword) {
				return { success: false, message: "Usuário ou senha incorretos.", wrongEmailAndOrPassword: true };
			}

			if (error instanceof UserNotVerified) {
				return { success: false, message: "Usuário não verificado.", userNotVerified: true };
			}

			if (error instanceof UserAlreadyLogged) {
				return { success: false, message: "Usuário já logado.", userAlreadyLogged: true };
			}

			return { success: false, message: `Erro desconhecido. Erro: ${error}` };
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
