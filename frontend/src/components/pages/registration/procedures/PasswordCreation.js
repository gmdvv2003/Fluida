import React, { useRef, useState, useEffect } from "react";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "../../../shared/text-input-field/InputFieldContainer";
import PasswordField from "../../../shared/password-input-field/PasswordField";
import PasswordFieldStrength from "../../../shared/password-input-field/PasswordFieldStrength";

import { ReactComponent as GoBackArrowIcon } from "assets/action-icons/left-circle.svg";

import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";

import "./../Registration.css";
import "./PasswordCreation.css";

const PasswordCreation = React.forwardRef(({ nextProcedure, previousProcedure }, ref) => {
	const passwordFieldReference = useRef(null);
	const passwordConfirmationFieldReference = useRef(null);

	const [matchingPassword, setMatchingPassword] = useState(true);

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation = passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		setMatchingPassword(password == passwordConfirmation);
	}

	useEffect(() => {
		const unbindPasswordChangeSubscription = passwordFieldReference.current.onPasswordChange(onPasswordsChange);

		const unbindPasswordConfirmationChangeSubscription = passwordConfirmationFieldReference.current.onPasswordChange(onPasswordsChange);

		return () => {
			unbindPasswordChangeSubscription();
			unbindPasswordConfirmationChangeSubscription();
		};
	});

	return (
		<div>
			<div className="LR-C-forms-container-holder BG-fluida-background-waves-container">
				<div className="LR-C-forms-container-holder BG-fluida-identity-fish-container">
					<div className="LR-C-forms-container">
						<form className="LR-C-forms" style={{ width: "80%" }}>
							<div>
								<h3 className="R-registration-header">Crie uma senha.</h3>
							</div>

							<div>
								<InputFieldContainer description="Digite a sua senha.">
									<PasswordField ref={passwordFieldReference} name="password" placeholder="Digite uma senha forte" />
								</InputFieldContainer>

								<InputFieldContainer description="Confirme a sua senha." grid_template_areas="password_confirmation_field">
									<PasswordField
										ref={passwordConfirmationFieldReference}
										name="password"
										placeholder="Repita a senha"
										grid_area="password_confirmation_field"
									/>
								</InputFieldContainer>

								{!matchingPassword ? <InputFieldError error="Senhas não coincidem." /> : null}

								<PasswordFieldStrength ref={passwordFieldReference} />

								<div className="R-registration-button">
									<button type="button">Continuar</button>
								</div>

								<div className="R-go-back-button-container">
									<button onClick={previousProcedure} className="R-go-back-button">
										<GoBackArrowIcon />
									</button>
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
