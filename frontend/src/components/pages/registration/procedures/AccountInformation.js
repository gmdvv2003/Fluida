import React, { useRef, useState, useEffect } from "react";

import EmailInputTypeValidator from "utilities/inputs-validators/models/EmailInputTypeValidator";
import NameInputTypeValidator from "utilities/inputs-validators/models/NameInputTypeValidator";
import PhoneNumberInputTypeValidator from "utilities/inputs-validators/models/PhoneNumberInputTypeValidator";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "../../../shared/text-input-field/InputFieldContainer";
import TextInputField from "../../../shared/text-input-field/TextInputField";
import PhoneNumberField from "./../input-types/PhoneNumberField";

import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";

import "./../Registration.css";
import "./AccountInformation.css";

const AccountInformation = React.forwardRef(({ nextProcedure, previousProcedure, setState }, ref) => {
	const emailFieldReference = useRef(null);
	const firstNameFieldReference = useRef(null);
	const lastNameFieldReference = useRef(null);
	const phoneNumberReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState();
	const [enteredFirstName, setEnteredFirstName] = useState();
	const [enteredLastName, setEnteredLastName] = useState();
	const [enteredPhoneNumber, setEnteredPhoneNumber] = useState();

	const [invalidEmail, setInvalidEmail] = useState(true);
	const [invalidFirstName, setInvalidFirstName] = useState(true);
	const [invalidLastName, setInvalidLastName] = useState(true);
	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(true);

	const [hasInvalidFields, setHasInvalidFields] = useState(false);

	function handleOnEmailChange(event) {
		setInvalidEmail(!EmailInputTypeValidator.validate(event.target.value));
		setEnteredEmail(event.target.value);
		setHasInvalidFields(false);
	}

	function handleOnNameChange(event) {
		setInvalidFirstName(!NameInputTypeValidator.validate(event.target.value));
		setEnteredFirstName(event.target.value);
		setHasInvalidFields(false);
	}

	function handleOnLastNameChange(event) {
		setInvalidLastName(!NameInputTypeValidator.validate(event.target.value));
		setEnteredLastName(event.target.value);
		setHasInvalidFields(false);
	}

	function handleOnPhoneNumberChange(event) {
		setInvalidPhoneNumber(!PhoneNumberInputTypeValidator.validate(event.target.value));
		setEnteredPhoneNumber(event.target.value);
		setHasInvalidFields(false);
	}

	function handleOnContinueButton() {
		if (!invalidEmail && !invalidFirstName && !invalidLastName && !invalidPhoneNumber) {
			setState("email", enteredEmail);
			setState("firstName", enteredFirstName);
			setState("lastName", enteredLastName);
			setState("phoneNumber", enteredPhoneNumber);
			nextProcedure();
		} else {
			setHasInvalidFields(true);
		}
	}

	useEffect(() => {
		const unbindEmailChangeSubscription = emailFieldReference.current.onTextChange(handleOnEmailChange);
		const unbindFirstNameChangeSubscription = firstNameFieldReference.current.onTextChange(handleOnNameChange);
		const unbindLastNameChangeSubscription = lastNameFieldReference.current.onTextChange(handleOnLastNameChange);
		const unbindPhoneNumberChangeSubscription = phoneNumberReference.current.onTextChange(handleOnPhoneNumberChange);

		return () => {
			unbindEmailChangeSubscription();
			unbindFirstNameChangeSubscription();
			unbindLastNameChangeSubscription();
			unbindPhoneNumberChangeSubscription();
		};
	});

	return (
		<div>
			<div className="LR-C-forms-container-holder BG-fluida-background-waves-container">
				<div className="LR-C-forms-container-holder BG-fluida-identity-fish-container">
					<div className="LR-C-forms-container">
						<form className="LR-C-forms" style={{ width: "80%" }}>
							<div>
								<h3 className="R-registration-header">Crie sua conta. É grátis.</h3>
							</div>

							<div>
								<InputFieldContainer description="Insira o seu email de prefêrencia" grid_template_areas="email_field">
									<TextInputField ref={emailFieldReference} name="email" placeholder="Email" grid_area="email_field" />
								</InputFieldContainer>
							</div>

							{invalidEmail && <InputFieldError error="Email inválido." />}

							<div>
								<InputFieldContainer description="Insira seu nome e sobrenome" grid_template_areas="first_name last_name">
									<TextInputField
										ref={firstNameFieldReference}
										name="given-name"
										placeholder="Primeiro nome"
										grid_area="first_name"
									/>
									<TextInputField
										ref={lastNameFieldReference}
										name="family-name"
										placeholder="Último nome"
										grid_area="last_name"
									/>
								</InputFieldContainer>
							</div>

							{(invalidFirstName || invalidLastName) && <InputFieldError error="Nome inválido." />}

							<div>
								<InputFieldContainer description="Insira o seu número de telefone">
									<PhoneNumberField ref={phoneNumberReference} />
								</InputFieldContainer>
							</div>

							{invalidPhoneNumber && <InputFieldError error="Número de telefone inválido." />}

							<div style={{ width: "100%" }}>
								{hasInvalidFields && <InputFieldError error="Todos os campos devem ser preenchidos corretamente." />}
								<div className="R-registration-button">
									<button type="button" onClick={handleOnContinueButton}>
										Continuar
									</button>
								</div>
							</div>

							<div className="R-registration-footer">
								<a href="/login">
									Já possui uma conta? &nbsp;
									<span className="R-registration-footer-login-href">Entre aqui.</span>
								</a>
							</div>
						</form>
					</div>
					<div className="R-container-offset"></div>
				</div>
			</div>
		</div>
	);
});

export default AccountInformation;
