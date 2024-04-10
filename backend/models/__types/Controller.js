class Controller {
	#service;

	constructor(service) {
		this.#service = service;
	}

	getService() {
		return this.#service;
	}
}
