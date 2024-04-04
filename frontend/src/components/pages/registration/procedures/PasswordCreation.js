import React, { useRef, useState, useEffect } from "react";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "./../InputFieldContainer";
import PasswordField from "../input-types/password/PasswordField";
import PasswordFieldStrength from "../input-types/password/PasswordFieldStrength";

import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";

import "./../Registration.css";
import "./PasswordCreation.css";

const PasswordCreation = React.forwardRef(({ nextProcedure, previousProcedure }, ref) => {
	const [matchingPassword, setMatchingPassword] = useState(false);

	const passwordFieldReference = useRef(null);
	const passwordConfirmationFieldReference = useRef(null);

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation =
			passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		setMatchingPassword(password == passwordConfirmation);
	}

	useEffect(() => {
		passwordFieldReference.current.onPasswordChange(onPasswordsChange);
		passwordConfirmationFieldReference.current.onPasswordChange(onPasswordsChange);
	}, []);

	return (
		<div>
			<div className="forms-container-holder fluida-background-waves-container">
				<div className="forms-container-holder fluida-identity-fish-container">
					<div className="forms-container">
						<form className="forms">
							<div>
								<h3 className="registration-header">Crie uma senha.</h3>
							</div>

							<div>
								<InputFieldContainer description="Digite a sua senha.">
									<PasswordField
										ref={passwordFieldReference}
										name="password"
										placeholder="Digite uma senha forte"
									/>
								</InputFieldContainer>

								<InputFieldContainer
									description="Confirme a sua senha."
									grid_template_areas="password_confirmation_field"
								>
									<PasswordField
										ref={passwordConfirmationFieldReference}
										name="password"
										placeholder="Repita a senha"
										grid_area="password_confirmation_field"
									/>
								</InputFieldContainer>

								{!matchingPassword ? (
									<InputFieldError error="Senhas não coincidem." />
								) : null}

								<PasswordFieldStrength ref={passwordFieldReference} />

								<div className="registration-button">
									<button>Continuar</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

export default PasswordCreation;
