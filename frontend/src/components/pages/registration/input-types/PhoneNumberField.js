import TextInputField from "./TextInputField";

import "./TextInputField.css";
import "./PhoneNumberField.css";

function PhoneNumberField() {
	return (
		<div className="R-PNF-phone-number-field-container">
			<div className="R-PNF-phone-number-country-flag-container">
				<select className="R-PNF-phone-number-country-flag R-TIF-text-input-field" />
			</div>

			<div className="R-PNF-phone-number-input-field">
				<TextInputField placeholder="Número de telefone" />
			</div>
		</div>
	);
}

export default PhoneNumberField;
