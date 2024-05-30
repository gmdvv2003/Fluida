function base64ToArrayBuffer(base64) {
	const binaryString = window.atob(base64);
	const bytes = new Uint8Array(binaryString.length);

	for (let byte = 0; byte < binaryString.length; byte += 1) {
		bytes[byte] = binaryString.charCodeAt(byte);
	}

	return bytes.buffer;
}

function arrayBufferToString(buffer) {
	return new TextDecoder().decode(buffer);
}

async function deriveKey(password, salt) {
	const importedKey = await window.crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveBits", "deriveKey"]
	);

	return window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 100000,
			hash: "SHA-256",
		},
		importedKey,
		{ name: "AES-CBC", length: 256 },
		true,
		["decrypt"]
	);
}

async function decryptDataWithKey(key, iv, encryptedBuffer) {
	return window.crypto.subtle.decrypt(
		{
			name: "AES-CBC",
			iv: iv,
		},
		key,
		encryptedBuffer
	);
}

/**
 * Desencripta dados utilizando PBKDF2 a partir de uma chave de criptografia simétrica
 *
 * @param {any} encryptedData
 * @param {string} key
 * @returns {string}
 */
async function decryptData(encryptedData, key) {
	// Extrai IV, salt e dados encriptados
	const [ivBase64, saltBase64, encryptedBase64] = encryptedData.split(":");

	const iv = base64ToArrayBuffer(ivBase64);
	const salt = base64ToArrayBuffer(saltBase64);
	const encryptedBuffer = base64ToArrayBuffer(encryptedBase64);

	// Deriva a chave usando PBKDF2
	const derivedKey = await deriveKey(key, salt);

	// Desencripta os dados
	const decrypted = await decryptDataWithKey(derivedKey, iv, encryptedBuffer);

	return arrayBufferToString(decrypted);
}

export { decryptData };
