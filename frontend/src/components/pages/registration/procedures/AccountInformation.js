import React, { useRef, useState, useEffect, useImperativeHandle } from "react";

import EmailInputTypeValidator from "utilities/inputs-validators/models/EmailInputTypeValidator";
import NameInputTypeValidator from "utilities/inputs-validators/models/NameInputTypeValidator";
import PhoneNumberInputTypeValidator from "utilities/inputs-validators/models/PhoneNumberInputTypeValidator";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "./../InputFieldContainer";
import TextInputField from "./../input-types/TextInputField";
import PhoneNumberField from "./../input-types/PhoneNumberField";

import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";

import "./../Registration.css";
import "./AccountInformation.css";

const AccountInformation = React.forwardRef(({ nextProcedure, previousProcedure }, ref) => {
	const emailFieldReference = useRef(null);
	const firstNameFieldReference = useRef(null);
	const lastNameFieldReference = useRef(null);
	const phoneNumberReference = useRef(null);

	const [invalidEmail, setInvalidEmail] = useState(true);
	const [invalidFirstName, setInvalidFirstName] = useState(true);
	const [invalidLastName, setInvalidLastName] = useState(true);
	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(true);

	function handleOnEmailChange(event) {
		setInvalidEmail(!EmailInputTypeValidator.validate(event.target.value));
	}

	function handleOnNameChange(event) {
		setInvalidFirstName(!NameInputTypeValidator.validate(event.target.value));
	}

	function handleOnLastNameChange(event) {
		setInvalidLastName(!NameInputTypeValidator.validate(event.target.value));
	}

	function handleOnPhoneNumberChange(event) {
		setInvalidPhoneNumber(!PhoneNumberInputTypeValidator.validate(event.target.value));
	}

	function handleOnContinueButton() {
		if (!invalidEmail && !invalidFirstName && !invalidLastName && !invalidPhoneNumber) {
			nextProcedure();
		}
	}

	useEffect(() => {
		emailFieldReference.current.onTextChange(handleOnEmailChange);
		firstNameFieldReference.current.onTextChange(handleOnNameChange);
		lastNameFieldReference.current.onTextChange(handleOnLastNameChange);
		phoneNumberReference.current.onTextChange(handleOnPhoneNumberChange);
	}, []);

	return (
		<div>
			<div className="LR-C-forms-container-holder BG-fluida-background-waves-container">
				<div className="LR-C-forms-container-holder BG-fluida-identity-fish-container">
					<div className="LR-C-forms-container">
						<form className="LR-C-forms">
							<div>
								<h3 className="R-registration-header">Crie sua conta. É grátis.</h3>
							</div>

							<div>
								<InputFieldContainer
									description="Insira o seu email de prefêrencia."
									grid_template_areas="email_field"
								>
									<TextInputField
										ref={emailFieldReference}
										name="email"
										placeholder="Insira um email válido"
										grid_area="email_field"
									/>
								</InputFieldContainer>
							</div>

							{invalidEmail && <InputFieldError error="Email inválido." />}

							<div>
								<InputFieldContainer
									description="Insira o nome e sobrenome."
									grid_template_areas="first_name last_name"
								>
									<TextInputField
										ref={firstNameFieldReference}
										name="name"
										placeholder="Primeiro nome"
										grid_area="first_name"
									/>
									<TextInputField
										ref={lastNameFieldReference}
										name="name"
										placeholder="Ultimo nome"
										grid_area="last_name"
									/>
								</InputFieldContainer>
							</div>

							{(invalidFirstName || invalidLastName) && (
								<InputFieldError error="Nome inválido." />
							)}

							<div>
								<InputFieldContainer description="Insira o seu número de telefone.">
									<PhoneNumberField ref={phoneNumberReference} />
								</InputFieldContainer>
							</div>

							{invalidPhoneNumber && (
								<InputFieldError error="Número de telefone inválido." />
							)}

							<div className="R-registration-button">
								<button type="button" onClick={handleOnContinueButton}>
									Continuar
								</button>
							</div>

							<div className="R-registration-footer">
								<a href="/login">
									Já possui uma conta? &nbsp;
									<span className="R-registration-footer-login-href">
										Entre aqui.
									</span>
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

export default AccountInformation;
