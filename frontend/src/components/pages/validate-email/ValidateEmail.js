import { useEffect, useState } from "react";

import Header from "components/shared/login-registration/header/Header";
import Loading from "components/shared/loading/Loading";
import ActionFeedback from "components/shared/action-feedback/ActionFeedback";

function ValidateEmail() {
	const [waitingForValidation, setWaitingForValidation] = useState(true);
	const [emailValidatedSuccessfully, setEmailValidatedSuccessfully] = useState(false);

	function successed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Parabéns," },
					{ type: "subTitle", text: "Sua conta foi verificada com sucesso!" },
					{
						type: "description",
						text: "Agora que sua conta foi verificada, você esta livre para logar em sua conta e começar a sua jornada explorando a nossa plataforma!",
					},
					{ type: "button", text: "Logar" },
				]}
			/>
		);
	}

	function failed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Ops! :(" },
					{ type: "subTitle", text: "Aparentemente algo de errado ocorreu enquanto sua conta era verificada." },
					{
						type: "description",
						text: "Se você acredita que isso foi um erro por nossa parte, por favor, entre em contato conosco para que possamos resolver o problema.",
					},
				]}
			/>
		);
	}

	function waiting() {
		return <Loading text="Validando sua conta" />;
	}

	useEffect(() => {
		const searchParameters = new URLSearchParams(window.location.search);
		if (!searchParameters.has("token")) {
			setWaitingForValidation(false);
		} else {
			const token = searchParameters.get("token");

			fetch("http://localhost:8080/users/validateEmail", {
				headers: { "Content-Type": "application/json" },
				mode: "cors",
				cache: "no-cache",
				credentials: "include",
				method: "PUT",
				body: JSON.stringify({ token: token }),
			})
				.then((result) => result.json())
				.then((data) => {
					if (data.isValidated) {
						setEmailValidatedSuccessfully(true);
					}

					setWaitingForValidation(false);
				})
				.catch((error) => {
					setWaitingForValidation(false);
					console.error(`Falha ao validar email. Erro: ${error}`);
				});
		}
	}, []);

	return (
		<div>
			<Header />
			{waitingForValidation ? waiting() : emailValidatedSuccessfully ? successed() : failed()}
		</div>
	);
}

export default ValidateEmail;
