import TextInputField from "../../shared/text-input-field/TextInputField";
import "./SendPasswordReset.css";
import Header from "components/shared/login-registration/header/Header";

function SendPasswordReset() {
	return (
		<div className="SPR-background-container">
			<Header />
			<div className="SPR-box-container">
				<div className="SPR-form-container" style={{ height: "35%", height: "50%" }}>
					<div className="SPR-form" style={{ width: "80%" }}>
						<h1 className="SPR-form-title">Esqueceu sua senha?</h1>
						<p className="SPR-form-description">
							Insira o email da sua conta, caso ele esteja correto, <br />
							você receberá um email para redefinição de senha.
						</p>
						<TextInputField
							container_style={{
								width: "100%",
								height: "50px",
								paddingTop: "20px",
							}}
							style={{ height: "100%", backgroundColor: "rgb(246, 246, 246)" }}
							placeholder="Endereço de email"
						/>
						<div className="SPR-button-container">
							<button className="SPR-button">Enviar email</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SendPasswordReset;
