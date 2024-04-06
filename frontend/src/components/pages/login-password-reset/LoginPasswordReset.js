import { useRef, useState, useEffect } from "react";
import "./SendPasswordReset.css";
import InputFieldContainer from "../registration/InputFieldContainer";
import Header from "components/shared/login-registration/header/Header";
import PasswordField from "../registration/input-types/password/PasswordField";
import InputFieldError from "components/shared/login-registration/error/InputFieldError";
import PasswordFieldStrength from "../registration/input-types/password/PasswordFieldStrength";

function LoginPasswordReset() {
	const passwordFieldReference = useRef(null);
	const passwordConfirmationFieldReference = useRef(null);

	const [matchingPassword, setMatchingPassword] = useState(true);

	function onPasswordsChange() {
		const password = passwordFieldReference.current.ref.current.ref.current.value;
		const passwordConfirmation =
			passwordConfirmationFieldReference.current.ref.current.ref.current.value;
		setMatchingPassword(password == passwordConfirmation);
	}

	useEffect(() => {
		const unbindPasswordChangeSubscription =
			passwordFieldReference.current.onPasswordChange(onPasswordsChange);

		const unbindPasswordConfirmationChangeSubscription =
			passwordConfirmationFieldReference.current.onPasswordChange(onPasswordsChange);

		return () => {
			unbindPasswordChangeSubscription();
			unbindPasswordConfirmationChangeSubscription();
		};
	});

	return (
		<div className="SPR-background-container">
			<Header />
			<div className="SPR-box-container">
				<div className="SPR-form-container" style={{ width: "22%", height: "50%" }}>
					<div className="SPR-form" style={{ width: "80%" }}>
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

						<PasswordFieldStrength ref={passwordFieldReference} />

						{!matchingPassword ? (
							<InputFieldError error="Senhas não coincidem." />
						) : null}

						<div className="SPR-button-container">
							<button className="SPR-button">Enviar email</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPasswordReset;
