import React, { useState, useEffect } from "react";

import { ReactComponent as TickIcon } from "assets/action-icons/tick.svg";
import { ReactComponent as TickXIcon } from "assets/action-icons/tick-x.svg";

import PasswordStrengthValidador from "utilities/password-strength/PasswordStrengthValidator";

import "./PasswordFieldStrength.css";

const PasswordFieldStrength = React.forwardRef((_, ref) => {
	const [currentPassword, setCurrentPassword] = useState();
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

	useEffect(() => {
		ref.current.onPasswordChange(handleOnPasswordChange);
	});

	return (
		<div className="password-strength-container">
			{passwordStrengthValidador.getParameters().map((parameter) => {
				return (
					<div className="password-strength-requirement-container">
						<div className="password-strength-requirement">
							<a className="password-strength-description">{parameter.description}</a>
							{currentPassword && parameter.isSatisfied(currentPassword) ? (
								<TickIcon />
							) : (
								<TickXIcon />
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
});

export default PasswordFieldStrength;
