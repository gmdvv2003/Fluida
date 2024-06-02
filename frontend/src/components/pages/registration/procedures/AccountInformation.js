import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";
import "./../Registration.css";
import "./AccountInformation.css";

import React, { useEffect, useRef, useState } from "react";

import Background from "components/shared/login-registration/background/Background";
import EmailInputTypeValidator from "utilities/inputs-validators/models/EmailInputTypeValidator";
import InputFieldContainer from "../../../shared/text-input-field/InputFieldContainer";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import NameInputTypeValidator from "utilities/inputs-validators/models/NameInputTypeValidator";
import PhoneNumberField from "./../input-types/PhoneNumberField";
import PhoneNumberInputTypeValidator from "utilities/inputs-validators/models/PhoneNumberInputTypeValidator";
import TextInputField from "../../../shared/text-input-field/TextInputField";
import ActionButton from "components/shared/action-button/ActionButton";

import { IsEmailInUseEndpoint } from "utilities/Endpoints";

const AccountInformation = React.forwardRef(({ nextProcedure, previousProcedure, setState, getState }, ref) => {
	const emailFieldReference = useRef(null);
	const firstNameFieldReference = useRef(null);
	const lastNameFieldReference = useRef(null);
	const phoneNumberReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState(getState("email") || "");
	const [enteredFirstName, setEnteredFirstName] = useState("");
	const [enteredLastName, setEnteredLastName] = useState("");
	const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");

	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidFirstName, setInvalidFirstName] = useState(false);
	const [invalidLastName, setInvalidLastName] = useState(false);
	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);

	const [hasInvalidFields, setHasInvalidFields] = useState(false);
	const [emailInUse, setEmailInUse] = useState(false);

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
		const [isValid, formattedPhoneNumber] = PhoneNumberInputTypeValidator.validate(event.target.value);

		setInvalidPhoneNumber(!isValid);
		setEnteredPhoneNumber(event.target.value);
		setHasInvalidFields(false);

		phoneNumberReference.current.ref.current.value = formattedPhoneNumber;
	}

	async function handleOnContinueButton() {
		if (
			!invalidEmail &&
			!invalidFirstName &&
			!invalidLastName &&
			!invalidPhoneNumber &&
			enteredEmail.length > 0 &&
			enteredFirstName.length > 0 &&
			enteredLastName.length > 0 &&
			enteredPhoneNumber.length > 0
		) {
			setState("email", enteredEmail);
			setState("firstName", enteredFirstName);
			setState("lastName", enteredLastName);
			setState("phoneNumber", enteredPhoneNumber);

			// Verifica se o email já está em uso
			const response = await IsEmailInUseEndpoint("POST", JSON.stringify({ email: enteredEmail }));
			setEmailInUse(response.data?.isEmailInUse);

			if (!response.data?.isEmailInUse && response?.status === 200) {
				nextProcedure();
			}
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
			<Background />
			<div className="LR-C-forms-vertical-lock">
				<div className="LR-C-forms-horizontal-lock">
					<div className="LR-C-forms-container">
						<div className="LR-C-forms" style={{ width: "80%" }}>
							<div>
								<h3 className="R-registration-header">Crie sua conta. É grátis.</h3>
							</div>

							<div>
								<InputFieldContainer
									description="Insira o seu email de prefêrencia"
									grid_template_areas="email_field"
								>
									<TextInputField
										ref={emailFieldReference}
										name="email"
										placeholder="Email"
										grid_area="email_field"
										initial_text={enteredEmail}
									/>
								</InputFieldContainer>
							</div>

							{emailInUse && <InputFieldError error="Email já em uso." />}
							{invalidEmail && enteredEmail.length > 0 && <InputFieldError error="Email inválido." />}

							<div>
								<InputFieldContainer
									description="Insira seu nome e sobrenome"
									grid_template_areas="first_name last_name"
								>
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

							{((invalidFirstName && enteredFirstName.length > 0) ||
								(invalidLastName && enteredLastName.length > 0)) && <InputFieldError error="Nome inválido." />}

							<div>
								<InputFieldContainer description="Insira o seu número de telefone">
									<PhoneNumberField ref={phoneNumberReference} />
								</InputFieldContainer>
							</div>

							{invalidPhoneNumber && enteredPhoneNumber.length > 0 && (
								<InputFieldError error="Número de telefone inválido." />
							)}

							<div style={{ width: "100%" }}>
								{hasInvalidFields && <InputFieldError error="Por favor, preencha todos os campos." />}
								<div className="R-registration-button">
									<ActionButton
										title="Continuar"
										is_active={
											enteredEmail.length > 0 &&
											enteredFirstName.length > 0 &&
											enteredLastName.length > 0 &&
											enteredPhoneNumber.length > 0
										}
										on_click={handleOnContinueButton}
									/>
								</div>
							</div>

							<div className="R-registration-footer">
								<a href="/login">
									Já possui uma conta? &nbsp;
									<span className="R-registration-footer-login-href">Entre aqui.</span>
								</a>
							</div>
						</div>
					</div>
					<div className="R-container-offset"></div>
				</div>
			</div>
		</div>
	);
});

export default AccountInformation;
