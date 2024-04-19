const { Server } = require("socket.io");
const Session = require("../session/Session");

class SocketRoute {
	/**
	 * Prepara uma nova rota de socket
	 *
	 * @param {Server} io
	 * @param {Object} binder
	 * @param {Array} decoder
	 */
	static newSecureSocketRoute(io, binder, decoder = []) {
		io.use((socket, next) => {
			// Extrai os tokens do handshake
			const { socketToken, sessionToken } = socket.handshake.auth;

			if (!socketToken || !sessionToken) {
				return next(new Error("Não autorizado."));
			}

			// Valida ambos os tokens para garantir que o usuário é quem diz ser
			const [socketTokenValidated, socketTokenDecoded] = Session.validate(socketToken);
			const [sessionTokenValidated, sessionTokenDecoded] = Session.validate(sessionToken);

			if (socketTokenValidated && sessionTokenValidated) {
				// Insere os dados no socket
				decoder.forEach((decode) => {
					try {
						socket[decode] = socketTokenDecoded[decode] || sessionTokenDecoded[decode];
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
