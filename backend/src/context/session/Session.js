const jwt = require("jsonwebtoken");

const ISSUER = "Fluida";
const AUDIENCE = ["All"];

const ALGORITHM = "RS256";
const EXPIRATION_TIME = "888888h"; // TODO: Garantir a atualização do token

const JWT_OPTIONS = {
	issuer: ISSUER,
	audience: AUDIENCE,
	algorithm: ALGORITHM,
	expiresIn: EXPIRATION_TIME,
};

const privateKey = process.env.JWT_PRIVATE_KEY;
const publicKey = process.env.JWT_PUBLIC_KEY;

class Session {
	/**
	 * Cria uma nova sessão com os dados providos
	 *
	 * @param {Map} signatures
	 * @returns Novo token JWT
	 */
	static newSession(signatures = {}, options = {}) {
		return jwt.sign({ ...signatures }, privateKey, { ...JWT_OPTIONS, ...options });
	}

	/**
	 * Valida um token
	 *
	 * @param {Token} token
	 * @returns Estrutura que diz se o token foi ou não validado + o token decodificado
	 */
	static validate(token, expectedToken = null) {
		return jwt.verify(token, publicKey, JWT_OPTIONS, function (error, decoded) {
			if (error) {
				return [false, {}];
			}

			// Verifica se o token decoded é o esperado
			if (expectedToken !== null && token !== expectedToken) {
				return [false, {}];
			}

			return [true, decoded];
		});
	}
}

module.exports = Session;
