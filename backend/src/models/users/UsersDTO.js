class UsersDTO {
	constructor(user) {
		this.userId = user?.userId;
		this.firstName = user?.firstName;
		this.lastName = user?.lastName;
		this.email = user?.email;
		this.phoneNumber = user?.phoneNumber;
		this.password = user?.password;
		this.sessionToken = user?.sessionToken;
		this.emailValidationToken = user?.emailValidationToken;
		this.passwordResetToken = user?.passwordResetToken;
		this.emailVerified = user?.emailVerified;
	}

	toEntity() {
		return {
			userId: this.userId,
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			phoneNumber: this.phoneNumber,
			password: this.password,
			sessionToken: this.sessionToken,
			emailValidationToken: this.emailValidationToken,
			passwordResetToken: this.passwordResetToken,
			emailVerified: this.emailVerified,
		};
	}

	static fromEntity(entity) {
		return new UsersDTO(entity);
	}
}

module.exports = UsersDTO;
