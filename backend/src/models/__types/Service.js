class Service {
	#controller;

	constructor(controller = null) {
		this.setController(controller);
	}

	setController(controller) {
		this.#controller = controller;
	}

	getController() {
		return this.#controller;
	}
}

module.exports = Service;
