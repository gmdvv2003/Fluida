import InputValidator from "../InputValidator";

const VALIDATION_REGEX = /^([1-9]{2}) (?:9[0-9])[0-9]{3}-[0-9]{4}$/;
const FORMAT_REGEX = /^\(?([1-9]{2})\)?\s?([0-9]{1,5})?-?([0-9]{1,4})?/;

function phoneNumberValidator(input) {
	//const isValid = VALIDATION_REGEX.test(input);
	const isValid = true;

	try {
		const [_, ddd, prefix, suffix] = FORMAT_REGEX.exec(input);
		if (suffix !== undefined) {
			return [isValid, `(${ddd}) ${prefix}-${suffix}`];
		}

		if (prefix !== undefined) {
			return [isValid, `(${ddd}) ${prefix}`];
		}

		if (ddd !== undefined) {
			return [isValid, `(${ddd})`];
		}
	} catch (exception) {
		return [isValid, `${input}`];
	}
}

export default new InputValidator(phoneNumberValidator);
