import { useEffect, useState, useRef } from "react";

import Loading from "components/shared/loading/Loading";
import Header from "components/shared/login-registration/header/Header";
import ActionFeedback from "components/shared/action-feedback/ActionFeedback";

import { RequestValidationEmailEndpoint } from "utilities/Endpoints";

import "./RequestValidationEmail.css";

function RequestValidationEmail() {
	const [waitingForValidation, setWaitingForValidation] = useState(true);
	const [successfullySent, setSuccessfullySent] = useState(false);

	const firstCall = useRef(true);

	function successed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Email reenviado com sucesso!" },
					{
						type: "subTitle",
						text: "Você deve receber um email em breve com as instruções para validar a sua conta",
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
					{ type: "subTitle", text: "Não foi possível reenviar o email de validação." },
					{
						type: "description",
						text: "Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o problema.",
					},
				]}
			/>
		);
	}

	useEffect(() => {
		document.title = "Fluida | Validation Email";

		async function requestValidationEmail() {
			if (firstCall.current) {
				// Evita que a função seja chamada mais de uma vez
				firstCall.current = false;

				const searchParameters = new URLSearchParams(window.location.search);
				if (!searchParameters.has("address")) {
					setWaitingForValidation(false);
				} else {
					setWaitingForValidation(true);

					// Pega o email pela url
					const email = atob(searchParameters.get("address"));

					// Realiza a requisição para o back
					const response = await RequestValidationEmailEndpoint("PUT", JSON.stringify({ email: email }));
					if (response.success) {
						setSuccessfullySent(response.success);
					}

					setWaitingForValidation(false);
				}
			}
		}

		requestValidationEmail();
	}, []);

	return (
		<div>
			<Header />
			{waitingForValidation ? <Loading text={"Requisitando email"} /> : successfullySent ? successed() : failed()}
		</div>
	);
}

export default RequestValidationEmail;
