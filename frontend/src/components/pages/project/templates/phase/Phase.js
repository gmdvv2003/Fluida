import "./Phase.css";

import { DeleteProjectByProjectId, UpdateProjectAuthenticated } from "utilities/Endpoints";
import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";

import Card from "../card/Card";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import DragableModal from "utilities/dragable-modal/DragableModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LazyLoader from "utilities/lazy-loader/LazyLoader";
import LoadingDots from "components/shared/loading/LoadingDots";
import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import TextInputField from "components/shared/text-input-field/TextInputField";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "context/AuthenticationContext";

const Phase = React.forwardRef(
	(
		{ onCreateCardRequest, isLoading, phase, projectState, currentProjectSocket, ...callbacks },
		ref
	) => {
		const cardsContainerRef = useRef(null);
		const cardsContainerScrollBarRef = useRef(null);

		const lazyLoaderTopOffsetRef = useRef(null);
		const lazyLoaderBottomOffsetRef = useRef(null);

		const lazyLoaderRef = useRef(null);

		const performLazyLoaderUpdateRef = useRef(null);

		const [isDialogOpenProjectOptions, setDialogOptionsOpen] = useState(false);
		const [getEnteredProjectDialog, setProjectDialog] = useState([]);
		const [projectNameUpdate, setProjectNameUpdate] = useState("");
		const projectNameUpdateReference = useRef(null);
		const { performAuthenticatedRequest } = useAuthentication();

		/**
		 *
		 */
		function handleCreateNewPhaseButtonClick() {
			onCreateCardRequest(phase?.phaseDTO?.phaseId);
		}

		function handleOptionsProjectClick(boolean, project) {
			setDialogOptionsOpen(boolean);
			setProjectDialog(project);
		}

		useImperativeHandle(
			ref,
			() => ({
				ref: cardsContainerScrollBarRef,
			}),
			[]
		);

		useEffect(() => {
			console.log(
				"Phase mounted",
				phase?.phaseDTO?.phaseId,
				phase?.phaseDTO.phaseName,
				phase?.phaseDTO?.order
			);
		});

		async function handleOnDeleteProjectButton(projectId) {
			console.log(projectId);
			const response = await performAuthenticatedRequest(
				DeleteProjectByProjectId(projectId),
				"DELETE"
			);
		}

		async function handleOnUpdateProjectButton(projectId) {
			console.log(projectId);
			const response = await performAuthenticatedRequest(
				UpdateProjectAuthenticated(projectId),
				"PUT",
				JSON.stringify({
					projectName: projectNameUpdate,
				})
			);
		}

		function handleOptionsProjectClick(boolean, project) {
			setDialogOptionsOpen(boolean);
			setProjectDialog(project);
		}

		return (
			<DragableModal
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
											onClick={handleCreateNewPhaseButtonClick}
										/>
										<DotsIcon
											className="PP-header-icon"
											onClick={handleOptionsProjectClick}
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
													return currentProjectSocket?.emit(
														"fetchCards",
														{ page },
														(response) => {
															resolve(response?.taken || []);
														}
													);
												});
											}}
											getAvailableContentCountForFetch={async (
												sync = false
											) => {
												return await projectState?.getTotalCards(sync);
											}}
											// Tamanho da página
											pageSize={10}
											// Função para obter o conteúdo
											getContent={projectState?.getCards(
												phase?.phaseDTO?.phaseId
											)}
											// Referência para o lazy loader
											ref={lazyLoaderRef}
										/>
										<div ref={lazyLoaderBottomOffsetRef} />
									</div>
									{isDialogOpenProjectOptions && (
										<div className="HP-dialog-overlay">
											<div className="HP-dialog-update-name-project-container">
												<div className="HP-container-label-update-project-name">
													<div className="HP-container-close-dialog-project-update">
														<FontAwesomeIcon
															onClick={() =>
																handleOptionsProjectClick(false)
															}
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
														placeholder="Novo nome do projeto"
														ref={projectNameUpdateReference}
													/>
												</div>
												<div className="HP-container-buttons-update-project">
													<button
														className={`HP-button-update-project ${
															projectNameUpdate.length <= 0
																? "HP-button-update-project-disabled"
																: ""
														}`}
														onClick={() =>
															handleOnUpdateProjectButton(
																getEnteredProjectDialog.projectId
															)
														}
														disabled={projectNameUpdate.length <= 0}
													>
														Atualizar projeto
													</button>
													<button
														className="HP-button-delete-project"
														onClick={() =>
															handleOnDeleteProjectButton(
																getEnteredProjectDialog.projectId
															)
														}
													>
														Excluir projeto
													</button>
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</Suspense>
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
