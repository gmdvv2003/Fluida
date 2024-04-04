import Header from "components/shared/login-registration/header/Header";
import InputFieldContainer from "./InputFieldContainer";
import TextInputField from "./input-types/TextInputField";
import "./../../shared/login-registration/background/Background.css";
import "./../../shared/login-registration/container/Container.css";
import "./Login.css";
import { ReactComponent as GoogleIcon } from "assets/action-icons/google-icon.svg";
import { ReactComponent as EmailIcon } from "assets/action-icons/email.svg";
import { ReactComponent as PadlockIcon } from "assets/action-icons/padlock.svg";
import { ReactComponent as OpenEyeIcon } from "assets/action-icons/eye-open.svg";
import { ReactComponent as ClosedEyeIcon } from "assets/action-icons/eye-closed.svg";

function Login() {
	return (
		<div>
			<Header />
			<div className="LR-C-forms-container-holder BG-fluida-background-waves-container">
				<div className="LR-C-forms-container-holder BG-fluida-identity-fish-container">
					<div className="L-forms-column-container">
						<div className="LR-C-forms-container">
							<form className="LR-C-forms">
								<div className="L-login-form-title-container">
									<h1 className="L-login-form-title">
										Inicie sessão na sua conta
									</h1>
								</div>
								<div className="L-google-icon-container">
									<GoogleIcon className="L-google-icon" />
									<div className="L-login-form-google-button-container">
										<button
											className="L-login-form-google-button"
											type="button"
										>
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
									<InputFieldContainer>
										<TextInputField
											style={{
												borderTopLeftRadius: "0px",
												borderBottomLeftRadius: "0px",
												borderLeft: "none",
											}}
											name="email"
											placeholder="usuário/email"
										/>
									</InputFieldContainer>
								</div>
								<div className="L-left-password-icon-container">
									<div className="L-left-icon-container">
										<PadlockIcon className="L-left-icon" />
									</div>
									<InputFieldContainer>
										<TextInputField
											style={{
												borderTopLeftRadius: "0px",
												borderBottomLeftRadius: "0px",
												borderTopRightRadius: "0px",
												borderBottomRightRadius: "0px",
												borderLeft: "none",
												borderRight: "none",
											}}
											name="password"
											placeholder="senha"
										/>
									</InputFieldContainer>
									<div className="L-reveal-password-icon-container">
										<OpenEyeIcon className="L-reveal-password-icon" />
									</div>
								</div>
								<div className="L-login-form-reset-container">
									<href className="L-login-form-reset">
										Não consegue fazer login?
									</href>
								</div>
								<div className="L-start-session-button-container">
									<button type="button" className="L-start-session-button">
										Iniciar sessão
									</button>
								</div>
							</form>
						</div>
						<div className="L-register-form-container">
							<a href="/cadastro" className="L-register-form">
								Ainda não tem uma conta?{" "}
								<b className="L-register-here-text">Cadastre-se aqui.</b>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
