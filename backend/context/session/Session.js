// Tipos para linting
const UserEntity = require("../../models/users/UsersEntity");

const jwt = require("jsonwebtoken");

const ISSUER = "Fluida";
const AUDIENCE = ["All"];

const ALGORITHM = "RS256";
const EXPIRATION_TIME = "1h";

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
	 * Cria uma nova sessão para um usuário
	 *
	 * @param {UserEntity} user
	 * @returns Novo token JWT
	 */
	static newSession(user) {
		return jwt.sign({ userId: user.userId }, privateKey, JWT_OPTIONS);
	}

	/**
	 * Valida um token
	 *
	 * @param {Token} token
	 * @returns Estrutura que diz se o token foi ou não validado + o token decodificado
	 */
	static validate(token) {
		return jwt.verify(token, publicKey, JWT_OPTIONS, function (error, decoded) {
			if (error) {
				return [false, null];
			}

			return [true, decoded];
		});
	}

	/**
	 * Invalida a sessão de um usuário
	 *
	 * @param {UserEntity} user
	 */
	static invalidate(user) {
		user.session = null;
	}
}

module.exports = Session;
