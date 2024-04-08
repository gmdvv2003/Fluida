import { useRef, useState } from "react";

import Header from "components/shared/login-registration/header/Header";
import Loading from "components/shared/loading/Loading";

import AccountInformation from "./procedures/AccountInformation";
import PasswordCreation from "./procedures/PasswordCreation";

import "../validate-email/ValidateEmail.css";

function Registration() {
	const [currentProcedure, setCurrentProcedure] = useState(0);

	const [waitingForValidation, setWaitingForRegistration] = useState(false);
	const [finishedRegistrationProcess, setFinishedRegistrationProcess] = useState(false);
	const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

	const accountInformationFieldsProvider = {
		email: useState(false),
		firstName: useState(false),
		lastName: useState(false),
		phoneNumber: useState(false),
		password: useState(false),
	};

	function finalizeRegistration() {
		let { email, firstName, lastName, phoneNumber, password } = accountInformationFieldsProvider;

		email = email[0];
		firstName = firstName[0];
		lastName = lastName[0];
		phoneNumber = phoneNumber[0];
		password = password[0];

		setWaitingForRegistration(true);

		fetch("http://localhost:8080/users/register", {
			headers: { "Content-Type": "application/json" },
			mode: "cors",
			cache: "no-cache",
			credentials: "include",
			method: "POST",
			body: JSON.stringify({
				email: email,
				firstName: firstName,
				lastName: lastName,
				phoneNumber: phoneNumber,
				password: password,
			}),
		})
			.then((result) => result.json())
			.then((data) => {
				if (data.successfullyRegistered) {
					setSuccessfullyRegistered(true);
				}
			})
			.catch((error) => {
				console.error(`Falha ao cadastrar conta. Erro: ${error}`);
			})
			.finally(() => {
				setFinishedRegistrationProcess(true);
				setWaitingForRegistration(false);
			});
	}

	function nextProcedure() {
		setCurrentProcedure(currentProcedure + 1);
	}

	function previousProcedure() {
		setCurrentProcedure(Math.max(currentProcedure - 1, 0));
	}

	function setState(identifier, value) {
		accountInformationFieldsProvider[identifier][1](value);
	}

	function successed() {
		return (
			<div className="R-VE-form">
				<h1 className="R-VE-form-title">Parabéns!</h1>
				<h2 className="R-VE-form-sub-title">Sua conta foi cadastrada com sucesso!</h2>
				<p className="R-VE-form-description">
					Agora você está um passo mais próximo de começar a explorar a nossa plataforma.
					<br />
					<br />
					Um email foi enviado para a sua caixa de entrada para que você possa validar a sua conta.
				</p>
			</div>
		);
	}

	function failed() {
		return (
			<div className="R-VE-form">
				<h1 className="R-VE-form-title">Ops! :(</h1>
				<h2 className="R-VE-form-sub-title">Não foi possível realizar o cadastro da sua conta.</h2>
				<p className="R-VE-form-description">
					Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o
					problema.
				</p>
			</div>
		);
	}

	return (
		<div>
			<Header />
			<div>
				{(() => {
					if (waitingForValidation) {
						return <Loading text="Cadastrando sua conta" />;
					}

					if (finishedRegistrationProcess) {
						return (
							<div className="LR-C-forms-container-holder" style={{ justifyContent: "start", paddingTop: "50px" }}>
								<div className="LR-C-forms-container" style={{ height: "40%" }}>
									<div className="LR-C-forms" style={{ width: "80%" }}>
										{successfullyRegistered ? successed() : failed()}
									</div>
								</div>
							</div>
						);
					}

					switch (currentProcedure) {
						case 0:
							return (
								<AccountInformation
									nextProcedure={nextProcedure}
									previousProcedure={previousProcedure}
									setState={setState}
								/>
							);

						case 1:
							return (
								<PasswordCreation nextProcedure={nextProcedure} previousProcedure={previousProcedure} setState={setState} />
							);

						// Envia as informações de cadastro para o back
						case 2: {
							// Assegura que todos os campos estão preenchidos
							let allValid = true;
							for (const [_, value] of Object.entries(accountInformationFieldsProvider)) {
								if (!value[0]) {
									allValid = false;
									break;
								}
							}

							// Caso algum campo não esteja preenchido, redireciona para a tela de cadastro
							if (!allValid) {
								document.location.href = "/registration";
							} else {
								finalizeRegistration();
							}

							break;
						}

						default:
							break;
					}
				})()}
			</div>
		</div>
	);
}

export default Registration;
