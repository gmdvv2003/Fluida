import React, { useState, useImperativeHandle } from "react";

import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "./../InputFieldContainer";
import TextInputField from "./../input-types/TextInputField";
import PhoneNumberField from "./../input-types/PhoneNumberField";

import "./../../../shared/login-registration/background/Background.css";
import "./../../../shared/login-registration/container/Container.css";

import "./../Registration.css";
import "./AccountInformation.css";

const AccountInformation = React.forwardRef(({ nextProcedure, previousProcedure }, ref) => {
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidName, setInvalidName] = useState(false);
	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);

	function handleOnContinueButton() {
		nextProcedure();
	}

	return (
		<div>
			<div className="forms-container-holder fluida-background-waves-container">
				<div className="forms-container-holder fluida-identity-fish-container">
					<div className="forms-container">
						<form className="forms">
							<div>
								<h3 className="registration-header">Crie sua conta. É grátis.</h3>
							</div>

							<div>
								<InputFieldContainer
									description="Insira o seu email de prefêrencia."
									grid_template_areas="email_field"
								>
									<TextInputField
										name="email"
										placeholder="Insira um email válido."
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
										name="name"
										placeholder="Primeiro nome"
										grid_area="first_name"
									/>
									<TextInputField
										name="name"
										placeholder="Ultimo nome"
										grid_area="last_name"
									/>
								</InputFieldContainer>
							</div>

							{invalidName && <InputFieldError error="Nome inválido." />}

							<div>
								<InputFieldContainer description="Insira o seu número de telefone.">
									<PhoneNumberField />
								</InputFieldContainer>
							</div>

							{invalidPhoneNumber && (
								<InputFieldError error="Número de telefone inválido." />
							)}

							<div className="registration-button">
								<button onClick={handleOnContinueButton}>Continuar</button>
							</div>

							<div className="registration-footer">
								<span>
									Já possui uma conta? &nbsp;
									<span className="registration-footer-login-href" href="/login">
										Entre aqui.
									</span>
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

export default AccountInformation;
