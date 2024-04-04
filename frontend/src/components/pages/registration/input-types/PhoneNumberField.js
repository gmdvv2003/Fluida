import React from "react";

import FlagsImporter from "utilities/flags-importer/FlagsImporter";

import TextInputField from "./TextInputField";

import "./TextInputField.css";
import "./PhoneNumberField.css";

const PhoneNumberField = React.forwardRef(({}, ref) => {
	return (
		<div className="R-PNF-phone-number-field-container">
			<div className="R-PNF-phone-number-country-flag-container">
				<div className="R-PNF-phone-number-country-flag R-TIF-text-input-field">
					{FlagsImporter.Brazil({ width: "100%", height: "100%" })}
				</div>
			</div>

			<div className="R-PNF-phone-number-input-field">
				<TextInputField ref={ref} placeholder="Número de telefone" />
			</div>
		</div>
	);
});

export default PhoneNumberField;
