const Service = require("./Service");

class Controller {
	#service;
	#servicesProvider;

	constructor(service, servicesProvider) {
		this.#service = service;
		this.#servicesProvider = servicesProvider;
	}

	/**
	 *
	 * @param {string} identifier
	 * @returns {Service}
	 */
	getService(identifier = null) {
		return (identifier && this.#servicesProvider.get(identifier)) || this.#service;
	}
}

module.exports = Controller;
