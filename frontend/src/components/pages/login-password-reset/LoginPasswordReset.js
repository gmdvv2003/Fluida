import "./LoginPasswordReset.css";
import "./SendPasswordReset.css";

import { useEffect, useRef, useState } from "react";

import Header from "components/shared/login-registration/header/Header";
import InputFieldContainer from "../../shared/text-input-field/InputFieldContainer";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import PasswordField from "../../shared/password-input-field/PasswordField";
import PasswordFieldStrength from "../../shared/password-input-field/PasswordFieldStrength";
import ActionFeedback from "components/shared/action-feedback/ActionFeedback";

import { ResetPasswordEndpoint } from "utilities/Endpoints";
import { useNavigate } from "react-router-dom";

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

	const navigate = useNavigate();

	function successed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Sua senha foi alterada." },
					{
						type: "subTitle",
						text: "Agora você pode logar com a sua nova senha. Clique no botão abaixo para ser redirecionado para a página de login.",
					},
					{
						type: "button",
						text: "Logar",
						onClick: () => {
							navigate("/login");
						},
					},
				]}
			/>
		);
	}

	function failed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Ops! :(" },
					{ type: "subTitle", text: "Não foi possível alterar a sua senha." },
					{
						type: "description",
						text: "Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o problema.",
					},
				]}
			/>
		);
	}

	async function handleOnSubmitButton() {
		if (matchingPassword) {
			const enteredPassword = passwordFieldReference.current.ref.current.ref.current.value;

			const isPasswordSatisfied = passwordStrengthFieldRefrence.current.isPasswordSatisfied();
			setIsPasswordNotSatisfied(!isPasswordSatisfied);

			if (isPasswordSatisfied) {
				// Realiza a requisição para o back
				const response = await ResetPasswordEndpoint(
					"PUT",
					JSON.stringify({ token: urlToken, newPassword: enteredPassword })
				);
				if (response?.data?.samePasswordAsBefore) {
					setSamePasswordAsBefore(true);
				} else {
					setSuccessfullyChangedPassword(response?.success);
					setFailedToChangePassword(!response?.success);
				}
			}
		}
	}

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation = passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		setMatchingPassword(password == passwordConfirmation);
	}

	useEffect(() => {
		document.title = "Fluida | Reset Password";

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

	return (
		<div className="SPR-background-container">
			<Header />
			{successfullyChangedPassword ? (
				successed()
			) : failedToChangePassword ? (
				failed()
			) : (
				<div className="SPR-box-container">
					<div
						className="SPR-form-container"
						style={{
							width: "500px",
							height: successfullyChangedPassword || failedToChangePassword ? "40%" : "70%",
						}}
					>
						<div className="SPR-form" style={{ width: "80%" }}>
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
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default LoginPasswordReset;
