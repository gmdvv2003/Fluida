const Database = require("../../database/Database");

const { Repository: TypeormRepository } = require("typeorm");

class Repository extends TypeormRepository {
	#service;
	#repository;

	constructor(service, entity) {
		super(entity);

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
