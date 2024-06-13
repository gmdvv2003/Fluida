import "./SendPasswordReset.css";

import { useEffect, useRef, useState } from "react";

import EmailInputTypeValidator from "utilities/inputs-validators/models/EmailInputTypeValidator";
import Header from "components/shared/login-registration/header/Header";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import ActionButton from "components/shared/action-button/ActionButton";
import LoadingDots from "components/shared/loading/LoadingDots";
import TextInputField from "../../shared/text-input-field/TextInputField";

import { RequestPasswordResetEndpoint } from "utilities/Endpoints";

function SendPasswordReset() {
	const emailFieldReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState("");

	const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);

	const [emailSent, setEmailSent] = useState(false);
	const [waitingForResponse, setWaitingForResponse] = useState(false);

	const [failedToSendEmail, setFailedToSendEmail] = useState(false);

	async function handleSendButton() {
		if (waitingForResponse) {
			return false;
		}

		// Impede que o usuário clique no botão enquanto a requisição está sendo feita
		setWaitingForResponse(true);

		const isValidEmailFormat = EmailInputTypeValidator.validate(enteredEmail);
		const isInvalidEmail = enteredEmail.length <= 0;

		setInvalidEmailFormat(!isValidEmailFormat);
		setInvalidEmail(isInvalidEmail);

		if (isValidEmailFormat && !isInvalidEmail) {
			// Realiza a requisição para o back
			const response = await RequestPasswordResetEndpoint("PUT", JSON.stringify({ email: enteredEmail }));
			if (response.success) {
				setEmailSent(true);
			} else {
				setFailedToSendEmail(true);
			}
		}

		setWaitingForResponse(false);
	}

	function handleOnEmailChange(event) {
		setEnteredEmail(event.target.value);
	}

	useEffect(() => {
		document.title = "Fluida | Reset Password";

		if (emailFieldReference.current != null) {
			return emailFieldReference.current.onTextChange(handleOnEmailChange);
		}
	});

	return (
		<div className="SPR-background-container">
			<Header />
			<div className="SPR-box-container">
				<div className="SPR-form-container" style={{ height: emailSent && "100px" }}>
					<div className="SPR-form">
						{!emailSent && (
							<div>
								<h2 className="SPR-form-title">Esqueceu sua senha?</h2>
								<h5 className="SPR-form-description">
									Insira o email da sua conta, caso ele esteja correto, você receberá um email para redefinição de senha.
								</h5>
							</div>
						)}
						{!emailSent && (
							<div style={{ width: "100%" }}>
								<TextInputField
									ref={emailFieldReference}
									container_style={{
										width: "100%",
										height: "50px",
									}}
									style={{
										height: "100%",
										backgroundColor: "rgb(246, 246, 246)",
									}}
									placeholder="Endereço de email"
								/>
								{invalidEmailFormat && !invalidEmail && <InputFieldError error="O email informado é inválido." />}
								{invalidEmail && invalidEmailFormat && <InputFieldError error="Você deve preencher o campo do email." />}
							</div>
						)}
						{(() => {
							if (waitingForResponse) {
								return <LoadingDots scale={0.75} style={{ paddingTop: "20px" }} />;
							}

							if (failedToSendEmail) {
								return (
									<p className="SPR-form-description">
										Ocorreu um erro ao enviar o email. <br />
										Por favor, tente novamente mais tarde.
									</p>
								);
							}

							if (emailSent) {
								return (
									<p className="SPR-form-description">
										Um email foi enviado para o endereço informado. <br />
										Por favor, verifique sua caixa de entrada.
									</p>
								);
							}

							return (
								<div className="SPR-button-container">
									<ActionButton title="Enviar email" is_active={enteredEmail} on_click={handleSendButton} />
								</div>
							);
						})()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SendPasswordReset;
