const Session = require("../../context/session/Session");

const Repository = require("../__types/Repository");

const UsersDTO = require("./UsersDTO");
const UsersEntity = require("./UsersEntity");

const { Validate } = require("../../context/decorators/input-validator/InputValidator");

const { UserNotFound, WrongPassword, UserNotVerified, UserAlreadyLogged } = require("../../context/exceptions/users-repository/Exceptions");

class UsersRepository extends Repository {
	constructor(service) {
		super(service, UsersDTO);
	}

	/**
	 * Pegar um usuário pelo email do banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @returns {UsersDTO}
	 */
	async getUserByEmail(usersDTO) {
		return await this.Repository.createQueryBuilder("Users").where(`email = :email`, usersDTO).getOne();
	}

	/**
	 * Pega um usuário pelo id do banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @returns {UsersDTO}
	 */
	async getUserById(usersDTO) {
		return await this.Repository.createQueryBuilder("Users").where(`userId = :userId`, usersDTO).getOne();
	}

	/**
	 * Realiza o registro de um novo usuário no banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 */
	@Validate({ NAME: "firstName", TYPE: "string", LENGTH: 100, VALIDATOR: "name" })
	@Validate({ NAME: "lastName", TYPE: "string", LENGTH: 100, VALIDATOR: "name" })
	@Validate({ NAME: "email", TYPE: "string", LENGTH: 100, VALIDATOR: "email" })
	@Validate({ NAME: "phoneNumber", TYPE: "string", LENGTH: 20, VALIDATOR: "phone" })
	@Validate({ NAME: "password", TYPE: "string", LENGTH: 40, VALIDATOR: "password" })
	async register(usersDTO) {
		return await this.Repository.createQueryBuilder("Users").insert().into("Users").values(usersDTO).execute();
	}

	/**
	 * Realiza o login de um usuário no banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @returns {UsersDTO}
	 */
	async login(usersDTO) {
		const user = await this.getUserByEmail(usersDTO);
		if (!user) {
			throw new UserNotFound();
		}

		// Verifica se a senha está correta
		if (user.password != usersDTO.password) {
			throw new WrongPassword();
		}

		// Verifica se o email do usuário foi verificado
		if (!user.emailVerified) {
			throw new UserNotVerified();
		}

		// Verifica se o usuário já está logado
		if (user.sessionToken != undefined) {
			throw new UserAlreadyLogged();
		}

		const session = Session.newSession(user);
		console.log(`Nova sessão criada para o email: ${user.email} JWT: ${session}`);

		// Atualiza o token de sessão do usuário no banco de dados
		await this.Repository.createQueryBuilder("Users").update().set({ sessionToken: session }).where(`userId = :userId`, user).execute();

		// Atualiza o token de sessão do usuário no objeto
		user.sessionToken = session;

		return user;
	}

	/**
	 * Realiza o logout de um usuário no banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @returns {UsersDTO}
	 */
	async logout(usersDTO) {
		const user = await this.getUserById(usersDTO);
		if (!user) {
			throw new UserNotFound();
		}

		const updateQuery = this.Repository.createQueryBuilder("Users")
			.update()
			.set({ sessionToken: null })
			.where(`userId = :userId`, usersDTO)
			.execute();

		updateQuery
			.then(() => console.log(`Sessão encerrada para o email: ${user.email}`))
			.catch(() => console.error(`Falha ao encerrar sessão para o email: ${user.email}`));

		return user;
	}
}

module.exports = UsersRepository;
