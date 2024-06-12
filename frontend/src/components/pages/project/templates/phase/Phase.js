import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faUserLarge } from "@fortawesome/free-solid-svg-icons";

import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";

import { useSystemPopups } from "context/popup/SystemPopupsContext";

import DragableModal from "utilities/dragable-modal/DragableModal";
import LazyLoader from "utilities/lazy-loader/LazyLoader";

import LoadingDots from "components/shared/loading/LoadingDots";
import TextInputField from "components/shared/text-input-field/TextInputField";

import Card from "../card/Card";

import "./Phase.css";

const Phase = React.forwardRef(({ scrollableDivRef, isLoading, phase, projectState, projectSocketRef, callbacks }, ref) => {
	const { newPopup } = useSystemPopups();

	const cardsContainerRef = useRef(null);
	const cardsContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);

	const performLazyLoaderUpdateRef = useRef(null);
	const projectNameUpdateReference = useRef(null);

	const [isDialogOpenProjectOptions, setDialogOptionsOpen] = useState(false);
	const [getEnteredProjectDialog, setProjectDialog] = useState([]);
	const [projectNameUpdate, setProjectNameUpdate] = useState("");

	useImperativeHandle(
		ref,
		() => ({
			ref: cardsContainerScrollBarRef,
		}),
		[]
	);

	useEffect(() => {
		let unsubscribeProjectNameUpdater;

		async function prepareProjectNameUpdater() {
			unsubscribeProjectNameUpdater = await handleInputChangeUpdateProjectName();
		}

		prepareProjectNameUpdater();

		return () => {
			if (unsubscribeProjectNameUpdater) {
				unsubscribeProjectNameUpdater();
			}
		};
	}, [projectNameUpdateReference]);

	useEffect(() => {
		if (!phase) {
			return undefined;
		}

		return projectState.current?.onProjectCardsStateChange(phase?.phaseDTO?.phaseId, (cardDTO) => {
			performLazyLoaderUpdateRef.current?.();
		});
	});

	/**
	 * Lida com o dialog de opções do projeto
	 */
	function handleOptionsProjectClick(boolean, project) {
		setDialogOptionsOpen(boolean);
		setProjectDialog(project);
		setProjectNameUpdate("");
	}

	/**
	 * Atualiza o valor do input de atualização do novo nome do projeto
	 */
	async function handleInputChangeUpdateProjectName() {
		if (projectNameUpdateReference.current) {
			const unsubscribe = projectNameUpdateReference.current.onTextChange((event) => {
				setProjectNameUpdate(event.target.value);
			});

			return unsubscribe;
		}

		return () => {};
	}

	return (
		<DragableModal
			// Referência para o div que pode ser arrastado
			scrollableDivRef={scrollableDivRef}
			// Ordem do modal
			order={phase?.phaseDTO?.order}
			// Elementos do modal
			elements={(isDragging) => (
				<div className={`PP-background ${isDragging && "PP-background-dragging"}`} ref={cardsContainerScrollBarRef}>
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
										placeholder={`${phase?.phaseDTO?.phaseName || "Título"} (#${phase?.phaseDTO?.phaseId})`}
										style={{
											backgroundColor: "white",
											width: "100%",
											height: "100%",
										}}
									/>
									<PlusIcon
										className="PP-header-icon-plus"
										onClick={() => {
											projectState.current.requestCreateNewCard(phase?.phaseDTO?.phaseId).catch((error) => {
												console.error(`Erro ao criar novo card:`, error);
											});
										}}
									/>
									<DotsIcon className="PP-header-icon" onClick={() => handleOptionsProjectClick(true)} />
								</div>
								<div className="PP-cards-container" ref={cardsContainerRef}>
									<div ref={lazyLoaderTopOffsetRef} />
									<LazyLoader
										update={performLazyLoaderUpdateRef}
										// Referências para os offsets
										topLeftOffset={lazyLoaderTopOffsetRef}
										bottomRightOffset={lazyLoaderBottomOffsetRef}
										// Container e barra de rolagem
										container={cardsContainerRef}
										scrollBar={cardsContainerScrollBarRef}
										// Função para construir os elementos
										constructElement={(card, _, isLoading, setReference) => (
											<Card
												scrollableDivRef={cardsContainerScrollBarRef}
												isLoading={isLoading}
												card={card}
												projectState={projectState}
												projectSocketRef={projectSocketRef}
												ref={(element) => setReference(element)}
											/>
										)}
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
										getAvailableContentCountForFetch={async (sync = false) => {
											return await projectState.current?.getTotalCards(phase?.phaseDTO?.phaseId, sync);
										}}
										insertFetchedElement={(element) => {
											return projectState.current?.cardCreated([element], true, true);
										}}
										// Tamanho da página
										pageSize={10}
										// Função para obter o conteúdo
										getContent={() => projectState.current?.getCards(phase?.phaseDTO?.phaseId)}
										// Referência para o lazy loader
										ref={lazyLoaderRef}
									/>
									<div ref={lazyLoaderBottomOffsetRef} />
								</div>
							</div>
						)}
					</Suspense>

					{isDialogOpenProjectOptions && (
						<div className="PP-dialog-overlay">
							<div className="PP-dialog-update-name-project-container">
								<div className="PP-container-label-update-project-name">
									<div className="PP-container-label-current-name-project">
										<div>Nome atual da fase:</div>
										<div className="PP-label-current-project-name">{phase?.phaseDTO?.phaseName}</div>
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
											projectNameUpdate.length <= 0 ? "PP-button-update-project-disabled" : ""
										}`}
										disabled={projectNameUpdate.length <= 0}
									>
										Atualizar fase
									</button>
									<button
										className="PP-button-delete-project"
										onClick={() => {
											projectState.current.requestDeletePhase(phase?.phaseDTO?.phaseId).catch((error) => {
												console.error(`Erro ao excluir a fase:`, error);
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
});

export default Phase;
