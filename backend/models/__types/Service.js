class Service {
	#controller;

	setController(controller) {
		this.#controller = controller;
	}

	getController() {
		return this.#controller;
	}
}

module.exports = Service;
