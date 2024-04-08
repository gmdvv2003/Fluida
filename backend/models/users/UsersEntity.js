class UserEntity {
	constructor(userId, firstName, lastName, email, phoneNumber, password) {
		if (!userId || !firstName || !lastName || !email || !phoneNumber || !password) {
			throw new Error("Todos os campos são obrigatórios.");
		}

		if (typeof firstName !== "string") {
			throw new Error("Nome deve ser uma string.");
		}

		if (typeof lastName !== "string") {
			throw new Error("Sobrenome deve ser uma string.");
		}

		if (typeof email !== "string") {
			throw new Error("Email deve ser uma string.");
		}

		if (typeof phoneNumber !== "string") {
			throw new Error("Telefone deve ser uma string.");
		}

		if (typeof password !== "string") {
			throw new Error("Senha deve ser uma string.");
		}

		const username = `${firstName} ${lastName}`.toLowerCase().replace(" ", "_");

		this.userId = userId;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.password = password;

		// Valores "dinâmicos" que são adicionados após a criação da entidade
		this.sessionToken = null;
		this.emailValidationToken = null;
		this.passwordResetToken = null;

		// Indica se o usuário foi verificado
		this.emailVerified = false;
	}
}

module.exports = UserEntity;
