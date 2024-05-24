import InputValidator from "./../InputValidator";

function nameValidator(input) {
	return /^[a-zA-Z\s]*$/.test(input);
}

export default new InputValidator(nameValidator);
