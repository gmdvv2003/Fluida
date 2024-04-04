import TextInputField from "./TextInputField";

import "./TextInputField.css";
import "./PhoneNumberField.css";

function PhoneNumberField() {
	return (
		<div className="phone-number-field-container">
			<div className="phone-number-country-flag-container">
				<select className="phone-number-country-flag text-input-field" />
			</div>

			<div className="phone-number-input-field">
				<TextInputField placeholder="Número de telefone" />
			</div>
		</div>
	);
}

export default PhoneNumberField;
