import InputValidator from "../InputValidator";

function phoneNumberValidator(input) {
	return true;
}

export default new InputValidator(phoneNumberValidator);
