const bcrypt = require("bcrypt");

const Session = require("../../context/session/Session");

const Repository = require("../__types/Repository");

const UsersDTO = require("./UsersDTO");
const UsersEntity = require("./UsersEntity");

const { Validate } = require("../../context/decorators/input-validator/InputValidator");

const {
	UserNotFound,
	WrongPassword,
	UserNotVerified,
	UserAlreadyLogged,
} = require("../../context/exceptions/users-repository/Exceptions");
const { UpdateResult } = require("typeorm");

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
	 * Atualiza um usuário no banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @param {string[]} fieldsToUpdate
	 * @returns {UpdateResult}
	 */
	async updateUser(usersDTO, fieldsToUpdate) {
		if (fieldsToUpdate == undefined || fieldsToUpdate == undefined) {
			throw new Error("Parâmetros inválidos.");
		}

		return await this.Repository.createQueryBuilder("Users")
			.update()
			.set({
				...fieldsToUpdate.reduce((accumulator, field) => ({ ...accumulator, [field]: usersDTO[field] }), {}),
			})
			.where(`userId = :userId`, usersDTO)
			.execute();
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
		const hash = await bcrypt.hash(usersDTO.password, Number(process.env.PASSWORD_SALT_ROUNDS));
		return await this.Repository.createQueryBuilder("Users")
			.insert()
			.into("Users")
			.values({ ...usersDTO, password: hash })
			.execute();
	}

	/**
	 * Indica se um email já está em uso no banco de dados.
	 *
	 * @param {UsersDTO} usersDTO
	 * @returns {boolean}
	 */
	async isEmailInUse(usersDTO) {
		const user = await this.Repository.createQueryBuilder("Users").where(`email = :email`, usersDTO).getOne();
		return user != undefined;
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
		if (!(await bcrypt.compare(usersDTO.password, user.password))) {
			throw new WrongPassword();
		}

		// Verifica se o email do usuário foi verificado
		if (!user.emailVerified) {
			throw new UserNotVerified();
		}

		const session = Session.newSession({ userId: user.userId, email: user.email });

		// Atualiza o token de sessão do usuário no banco de dados
		await this.Repository.createQueryBuilder("Users")
			.update()
			.set({ sessionToken: session })
			.where(`userId = :userId`, user)
			.execute();

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

		// Para caso haja algum erro ao encerrar a sessão
		updateQuery.catch(() => console.error(`Falha ao encerrar sessão para o email: ${user.email}`));

		return user;
	}
}

module.exports = UsersRepository;
