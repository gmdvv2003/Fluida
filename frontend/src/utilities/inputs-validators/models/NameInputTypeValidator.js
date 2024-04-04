import InputValidator from "./../InputValidator";

function emailValidator(input) {
	return /^[a-zA-Z\s]*$/.test(input);
}

export default new InputValidator(emailValidator);
