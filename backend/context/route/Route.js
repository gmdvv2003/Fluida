const Session = require("../session/Session");

class Route {
	/**
	 * Prepara uma nova rota
	 *
	 * @param {*} param0
	 * @param {Function} next
	 * @param {Object} binder
	 * @param {Array} decoder
	 * @returns Middleware
	 */
	static newRoute({ secure }, next, binder, decoder = []) {
		return secure
			? this.#secureRoute(next.bind(binder), decoder)
			: this.#unsecureRoute(next.bind(binder));
	}

	/**
	 * Cria um middleware para uma rota segura
	 *
	 * @param {Function} next
	 * @param {Array} decoder
	 * @returns Middleware
	 */
	static #secureRoute(next, decoder) {
		return async (request, response) => {
			// Pega o token de autorização que está no header
			const { authorization } = request.headers;
			if (!authorization) {
				return response.status(401).json({ message: "Não autorizado." });
			}

			// Realiza a validação do token + a inserção dos dados no request
			const [validated, decoded] = Session.validate(authorization);
			if (validated) {
				decoder.forEach((decode) => {
					try {
						request[decode] = decoded[decode];
					} catch (error) {
						console.error(`Falha ao inserir ${decode} no request. Erro: ${error}`);
					}
				});

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
