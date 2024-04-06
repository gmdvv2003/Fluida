import React from "react";

import FlagsImporter from "utilities/flags-importer/FlagsImporter";

import TextInputField from "components/shared/text-input-field/TextInputField";

import "./PhoneNumberField.css";

const PhoneNumberField = React.forwardRef(({}, ref) => {
	return (
		<div className="R-PNF-phone-number-field-container">
			<div className="R-PNF-phone-number-country-flag-container">
				<div className="R-PNF-phone-number-country-flag TIF-text-input-field">
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
