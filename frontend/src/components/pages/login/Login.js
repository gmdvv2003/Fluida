import "./../../shared/login-registration/background/Background.css";
import "./../../shared/login-registration/container/Container.css";
import "./Login.css";

import { useEffect, useRef, useState } from "react";

import { useAuthentication } from "context/AuthenticationContext";
import { ReactComponent as EmailIcon } from "assets/action-icons/email.svg";
import { ReactComponent as GoogleIcon } from "assets/action-icons/google-icon.svg";
import Header from "components/shared/login-registration/header/Header";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import PasswordField from "./input-types/PasswordField";
import TextInputField from "components/shared/text-input-field/TextInputField";
import LoadingDots from "components/shared/loading/LoadingDots";

function Login() {
	const emailFieldReference = useRef(null);
	const passwordFieldReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState(false);
	const [enteredPassword, setEnteredPassword] = useState(false);

	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);

	const [waitingForValidation, setWaitingForValidation] = useState(false);
	const [wrongCredentials, setWrongCredentials] = useState(false);

	const { login } = useAuthentication();

	function handleOnLoginButton() {
		setInvalidEmail(enteredEmail.length <= 0);
		setInvalidPassword(enteredPassword.length <= 0);

		if (invalidEmail || invalidPassword) {
			login(enteredEmail, enteredPassword)
				.then((result) => result.json())
				.then((data) => {
					if (data.wrongEmailAndOrPassword) {
						setWrongCredentials(true);
					}
				})
				.catch((error) => {})
				.finally(() => {
					setWaitingForValidation(false);
				});

			setWaitingForValidation(true);
		}
	}

	function handleOnEmailChange(event) {
		setEnteredEmail(event.target.value);
	}

	function handleOnPasswordChange(event) {
		setEnteredPassword(event.target.value);
	}

	useEffect(() => {
		const unbindEmailChangeSubscription = emailFieldReference.current.onTextChange(handleOnEmailChange);
		const unbindPasswordChangeSubscription = passwordFieldReference.current.onPasswordChange(handleOnPasswordChange);

		return () => {
			unbindEmailChangeSubscription();
			unbindPasswordChangeSubscription();
		};
	});

	return (
		<div>
			<Header />
			<div className="LR-C-forms-container-holder BG-fluida-background-waves-container">
				<div className="LR-C-forms-container-holder BG-fluida-identity-fish-container">
					<div className="LR-C-forms-container">
						<form className="LR-C-forms">
							<div className="L-login-form-title-container">
								<h1 className="L-login-form-title">Inicie sessão na sua conta</h1>
							</div>
							<div className="L-google-icon-container">
								<GoogleIcon className="L-google-icon" />
								<div className="L-login-form-google-button-container">
									<button className="L-login-form-google-button" type="button">
										Faça login com o Google.
									</button>
								</div>
							</div>
							<div>
								<h1 className="L-login-or-text">ou</h1>
							</div>

							<div className="L-left-email-icon-container">
								<div className="L-left-icon-container">
									<EmailIcon className="L-left-icon" />
								</div>
								<TextInputField
									ref={emailFieldReference}
									style={{
										borderTopLeftRadius: "0px",
										borderBottomLeftRadius: "0px",
										borderLeft: "none",
									}}
									name="email"
									placeholder="usuário/email"
								/>
							</div>

							{invalidEmail && !wrongCredentials && <InputFieldError error="Preencha este campo." />}

							<PasswordField ref={passwordFieldReference} />

							{invalidPassword && !wrongCredentials && <InputFieldError error="Preencha este campo." />}

							{wrongCredentials && <InputFieldError error="Email e usuário ou senha inválidos." />}

							<div className="L-login-form-reset-container">
								<a href="/send-password-reset" className="L-login-form-reset">
									Não consegue fazer login?
								</a>
							</div>
							<div className="L-start-session-button-container">
								<button onClick={handleOnLoginButton} type="button" className="L-start-session-button">
									Iniciar sessão
								</button>
							</div>
						</form>
					</div>
					<div className="L-register-form-container">
						<a href="/registration" className="L-register-form">
							Ainda não tem uma conta? <b className="L-register-here-text">Cadastre-se aqui.</b>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
