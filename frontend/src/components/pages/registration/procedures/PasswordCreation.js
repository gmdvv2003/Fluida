import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";
import "./../Registration.css";
import "./PasswordCreation.css";

import React, { useEffect, useRef, useState } from "react";

import { ReactComponent as GoBackArrowIcon } from "assets/action-icons/left-circle.svg";

import InputFieldContainer from "../../../shared/text-input-field/InputFieldContainer";
import PasswordField from "../../../shared/password-input-field/PasswordField";
import PasswordFieldStrength from "../../../shared/password-input-field/PasswordFieldStrength";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import Background from "components/shared/login-registration/background/Background";
import ActionButton from "components/shared/action-button/ActionButton";

const PasswordCreation = React.forwardRef(({ nextProcedure, previousProcedure, setState, getState }, ref) => {
	const passwordFieldReference = useRef(null);
	const passwordConfirmationFieldReference = useRef(null);
	const passwordStrengthFieldRefrence = useRef(null);

	const [enteredPassword, setEnteredPassword] = useState("");

	const [isPasswordNotSatisfied, setIsPasswordNotSatisfied] = useState(false);
	const [matchingPassword, setMatchingPassword] = useState(true);

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation = passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		setMatchingPassword(password == passwordConfirmation);

		const isPasswordSatisfied = passwordStrengthFieldRefrence.current.isPasswordSatisfied();
		setIsPasswordNotSatisfied(!isPasswordSatisfied);

		setEnteredPassword(password);
	}

	function handleOnContinueButton() {
		if (matchingPassword && !isPasswordNotSatisfied && enteredPassword.length > 0) {
			setState("password", enteredPassword);
			nextProcedure();
		}
	}

	useEffect(() => {
		const unbindPasswordChangeSubscription = passwordFieldReference.current.onPasswordChange(onPasswordsChange);
		const unbindPasswordConfirmationChangeSubscription =
			passwordConfirmationFieldReference.current.onPasswordChange(onPasswordsChange);

		return () => {
			unbindPasswordChangeSubscription();
			unbindPasswordConfirmationChangeSubscription();
		};
	});

	return (
		<div>
			<Background />
			<div className="LR-C-forms-vertical-lock">
				<div className="LR-C-forms-horizontal-lock">
					<div className="LR-C-forms-container">
						<div className="LR-C-forms" style={{ width: "80%" }}>
							<div>
								<h3 className="R-registration-header">Crie uma senha.</h3>
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

								{(() => {
									if (!matchingPassword) {
										return <InputFieldError error="Senhas não coincidem." />;
									}

									if (isPasswordNotSatisfied) {
										return <InputFieldError error="A senha não atende aos requisitos." />;
									}

									return null;
								})()}

								<PasswordFieldStrength field={passwordFieldReference} ref={passwordStrengthFieldRefrence} />

								<div className="R-registration-button">
									<ActionButton
										title="Criar conta"
										is_active={enteredPassword.length > 0}
										on_click={handleOnContinueButton}
									/>
								</div>

								<div className="R-go-back-button-container">
									<button onClick={previousProcedure} className="R-go-back-button">
										<GoBackArrowIcon />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default PasswordCreation;
