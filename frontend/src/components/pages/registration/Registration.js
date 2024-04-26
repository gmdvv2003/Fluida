import "../validate-email/ValidateEmail.css";

import { useState } from "react";

import AccountInformation from "./procedures/AccountInformation";
import Header from "components/shared/login-registration/header/Header";
import Loading from "components/shared/loading/Loading";
import PasswordCreation from "./procedures/PasswordCreation";
import ActionFeedback from "components/shared/action-feedback/ActionFeedback";

import { RegisterUserEndpoint } from "utilities/Endpoints";
import Background from "components/shared/login-registration/background/Background";

function Registration() {
	const [currentProcedure, setCurrentProcedure] = useState(0);

	const [waitingForRegistration, setWaitingForRegistration] = useState(false);
	const [finishedRegistrationProcess, setFinishedRegistrationProcess] = useState(false);
	const [successfullyRegistered, setSuccessfullyRegistered] = useState(false);

	const accountInformationFieldsProvider = {
		email: useState(false),
		firstName: useState(false),
		lastName: useState(false),
		phoneNumber: useState(false),
		password: useState(false),
	};

	async function finalizeRegistration() {
		if (waitingForRegistration) {
			return null;
		}

		let { email, firstName, lastName, phoneNumber, password } =
			accountInformationFieldsProvider;

		email = email[0];
		firstName = firstName[0];
		lastName = lastName[0];
		phoneNumber = phoneNumber[0];
		password = password[0];

		setWaitingForRegistration(true);

		// Realiza a requisição para o back
		const response = await RegisterUserEndpoint(
			"POST",
			JSON.stringify({ email, firstName, lastName, phoneNumber, password })
		);

		// Verifica se a requisição foi bem sucedida
		if (response.success) {
			setSuccessfullyRegistered(response.data?.successfullyRegistered);
		} else {
			console.error(`Falha ao cadastrar conta. Erro: ${response.error}`);
		}

		// Finaliza o processo de cadastro
		setFinishedRegistrationProcess(true);
		setWaitingForRegistration(false);
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
			<ActionFeedback
				elements={[
					{ type: "title", text: "Parabéns!" },
					{ type: "subSitle", text: "Sua conta foi cadastrada com sucesso!" },
					{
						type: "description",
						text: "Agora você está um passo mais próximo de começar a explorar a nossa plataforma. Um email foi enviado para a sua caixa de entrada para que você possa validar a sua conta.",
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
					{
						type: "subTitle",
						text: "Não foi possível realizar o cadastro da sua conta.",
					},
					{
						type: "description",
						text: "Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o problema.",
					},
				]}
			/>
		);
	}

	return (
		<div>
			<Header />
			<div>
				{(() => {
					if (waitingForRegistration) {
						return <Loading text="Cadastrando sua conta" />;
					}

					if (finishedRegistrationProcess) {
						return successfullyRegistered ? successed() : failed();
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
								<PasswordCreation
									nextProcedure={nextProcedure}
									previousProcedure={previousProcedure}
									setState={setState}
								/>
							);

						// Envia as informações de cadastro para o back
						case 2: {
							// Assegura que todos os campos estão preenchidos
							let allValid = true;
							for (const [_, value] of Object.entries(
								accountInformationFieldsProvider
							)) {
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
