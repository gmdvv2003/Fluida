const { v4 } = require("uuid");

const Service = require("../__types/Service");
const Session = require("../../context/session/Session");

const UsersDTO = require("./UsersDTO");
const UserEntity = require("./UsersEntity");

// Repositório de usuários
const users = [];

// Repositório de notificações dos usuários
const usersNotifications = [];

class UsersService extends Service {
	// ==================================== Métodos Privados ==================================== //
	get Notifications() {
		return usersNotifications;
	}

	/**
	 * Método utilizado como validador de sessão nas SecureRoutes
	 *
	 * @param {string} authorization
	 * @param {Map} decoded
	 * @returns {boolean}
	 */
	sessionValidator(authorization, decoded) {
		const { userId } = decoded;

		const user = this.getUserById(userId);
		if (!user) {
			return false;
		}

		if (user.session != authorization) {
			return false;
		}

		return true;
	}

	/**
	 * Pega um usuário pelo email
	 *
	 * @param {string} email
	 * @returns DTO do usuário caso o mesmo exista
	 */
	getUserByEmail(email) {
		const user = users.find((user) => user.email == email);
		return user && new UsersDTO(user);
	}

	// ==================================== Métodos Abertos ==================================== //
	/**
	 * Retorna todos os usuários
	 *
	 * @returns DTO do usuário
	 */
	getUsers() {
		return users.map((user) => new UsersDTO(user));
	}

	/**
	 * Pega um usuário pelo id
	 *
	 * @param {string} userId
	 * @returns DTO do usuário caso o mesmo exista
	 */
	getUserById(userId) {
		const user = users.find((user) => user.userId == userId);
		return user && new UsersDTO(user);
	}

	/**
	 * Tenta registrar um novo usuário
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	register(firstName, lastName, email, phoneNumber, password) {
		const userExists = users.some((user) => user.email == email);
		if (userExists) {
			return { success: false, message: "Usuário já cadastrado." };
		}

		// Try-catch para caso a validação da entidade falhe
		try {
			const user = new UserEntity(v4(), firstName, lastName, email, phoneNumber, password);
			users.push(user);
			return { success: true, user: user };
		} catch (error) {
			return { success: false, message: error.message };
		}
	}

	/**
	 * Tenta realizar o login de um usuário
	 *
	 * @param {string} email
	 * @param {string} password
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	login(email, password) {
		const user = users.find((user) => user.email == email && user.password == password);
		if (!user) {
			return {
				success: true,
				wrongEmailAndOrPassword: true,
				message: "Email ou senhas incorretos.",
			};
		}

		if (!user.verified) {
			return { success: false, message: "Usuário não verificado." };
		}

		if (user.session != null) {
			return { success: false, message: "Usuário já está logado." };
		}

		const session = Session.newSession(user);
		console.log(`Nova sessão criada para o email: ${email} JWT: ${session}`);

		// Associando o token da sessão criado ao usuário
		user.session = session;

		return { success: true, session: session };
	}

	// ==================================== Métodos Seguros ==================================== //

	/**
	 * Tenta realizar o logout de um usuário
	 *
	 * @param {string} token
	 * @returns Estrutura que diz se a ação foi bem sucedida ou não
	 */
	logoutAuthenticated(userId) {
		const user = this.getUserById(userId);
		if (!user) {
			return { success: false, message: "Usuário não encontrado." };
		}

		// Invalida a sessão do usuário
		Session.invalidate(user);

		return { success: true };
	}
}

module.exports = UsersService;