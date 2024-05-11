import "./../../shared/login-registration/background/Background.css";
import "./../../shared/login-registration/container/Container.css";
import "./Login.css";

import { useEffect, useRef, useState } from "react";

import { ReactComponent as EmailIcon } from "assets/action-icons/email.svg";
import { ReactComponent as GoogleIcon } from "assets/action-icons/google-icon.svg";
import Header from "components/shared/login-registration/header/Header";
import Background from "components/shared/login-registration/background/Background";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import Loading from "components/shared/loading/Loading";
import PasswordField from "./input-types/PasswordField";
import TextInputField from "components/shared/text-input-field/TextInputField";
import ActionButton from "components/shared/action-button/ActionButton";
import { useAuthentication } from "context/AuthenticationContext";

function Login() {
	const emailFieldReference = useRef(null);
	const passwordFieldReference = useRef(null);

	const [enteredEmail, setEnteredEmail] = useState("");
	const [enteredPassword, setEnteredPassword] = useState("");

	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);

	const [waitingForValidation, setWaitingForValidation] = useState(false);
	const [wrongCredentials, setWrongCredentials] = useState(false);
	const [somethingWentWrong, setSomethingWentWrong] = useState(false);

	const [emailFilled, setEmailFilled] = useState(false);
	const [passwordFilled, setPasswordFilled] = useState(false);

	const { login } = useAuthentication();

	async function handleOnLoginButton() {
		if (waitingForValidation) {
			return null;
		}

		const isEnteredEmailInvalid = enteredEmail.length <= 0;
		const isEnteredPasswordInvalid = enteredPassword.length <= 0;

		setInvalidEmail(isEnteredEmailInvalid);
		setInvalidPassword(isEnteredPasswordInvalid);

		if (!isEnteredEmailInvalid && !isEnteredPasswordInvalid) {
			setWaitingForValidation(true);

			// Realiza a requisição para o back
			const response = await login(enteredEmail, enteredPassword);
			if (response.success) {
				setWrongCredentials(response.data?.wrongEmailAndOrPassword);
			} else {
				setSomethingWentWrong(true);
			}

			// Finaliza o processo de login
			setWaitingForValidation(false);
		}
	}

	function handleOnEmailChange(event) {
		setEnteredEmail(event.target.value);
		setEmailFilled(event.target.value.length > 0);
	}

	function handleOnPasswordChange(event) {
		setEnteredPassword(event.target.value);
		setPasswordFilled(event.target.value.length > 0);
	}

	useEffect(() => {
		document.title = "Fluida | Login";

		const unbindEmailChangeSubscription =
			emailFieldReference.current.onTextChange(handleOnEmailChange);
		const unbindPasswordChangeSubscription =
			passwordFieldReference.current.onPasswordChange(handleOnPasswordChange);

		return () => {
			unbindEmailChangeSubscription();
			unbindPasswordChangeSubscription();
		};
	});

	return (
		<div>
			<Header />
			<Background />
			<div className="LR-C-forms-vertical-lock">
				<div className="LR-C-forms-horizontal-lock">
					<div className="LR-C-forms-container">
						<form className="LR-C-forms" style={{ width: "80%" }}>
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

							{invalidEmail && !wrongCredentials && (
								<InputFieldError error="Preencha este campo." />
							)}

							<PasswordField ref={passwordFieldReference} />

							{invalidPassword && !wrongCredentials && (
								<InputFieldError error="Preencha este campo." />
							)}
							{wrongCredentials && (
								<InputFieldError error="Email e usuário ou senha inválidos." />
							)}

							<div className="L-login-form-reset-container">
								<a href="/send-password-reset" className="L-login-form-reset">
									Não consegue fazer login?
								</a>
							</div>

							{waitingForValidation ? (
								<div className="L-start-session-waiting-for-response">
									<Loading />
								</div>
							) : (
								<div className="L-start-session-button-container">
									<ActionButton
										title="Iniciar sessão"
										is_active={emailFilled && passwordFilled}
										on_click={handleOnLoginButton}
									/>

									{somethingWentWrong ? (
										<InputFieldError error="Algo de errado ocorreu enquanto seu login era processado." />
									) : null}
								</div>
							)}
						</form>
					</div>
					<div className="L-register-form-container">
						<a href="/registration" className="L-register-form">
							Ainda não tem uma conta?&nbsp;
							<b className="L-register-here-text">Cadastre-se aqui.</b>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
