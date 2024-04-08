const Session = require("../session/Session");

class Route {
	/**
	 * Prepara uma nova rota
	 *
	 * @param {*} param0
	 * @param {Function} next
	 * @param {Function} decoder
	 * @returns Middleware
	 */
	static newRoute({ secure }, next, binder, decoder = () => {}) {
		return secure ? this.#secureRoute(next.bind(binder), decoder) : this.#unsecureRoute(next.bind(binder));
	}

	/**
	 * Cria um middleware para uma rota segura
	 *
	 * @param {Function} next
	 * @param {Function} decoder
	 * @returns Middleware
	 */
	static #secureRoute(next, decoder) {
		return async (request, response) => {
			const token = request.headers["authorization"];
			if (!token) {
				return response.status(401).json({ message: "Não autorizado." });
			}

			const [validated, decoded] = Session.validate(token);
			if (validated) {
				decoder(request, decoded);
				await next(request, response);
			}

			return response.status(500).json({ message: "Falha ao autenticar token." });
		};
	}

	/**
	 * Rota sem autenticação
	 * (Sem redirecionamento, somente para intuito ilustrativo)
	 *
	 * @param {Function} next
	 * @returns Middleware
	 */
	static #unsecureRoute(next) {
		return next;
	}
}

module.exports = Route;
