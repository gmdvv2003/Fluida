import { useRef, useState, useEffect } from "react";

import Header from "components/shared/login-registration/header/Header";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";

import InputFieldContainer from "../../shared/text-input-field/InputFieldContainer";
import PasswordField from "../../shared/password-input-field/PasswordField";
import PasswordFieldStrength from "../../shared/password-input-field/PasswordFieldStrength";

import "./LoginPasswordReset.css";
import "./../validate-email/ValidateEmail.css";

function LoginPasswordReset() {
	const passwordFieldReference = useRef(null);
	const passwordConfirmationFieldReference = useRef(null);
	const passwordStrengthFieldRefrence = useRef(null);

	const [urlToken, setUrlToken] = useState();

	const [isPasswordNotSatisfied, setIsPasswordNotSatisfied] = useState(false);
	const [samePasswordAsBefore, setSamePasswordAsBefore] = useState(false);

	const [matchingPassword, setMatchingPassword] = useState(true);

	const [successfullyChangedPassword, setSuccessfullyChangedPassword] = useState(false);
	const [failedToChangePassword, setFailedToChangePassword] = useState(false);

	function handleOnSubmitButton() {
		if (matchingPassword) {
			const enteredPassword = passwordFieldReference.current.ref.current.ref.current.value;

			const isPasswordSatisfied = passwordStrengthFieldRefrence.current.isPasswordSatisfied();
			setIsPasswordNotSatisfied(!isPasswordSatisfied);

			if (isPasswordSatisfied) {
				fetch("http://localhost:8080/resetPassword", {
					headers: { "Content-Type": "application/json" },
					mode: "cors",
					cache: "no-cache",
					credentials: "include",
					method: "PUT",
					body: JSON.stringify({ token: urlToken, newPassword: enteredPassword }),
				})
					.then((result) => result.json())
					.then((data) => {
						if (data.samePasswordAsBefore) {
							setSamePasswordAsBefore(true);
						} else {
							setSuccessfullyChangedPassword(true);
						}
					})
					.catch((error) => {
						setFailedToChangePassword(true);
						console.error(`Falha ao alterar a senha. Erro: ${error}`);
					});
			}
		}
	}

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation = passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		console.log(password);
		console.log(passwordConfirmation);
		setMatchingPassword(password == passwordConfirmation);
	}

	useEffect(() => {
		const searchParameters = new URLSearchParams(window.location.search);
		if (!searchParameters.has("token")) {
			window.location.href = "/login";
		} else {
			setUrlToken(searchParameters.get("token"));

			if (passwordFieldReference.current && passwordConfirmationFieldReference.current) {
				const unbindPasswordChangeSubscription = passwordFieldReference.current.onPasswordChange(onPasswordsChange);
				const unbindPasswordConfirmationChangeSubscription =
					passwordConfirmationFieldReference.current.onPasswordChange(onPasswordsChange);

				return () => {
					unbindPasswordChangeSubscription();
					unbindPasswordConfirmationChangeSubscription();
				};
			}
		}
	}, [matchingPassword]);

	function successed() {
		return (
			<div className="R-VE-form">
				<h2 className="R-VE-form-sub-title">Sua senha foi alterada.</h2>
				<p className="R-VE-form-description">
					Agora você pode logar com a sua nova senha. Clique no botão abaixo para ser redirecionado para a página de login.
				</p>
				<div className="R-VE-button-container">
					<button className="R-VE-button">Logar</button>
				</div>
			</div>
		);
	}

	function failed() {
		return (
			<div className="R-VE-form">
				<h1 className="R-VE-form-title">Ops! :(</h1>
				<h2 className="R-VE-form-sub-title">Não foi possível alterar a sua senha.</h2>
				<p className="R-VE-form-description">
					Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o
					problema.
				</p>
			</div>
		);
	}

	return (
		<div className="SPR-background-container">
			<Header />
			<div className="SPR-box-container">
				<div
					className="SPR-form-container"
					style={{ width: "22%", height: successfullyChangedPassword || failedToChangePassword ? "40%" : "70%" }}
				>
					<div className="SPR-form" style={{ width: "80%" }}>
						{(() => {
							if (successfullyChangedPassword) {
								return successed();
							} else if (failedToChangePassword) {
								return failed();
							} else {
								return (
									<div style={{ width: "100%" }}>
										<h1 className="SPR-form-title">Redefinir senha</h1>

										<InputFieldContainer description="Digite a sua nova senha">
											<PasswordField
												ref={passwordFieldReference}
												name="password"
												placeholder="Digite uma senha forte"
											/>
										</InputFieldContainer>

										<InputFieldContainer
											description="Confirme a sua senha"
											grid_template_areas="password_confirmation_field"
										>
											<PasswordField
												ref={passwordConfirmationFieldReference}
												name="password"
												placeholder="Repita a senha"
												grid_area="password_confirmation_field"
											/>
										</InputFieldContainer>

										<PasswordFieldStrength field={passwordFieldReference} ref={passwordStrengthFieldRefrence} />

										{!matchingPassword ? <InputFieldError error="Senhas não coincidem." /> : null}

										<div style={{ width: "100%" }}>
											{(() => {
												if (samePasswordAsBefore) {
													return <InputFieldError error="A nova senha não pode ser igual a anterior." />;
												}

												if (isPasswordNotSatisfied) {
													return <InputFieldError error="A senha não atende aos requisitos." />;
												}
											})()}

											<div className="SPR-button-container">
												<button onClick={handleOnSubmitButton} className="SPR-button">
													Redefinir Senha
												</button>
											</div>
										</div>
									</div>
								);
							}
						})()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPasswordReset;
