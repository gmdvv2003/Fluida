const Controller = require("./Controller");

class Service {
	#controller;

	constructor(controller = null) {
		this.setController(controller);
	}

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
}

module.exports = Service;
