class Bitmask {
	#value;

	constructor(value) {
		this.#value = value;
	}

	/**
	 * Retorna um objeto Bitmask a partir de uma lista de bits
	 *
	 * @param  {...number} bits
	 * @returns {Bitmask}
	 */
	static fromBits(...bits) {
		return new Bitmask(
			bits.reduce((accumulator, bit, index) => accumulator + (bit == 1 ? 2 ** (bits.length - index - 1) : 0), 0)
		);
	}

	/**
	 * Retorna uma lista contendo os bits do valor
	 *
	 * @returns {number[]}
	 */
	getBits() {
		const bits = [];

		for (let index = Math.floor(Math.log2(this.#value)) + 1; index > 0; index -= 1) {
			bits.push(this.isBitSet(index - 1) ? 1 : 0);
		}

		return bits;
	}

	/**
	 * Indica se o bit na posição informada está setado
	 *
	 * @param {number} position
	 */
	isBitSet(position) {
		return (this.#value & (1 << position)) !== 0;
	}

	/**
	 * Marca o bit na posição informada como 1
	 *
	 * @param {number} position
	 */
	setBit(position) {
		this.#value = this.#value | (1 << position);
	}

	/**
	 * Reseta o valor do bit na posição informada
	 *
	 * @param {number} position
	 */
	clearBit(position) {
		this.#value = this.#value & ~(1 << position);
	}

	/**
	 * Inverte o valor do bit na posição informada
	 *
	 * @param {number} position
	 */
	toggleBit(position) {
		this.#value = this.#value ^ (1 << position);
	}

	/**
	 * Verifica se este bitmask contém todos os bits do bitmask informado
     * 
	 * @param {Bitmask} bitmask
	 * @returns {boolean}
	 */
	has(bitmask) {
		return (this.#value & bitmask.#value) === bitmask.#value;
	}
}

module.exports = Bitmask;
