class UserNotFound extends Error {
	constructor(message) {
		super(message);
	}
}

class WrongPassword extends Error {
	constructor(message) {
		super(message);
	}
}

class UserNotVerified extends Error {
	constructor(message) {
		super(message);
	}
}

class UserAlreadyLogged extends Error {
	constructor(message) {
		super(message);
	}
}

module.exports = {
	UserNotFound,
	WrongPassword,
	UserNotVerified,
	UserAlreadyLogged,
};
