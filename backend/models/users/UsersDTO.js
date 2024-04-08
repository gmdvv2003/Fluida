class UsersDTO {
	constructor({
		userId,
		username,
		firstName,
		lastName,
		email,
		phoneNumber,
		password,
		sessionToken,
		emailValidationToken,
		passwordResetToken,
		emailVerified,
	}) {
		this.userId = userId;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.password = password;
		this.sessionToken = sessionToken;
		this.emailValidationToken = emailValidationToken;
		this.passwordResetToken = passwordResetToken;
		this.emailVerified = emailVerified;
	}
}

module.exports = UsersDTO;
