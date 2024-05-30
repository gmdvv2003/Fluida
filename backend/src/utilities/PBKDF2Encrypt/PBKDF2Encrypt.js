const crypto = require("crypto");

/**
 * Encriptografa dados utilizando PBKDF2 utilizando uma chave de criptografia simétrica
 *
 * @param {any} data
 * @param {string} key
 * @param {number?} iterations
 * @param {number?} length
 * @returns {string}
 */
function encryptData(data, key, iterations = 100000, length = 32) {
	// Gera a chave de criptografia
	const salt = crypto.randomBytes(16);

	// Deriva a chave de criptografia
	const derivedKey = crypto.pbkdf2Sync(key, salt, iterations, length, "sha256");

	// Encrypt the data
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

	// Encripta os dados
	let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
	encrypted += cipher.final("base64");

	// Combina os dados encriptados com o IV e o salt
	const combinedData = `${iv.toString("base64")}:${salt.toString("base64")}:${encrypted}`;

	return combinedData;
}

export { encryptData };
