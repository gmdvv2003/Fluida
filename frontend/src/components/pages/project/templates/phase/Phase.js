import "./Phase.css";

import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";
import { faCircleXmark, faUserLarge } from "@fortawesome/free-solid-svg-icons";

import Card from "../card/Card";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import DragableModal from "utilities/dragable-modal/DragableModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LazyLoader from "utilities/lazy-loader/LazyLoader";
import LoadingDots from "components/shared/loading/LoadingDots";
import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import TextInputField from "components/shared/text-input-field/TextInputField";
import { useSystemPopups } from "context/popup/SystemPopupsContext";

const Phase = React.forwardRef(
	({ scrollableDivRef, isLoading, phase, projectState, projectSocketRef, callbacks }, ref) => {
		const cardsContainerRef = useRef(null);
		const cardsContainerScrollBarRef = useRef(null);

		const lazyLoaderTopOffsetRef = useRef(null);
		const lazyLoaderBottomOffsetRef = useRef(null);

		const lazyLoaderRef = useRef(null);

		const performLazyLoaderUpdateRef = useRef(null);

		const { newPopup } = useSystemPopups();
		const projectNameReference = useRef(null);
		const projectNameUpdateReference = useRef(null);
		const [isDialogOpen, setIsDialogOpen] = useState();
		const [isDialogOpenProjectOptions, setDialogOptionsOpen] = useState(false);
		const [enteredProjectName, setProjectName] = useState("");
		const [getEnteredProjectDialog, setProjectDialog] = useState([]);

		const [projectNameUpdate, setProjectNameUpdate] = useState("");

		useImperativeHandle(
			ref,
			() => ({
				ref: cardsContainerScrollBarRef,
			}),
			[]
		);

		useEffect(() => {}, []);

		useEffect(() => {
			handleInputChange();
			handleInputChangeUpdateProjectName();
		});

		function handleNewProjectClickDialog(boolean) {
			setIsDialogOpen(boolean);
			setProjectName("");
		}

		/**
		 * Lida com o dialog de opções do projeto
		 */
		function handleOptionsProjectClick(boolean, project) {
			setDialogOptionsOpen(boolean);
			setProjectDialog(project);
			setProjectNameUpdate("");
		}

		/**
		 * Atualiza o valor do input de novo projeto
		 */
		async function handleInputChange() {
			if (projectNameReference.current) {
				const unsubscribe = projectNameReference.current.onTextChange((event) => {
					setProjectName(event.target.value);
				});

				return () => unsubscribe();
			}
		}

		/**
		 * Atualiza o valor do input de atualização do novo nome do projeto
		 */
		async function handleInputChangeUpdateProjectName() {
			if (projectNameUpdateReference.current) {
				const unsubscribe = projectNameUpdateReference.current.onTextChange((event) => {
					setProjectNameUpdate(event.target.value);
				});

				return () => unsubscribe();
			}
		}

		/**
		 * função de teste
		 */
		async function teste() {
			console.log("Teste");
		}

		async function handleDeletePhase(phaseId) {
			if (projectState && projectState.requestDeletePhase) {
				try {
					await projectState.requestDeletePhase(phaseId);
					console.log("Fase excluída com sucesso!");
				} catch (error) {
					console.error("Erro ao excluir fase:", error);
				}
			} else {
				console.error(
					"requestDeletePhase não está definido ou projectState está indefinido."
				);
			}
		}

		return (
			<DragableModal
				// Referência para o div que pode ser arrastado
				scrollableDivRef={scrollableDivRef}
				// Ordem do modal
				order={phase?.phaseDTO?.order}
				// Elementos do modal
				elements={(isDragging) => (
					<div
						className={`PP-background ${isDragging && "PP-background-dragging"}`}
						ref={cardsContainerScrollBarRef}
					>
						<Suspense fallback={<LoadingDots />}>
							{isLoading ? (
								<div className="PP-center-lock">
									<LoadingDots style={{ width: "32px", height: "32px" }} />
								</div>
							) : (
								<div>
									<div className="PP-header">
										<TextInputField
											name="title"
											placeholder={`${
												phase?.phaseDTO?.phaseName || "Título"
											} (#${phase?.phaseDTO?.phaseId})`}
											style={{
												backgroundColor: "white",
												width: "100%",
												height: "100%",
											}}
										/>
										<PlusIcon
											className="PP-header-icon-plus"
											onClick={() => {
												projectState.current
													.requestCreateNewCard(phase?.phaseDTO?.phaseId)
													.catch((error) => {
														console.error(
															`Erro ao criar novo card:`,
															error
														);
													});
											}}
										/>
										<DotsIcon
											className="PP-header-icon"
											onClick={() => handleOptionsProjectClick(true)}
										/>
									</div>
									<div className="PP-cards-container" ref={cardsContainerRef}>
										<div ref={lazyLoaderTopOffsetRef} />
										<LazyLoader
											update={performLazyLoaderUpdateRef}
											// Referências para os offsets
											topLeftOffset={lazyLoaderBottomOffsetRef}
											bottomRightOffset={lazyLoaderBottomOffsetRef}
											// Container e barra de rolagem
											container={cardsContainerRef}
											scrollBar={cardsContainerScrollBarRef}
											// Função para construir os elementos
											constructElement={(
												phase,
												_,
												isLoading,
												setReference
											) => <Card />}
											// Dimensões dos elementos
											height={138}
											margin={8}
											padding={8}
											// Direção de rolagem
											direction={"vertical"}
											// Funções de controle do conteúdo
											fetchMore={(page) => {
												return new Promise((resolve, reject) => {
													return projectSocketRef.current?.emit(
														"fetchCards",
														{ phaseId: phase?.phaseDTO?.phaseId, page },
														(response) => {
															resolve(response?.cards?.taken || []);
														}
													);
												});
											}}
											getAvailableContentCountForFetch={async (
												sync = false
											) => {
												return await projectState.current?.getTotalCards(
													phase?.phaseDTO?.phaseId,
													sync
												);
											}}
											// Tamanho da página
											pageSize={10}
											// Função para obter o conteúdo
											getContent={() =>
												projectState.current?.getCards(
													phase?.phaseDTO?.phaseId
												)
											}
											// Referência para o lazy loader
											ref={lazyLoaderRef}
										/>
										<div ref={lazyLoaderBottomOffsetRef} />
									</div>
								</div>
							)}
						</Suspense>

						{isDialogOpen && (
							<div className="PP-dialog-overlay">
								<div className="PP-dialog-new-project-container">
									<div className="PP-container-close-dialog">
										<FontAwesomeIcon
											onClick={() => handleNewProjectClickDialog(false)}
											icon={faCircleXmark}
											size="xl"
											style={{
												color: "#8c8c8c",
												cursor: "pointer",
												borderRadius: "50%",
											}}
										/>
									</div>

									<div>
										<TextInputField
											style={{
												marginTop: "10px",
												marginBottom: "10px",
												borderRadius: "var(--border-radius)",
												backgroundColor: "rgb(244, 244, 244)",
											}}
											name="project"
											placeholder="Nome do card"
											ref={projectNameReference}
										/>
									</div>

									<div className="PP-container-button-new-project">
										<button
											className="PP-button-new-project"
											onClick={() => handleNewProjectClickDialog(true)}
										>
											Criar novo card
										</button>
									</div>
								</div>
							</div>
						)}

						{isDialogOpenProjectOptions && (
							<div className="PP-dialog-overlay">
								<div className="PP-dialog-update-name-project-container">
									<div className="PP-container-label-update-project-name">
										<div className="PP-container-label-current-name-project">
											<div>Nome atual da fase:</div>
											<div className="PP-label-current-project-name">
												{phase?.phaseDTO?.phaseName}
											</div>
										</div>
										<div className="PP-container-close-dialog-project-update">
											<FontAwesomeIcon
												onClick={() => handleOptionsProjectClick(false)}
												icon={faCircleXmark}
												size="xl"
												style={{
													color: "#8c8c8c",
													cursor: "pointer",
													borderRadius: "50%",
												}}
											/>
										</div>
									</div>
									<div>
										<TextInputField
											style={{
												marginTop: "10px",
												marginBottom: "10px",
												borderRadius: "var(--border-radius)",
												backgroundColor: "rgb(244, 244, 244)",
											}}
											name="projectUpdate"
											placeholder="Novo nome da fase"
											ref={projectNameUpdateReference}
										/>
									</div>
									<div className="PP-container-buttons-update-project">
										<button
											className={`PP-button-update-project ${
												projectNameUpdate.length <= 0
													? "PP-button-update-project-disabled"
													: ""
											}`}
											onClick={() => teste()}
											disabled={projectNameUpdate.length <= 0}
										>
											Atualizar fase
										</button>
										<button
											className="PP-button-delete-project"
											// onClick={() =>
											// 	handleDeletePhase(phase?.phaseDTO?.phaseId)
											// }
											onClick={() => {
												projectState.current
													.requestDeletePhase(phase?.phaseDTO?.phaseId)
													.catch((error) => {
														console.error(
															`Erro ao excluir a fase:`,
															error
														);
													});
											}}
										>
											Excluir fase
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
				// Callbacks
				callbacks={callbacks}
				// Referência para o modal
				ref={ref}
			></DragableModal>
		);
	}
);

export default Phase;
