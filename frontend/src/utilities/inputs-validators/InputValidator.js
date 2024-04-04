class InputValidator {
	#validatorFunction;

	constructor(validatorFunction) {
		this.#validatorFunction = validatorFunction;
	}

	validate(input) {
		return this.#validatorFunction(input);
	}
}

export default InputValidator;
