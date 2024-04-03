import Header from "components/shared/login-registration/header/Header";

import InputFieldContainer from "./InputFieldContainer";
import TextInputField from "./input-types/TextInputField";
import PhoneNumberField from "./input-types/PhoneNumberField";

import "./../../shared/login-registration/background/Background.css";
import "./../../shared/login-registration/container/Container.css";

import "./Registration.css";

function Registration() {
	return (
		<div>
			<Header />
			<div className="forms-container-holder fluida-background-waves-container">
				<div className="forms-container-holder fluida-identity-fish-container">
					<div className="forms-container">
						<form>
							<div>
								<h1>Cria sua conta. É grátis.</h1>
							</div>

							<div>
								<InputFieldContainer description="Insera o seu email de prefêrencia.">
									<TextInputField
										name="email"
										placeholder="Insira um email válido."
									/>
								</InputFieldContainer>
							</div>

							<div>
								<InputFieldContainer
									description="Insera o nome e sobrenome."
									grid_template="first-name last-name"
								>
									<TextInputField
										name="name"
										placeholder="Primeiro nome"
										grid_area="first-name"
									/>
									<TextInputField
										name="name"
										placeholder="Ultimo nome"
										grid_area="last-name"
									/>
								</InputFieldContainer>
							</div>

							<div>
								<InputFieldContainer description="Insira o seu número de telefone.">
									<PhoneNumberField />
								</InputFieldContainer>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Registration;
