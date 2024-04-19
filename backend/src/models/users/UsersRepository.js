const Repository = require("../__types/Repository");

const UsersEntity = require("./UsersEntity");

class UsersRepository extends Repository {
	constructor() {
		super(UsersEntity);
	}

	getUserByEmail() {}
	getUserById() {}
}

module.exports = UsersRepository;
