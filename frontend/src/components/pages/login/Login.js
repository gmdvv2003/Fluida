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
			<div className="forms-container-holder fluida-background-waves-container">
				<div className="forms-container-holder fluida-identity-fish-container">
					<div className="forms-col-container">
						<div className="forms-container">
							<form className="forms">
								<div className="login-form-title-container">
									<h1 className="login-form-title">Inicie sessão na sua conta</h1>
								</div>
								<div className="google-icon-container">
									<GoogleIcon className="google-icon" />
									<div className="login-form-google-button-container">
										<button className="login-form-google-button" type="button">
											Faça login com o Google.
										</button>
									</div>
								</div>
								<div>
									<h1 className="login-or-text">ou</h1>
								</div>

								<div className="left-email-icon-container">
									<div className="left-icon-container">
										<EmailIcon className="left-icon" />
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
								<div className="left-password-icon-container">
									<div className="left-icon-container">
										<PadlockIcon className="left-icon" />
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
									<div className="reveal-password-icon-container">
										<OpenEyeIcon className="reveal-password-icon" />
									</div>
								</div>
								<div className="login-form-reset-container">
									<href className="login-form-reset">
										Não consegue fazer login?
									</href>
								</div>
								<div className="start-session-button-container">
									<button type="button" className="start-session-button">
										Iniciar sessão
									</button>
								</div>
							</form>
						</div>
						<div className="register-form-container">
							<a href="/cadastro" className="register-form">
								Ainda não tem uma conta?{" "}
								<b className="register-here-text">Cadastre-se aqui.</b>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
