import "./PasswordFieldStrength.css";

import React, { useEffect, useImperativeHandle, useState } from "react";

import PasswordStrengthValidador from "utilities/password-strength/PasswordStrengthValidator";
import { ReactComponent as TickIcon } from "assets/action-icons/tick.svg";
import { ReactComponent as TickXIcon } from "assets/action-icons/tick-x.svg";

const PasswordFieldStrength = React.forwardRef(({ field }, ref) => {
	const [currentPassword, setCurrentPassword] = useState("");
	// const [passwordStrength, setPasswordStrength] = useState(0);

	const passwordStrengthValidador = new PasswordStrengthValidador({
		minLength: 8,
		requireUpperCase: true,
		requireNumber: true,
		requireSymbol: true,
	});

	function handleOnPasswordChange(event) {
		setCurrentPassword(event.target.value);
	}

	useImperativeHandle(ref, () => ({
		isPasswordSatisfied: () => {
			const parameters = passwordStrengthValidador.getParameters();
			return (
				parameters.length <=
				parameters.reduce((accumulation, parameter) => {
					return accumulation + (parameter.isSatisfied(currentPassword) ? 1 : 0);
				}, 0)
			);
		},
	}));

	useEffect(() => {
		return field.current.onPasswordChange(handleOnPasswordChange);
	});

	return (
		<div className="R-PFS-password-strength-container">
			{passwordStrengthValidador.getParameters().map((parameter) => {
				const isValidated = currentPassword && parameter.isSatisfied(currentPassword);
				return (
					<div className="R-PFS-password-strength-requirement-container">
						<div className="R-PFS-password-strength-requirement">
							<a
								className={`R-PFS-password-strength-description " ${
									isValidated ? "R-PFS-validated-strength-text" : ""
								}`}
							>
								{parameter.description}
							</a>
							{isValidated ? <TickIcon /> : <TickXIcon />}
						</div>
					</div>
				);
			})}
		</div>
	);
});

export default PasswordFieldStrength;
