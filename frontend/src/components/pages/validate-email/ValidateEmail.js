import "./ValidateEmail.css";

import { useEffect, useState } from "react";

import Header from "components/shared/login-registration/header/Header";
import Loading from "components/shared/loading/Loading";

function ValidateEmail() {
	const [waitingForValidation, setWaitingForValidation] = useState(true);
	const [emailValidatedSuccessfully, setEmailValidatedSuccessfully] = useState(false);

	function successed() {
		return (
			<div className="R-VE-form">
				<h1 className="R-VE-form-title">Parabéns,</h1>
				<h2 className="R-VE-form-sub-title">Sua conta foi verificada com sucesso!</h2>
				<p className="R-VE-form-description">
					Agora que sua conta foi verificada, você esta livre para logar em sua conta e começar a sua jornada explorando a nossa
					plataforma!
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
				<h2 className="R-VE-form-sub-title">Aparentemente algo de errado ocorreu enquanto sua conta era verificada.</h2>
				<p className="R-VE-form-description">
					Se você acredita que isso foi um erro por nossa parte, por favor, entre em contato conosco para que possamos resolver o
					problema.
				</p>
			</div>
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
			{waitingForValidation ? (
				waiting()
			) : (
				<div className="LR-C-forms-container-holder" style={{ justifyContent: "start", paddingTop: "50px" }}>
					<div className="LR-C-forms-container" style={{ height: "40%" }}>
						<div className="LR-C-forms" style={{ width: "80%" }}>
							{emailValidatedSuccessfully ? successed() : failed()}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ValidateEmail;
