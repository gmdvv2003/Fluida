import "./LandingPage.css";

import { useRef } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

import Header from "components/shared/login-registration/header/Header";
import Footer from "components/shared/login-registration/footer/Footer";
import ActionButton from "components/shared/action-button/ActionButton";
import ProjectDisplay from "./components/ProjectDisplay";

import TextInputField from "../../shared/text-input-field/TextInputField";

function LandingPage() {
	const emailFieldReference = useRef(null);

	const navigate = useNavigate();

	return (
		<div>
			<Header />
			<div className="LP-background-page">
				<div>
					<img src="fluida-background-landing-page.png" className="LP-fluida-background-waves" />

					<div className="LP-fluida-description">
						<h1 className="LP-description-text-h1">
							Trabalhe em equipe e organize as tarefas
							<br />
							do seu projeto em um único lugar
						</h1>

						<a className="LP-description-text-a">Faça login ou cadastre-se agora mesmo. É grátis.</a>

						<div style={{ paddingTop: "10px" }}>
							<ActionButton
								title="Faça login"
								style={{
									width: "100px",
									height: "35px",
									fontSize: "15px",
									border: "2px solid #FFFFFF",
									backgroundColor: "transparent",
								}}
								is_active={true}
								on_click={() => {
									navigate("/login");
								}}
							/>
						</div>
					</div>

					<div style={{ flexDirection: "column" }}>
						<div className="LP-fluida-icon-container">
							<img src="svgpag1.png" className="LP-fluida-icon" />
							<div className="LP-fluida-title-description-container">
								<h1>
									Facilite a gestão dos seus Projetos <br />
									com Fluida
								</h1>

								<h2 style={{ color: "orange", textAlign: "right", width: "100%" }}>Método Kanban</h2>

								<a className="LP-kanban-description">
									O kanban é uma ferramenta visual de organização de tarefas.
									<br />
									Com ele, é possível visualizar o fluxo de trabalho e
									<br />
									acompanhar o andamento das atividades.
									<br />
									<br />
									Você pode criar, editar e excluir tarefas, além de acompanhar
									<br />o progresso do seu projeto em tempo real com a sua equipe.
								</a>
							</div>
						</div>

						<div className="LP-fluida-project-display-title-container">
							<h1 style={{ color: "orange", fontSize: "40px" }}>Com uma interface intuitiva e amigável</h1>
						</div>

						<ProjectDisplay
							display={[
								{
									path: "tela1.jpg",
									buttonName: "Quadros",
									description:
										"Dê vida à sua visão geral de projetos com nossos quadros intuitivos. Organize suas tarefas em espaços visuais e gerencie o progresso de forma transparente.",
								},
								{
									path: "tela2.jpg",
									buttonName: "Fases",
									description:
										" Simplifique o gerenciamento de tarefas ao dividir seus projetos em etapas claras. Nossas listas ajudam você a acompanhar cada passo do seu fluxo de trabalho de maneira ordenada e eficaz.",
								},
								{
									path: "tela3.jpg",
									buttonName: "Cartões",
									description:
										"A essência do seu projeto encapsulada em um único lugar. Com os cartões, você pode detalhar tarefas, atribuir responsabilidades e colaborar de forma eficiente, tudo em um espaço organizado e acessível.",
								},
							]}
						/>
					</div>

					<div className="LP-registration-field-container">
						<div className="LP-registration-field-title-container" style={{ gap: "10px" }}>
							<h1
								style={{
									fontSize: "20px",
									fontWeight: "lighter",
									textAlign: "center",
								}}
							>
								Comece a transformar suas ideias em realidade <br />
								em um ambiente de trabalho flexível e colaborativo.
							</h1>

							<a style={{ fontWeight: "bold", textAlign: "center" }}>Crie sua conta agora mesmo.</a>

							<div
								className="LP-registration-field-input-container"
								style={{
									width: "100%",
									display: "flex",
									alignItems: "center",
									flexDirection: "column",
								}}
							>
								<TextInputField
									placeholder="Insira o seu email."
									style={{ backgroundColor: "white" }}
									ref={emailFieldReference}
								/>
								<ActionButton
									title="Registrar-se"
									style={{
										width: "220px",
										height: "40px",
										marginTop: "15px",
										fontSize: "16px",
									}}
									is_active={true}
									on_click={() => {
										const enteredEmailForRegistration = emailFieldReference.current.ref.current.value;
										if (enteredEmailForRegistration.length > 0) {
											navigate({
												pathname: "/registration",
												search: createSearchParams({
													email: btoa(enteredEmailForRegistration),
												}).toString(),
											});
										} else {
											navigate("/registration");
										}
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="LP-fluida-background-container">
					<img src="fluida-background-landing-page-wave.png" className="LP-fluida-background-bluewave" />
					<img src="fluida-fish-landing-page.png" className="LP-fluida-background-fishwave" />
				</div>

				<Footer />
			</div>
		</div>
	);
}

export default LandingPage;
