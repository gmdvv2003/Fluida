const Session = require("../session/Session");

class SocketRoute {
	/**
	 * Prepara uma nova rota de socket
	 *
	 * @param {*} io
	 * @param {Object} binder
	 * @param {Array} decoder
	 */
	static newSecureSocketRoute(io, binder, decoder = []) {
		io.use((socket, next) => {
			const token = socket.handshake.auth.token;
			if (!token) {
				return next(new Error("Não autorizado."));
			}

			const [validated, decoded] = Session.validate(token);
			if (validated) {
				decoder.forEach((decode) => {
					try {
						socket[decode] = decoded[decode];
					} catch (error) {
						console.error(`Falha ao inserir ${decode} no socket. Erro: ${error}`);
					}
				});

				return next();
			}

			return next(new Error("Falha ao autenticar token."));
		});
	}
}

module.exports = SocketRoute;
