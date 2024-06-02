import { useEffect, useState } from "react";

import Loading from "components/shared/loading/Loading";
import Header from "components/shared/login-registration/header/Header";
import ActionFeedback from "components/shared/action-feedback/ActionFeedback";

import { AcceptProjectInvitationEndpoint } from "utilities/Endpoints";

import "./AcceptProjectInvitation.css";

function AcceptProjectInvitation() {
	const [waitingForValidation, setWaitingForValidation] = useState(true);
	const [successfullyInvited, setSuccessfullyInvited] = useState(false);

	function successed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Convite validado com sucesso!" },
					{
						type: "subTitle",
						text: "Agora você já pode acessar a tela do projeto. Clique no botão abaixo para ser redirecionado ao projeto.",
					},
					{ type: "button", text: "Acessar" },
				]}
			/>
		);
	}

	function failed() {
		return (
			<ActionFeedback
				elements={[
					{ type: "title", text: "Ops! :(" },
					{ type: "subTitle", text: "Não foi possível validar o seu link de convite." },
					{
						type: "description",
						text: "Favor tente novamente mais tarde. Se o problema persistir, entre em contato conosco para que possamos resolver o problema.",
					},
				]}
			/>
		);
	}

	useEffect(() => {
		document.title = "Fluida | Validate your Invite";

		const searchParameters = new URLSearchParams(window.location.search);
		if (!searchParameters.has("invitation")) {
			setWaitingForValidation(false);
		} else {
			setWaitingForValidation(true);

			// Pega o link da url
			const invitation = searchParameters.get("invitation");

			// Realiza a requisição para o back
			const response = AcceptProjectInvitationEndpoint("PUT", JSON.stringify({ invitation: invitation }));
			if (response.success) {
				setSuccessfullyInvited(response.data?.inviteValidated);
			} else {
				console.error(`Falha ao validar convite. Erro: ${response.error}`);
			}

			setWaitingForValidation(false);
		}
	}, []);

	return (
		<div>
			<Header />
			{waitingForValidation ? <Loading text={"Validando convite"} /> : successfullyInvited ? successed() : failed()}
		</div>
	);
}

export default AcceptProjectInvitation;
