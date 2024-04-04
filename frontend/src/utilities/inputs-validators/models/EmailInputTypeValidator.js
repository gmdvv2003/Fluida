import InputValidator from "./../InputValidator";

function emailValidator(input) {
	// https://www.w3resource.com/javascript/form/email-validation.php
	return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
}

export default new InputValidator(emailValidator);
