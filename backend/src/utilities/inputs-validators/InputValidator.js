const EmailValidator = require("./models/EmailTypeValidator");
const NameValidator = require("./models/NameInputTypeValidator");
const PasswordValidator = require("./models/PasswordTypeValidator");
const PhoneNumberValidator = require("./models/PhoneNumberTypeValidator");

class InputValidator {
	validatorFunction;

	constructor(validatorFunction) {
		this.validatorFunction = validatorFunction;
	}

	validate(input) {
		return this.validatorFunction(input);
	}
}

module.exports = {
	EmailTypeValidator: new InputValidator(EmailValidator),
	NameTypeValidator: new InputValidator(NameValidator),
	PasswordTypeValidator: new InputValidator(PasswordValidator),
	PhoneNumberTypeValidator: new InputValidator(PhoneNumberValidator),
};
