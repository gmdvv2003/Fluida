const Service = require("./Service");

class Controller {
	#service;
	#servicesProvider;

	constructor(service, servicesProvider) {
		this.#service = service;
		this.#servicesProvider = servicesProvider;
	}

	/**
	 * Retorna o serviço do controller especificado.
	 *
	 * @param {string} identifier
	 * @returns {Service}
	 */
	getService(identifier = null) {
		return (identifier && this.#servicesProvider.get(identifier)) || this.#service;
	}

	/**
	 * Retorna o serviço do controller.
	 */
	get Service() {
		return this.#service;
	}
}

module.exports = Controller;
