const Database = require("../../database/Database");
// if (Database.isInitialized) {
// 	throw new Error("Database is not initialized");
// }

const { Repository: BaseRepository } = require("typeorm");

class Repository extends BaseRepository {
	#service;
	#repository;

	constructor(service, entity) {
		super(entity)

		const repository = Database.getRepository(entity);

		this.#service = service;
		this.#repository = repository;
	}

	get Service() {
		return this.#service;
	}

	get Repository() {
		return this.#repository;
	}
}

module.exports = Repository;
