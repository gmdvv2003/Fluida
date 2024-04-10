import "./SendPasswordReset.css";

import { useEffect, useRef, useState } from "react";

import EmailInputTypeValidator from "utilities/inputs-validators/models/EmailInputTypeValidator";
import Header from "components/shared/login-registration/header/Header";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import TextInputField from "../../shared/text-input-field/TextInputField";

function SendPasswordReset() {
	const emailFieldReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState("");

	const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);

	const [emailSent, setEmailSent] = useState(false);
	const [waitingForResponse, setWaitingForResponse] = useState(false);

	const [failedToSendEmail, setFailedToSendEmail] = useState(false);

	function handleSendButton() {
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
			fetch("http://localhost:8080/users/requestPasswordReset", {
				headers: { "Content-Type": "application/json" },
				mode: "cors",
				cache: "no-cache",
				credentials: "include",
				method: "PUT",
				body: JSON.stringify({ email: enteredEmail }),
			})
				.then(() => {
					setEmailSent(true);
				})
				.catch((error) => {
					setFailedToSendEmail(true);
					console.error(`Falha ao enviar email. Erro: ${error}`);
				})
				.finally(() => {
					setWaitingForResponse(false);
				});
		}
	}

	function handleOnEmailChange(event) {
		setEnteredEmail(event.target.value);
	}

	useEffect(() => {
		if (emailFieldReference.current != null) {
			return emailFieldReference.current.onTextChange(handleOnEmailChange);
		}
	});

	return (
		<div className="SPR-background-container">
			<Header />
			<div className="SPR-box-container">
				<div className="SPR-form-container" style={{ height: "35%", height: !emailSent ? "40%" : "30%" }}>
					<div className="SPR-form" style={{ width: "80%" }}>
						<h1 className="SPR-form-title">Esqueceu sua senha?</h1>
						<p className="SPR-form-description">
							Insira o email da sua conta, caso ele esteja correto, <br />
							você receberá um email para redefinição de senha.
						</p>
						{!emailSent && (
							<div style={{ width: "100%" }}>
								<TextInputField
									ref={emailFieldReference}
									container_style={{
										width: "100%",
										height: "50px",
									}}
									style={{ height: "100%", backgroundColor: "rgb(246, 246, 246)" }}
									placeholder="Endereço de email"
								/>
								{invalidEmailFormat && !invalidEmail && <InputFieldError error="O email informado é inválido." />}
								{invalidEmail && invalidEmailFormat && <InputFieldError error="Você deve preencher o campo do email." />}
							</div>
						)}
						{(() => {
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
									<button onClick={handleSendButton} className="SPR-button">
										Enviar email
									</button>
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
