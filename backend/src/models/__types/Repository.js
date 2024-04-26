const Database = require("../../database/Database");

const Service = require("./Service");

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

	/**
	 * @returns {Service}
	 */
	get Service() {
		return this.#service;
	}

	/**
	 * @returns {TypeormRepository}
	 */
	get Repository() {
		return this.#repository;
	}
}

module.exports = Repository;
