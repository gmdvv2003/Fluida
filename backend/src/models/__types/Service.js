const Controller = require("./Controller");

class Service {
	#controller;
	#service;

	/**
	 * @param {Controller} controller
	 */
	setController(controller) {
		this.#controller = controller;
	}

	/**
	 * @returns {Controller}
	 */
	getController() {
		return this.#controller;
	}

	/**
	 * @param {Service} service
	 */
	setService(service) {
		this.#service = service;
	}

	/**
	 * @returns {Service}
	 */
	getService() {
		return this.#service;
	}

	get Controller() {
		return this.#controller;
	}

	get Service() {
		return this.#service;
	}
}

module.exports = Service;
