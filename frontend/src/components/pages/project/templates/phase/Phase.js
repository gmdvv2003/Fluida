import "./Phase.css";

import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";

import DragableModal from "utilities/dragable-modal/DragableModal";
import LazyLoader from "utilities/lazy-loader/LazyLoader";

import LoadingDots from "components/shared/loading/LoadingDots";
import TextInputField from "components/shared/text-input-field/TextInputField";

import Card from "../card/Card";

import MouseScrollableModal from "utilities/MouseScrollableModal/MouseScrollableModal";
import DragableModalDropLocationWithLazyLoader from "utilities/dragable-modal/drop-location/DragableModalDropLocationWithLazyLoader";

import { useSystemPopups } from "context/popup/SystemPopupsContext";

const Phase = React.forwardRef(({ scrollableDivRef, isLoading, phase, projectStateRef, projectSocketRef, callbacks }, ref) => {
	const { newPopup } = useSystemPopups();

	const cardsContainerScrollBarRef = useRef(null);
	const mouseScrollableModalRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);
	const performLazyLoaderUpdateRef = useRef(null);

	const dragableModalOnDragBeginRef = useRef(null);
	const dragableModalOnDragEndRef = useRef(null);
	const dragableModalOnDragMoveRef = useRef(null);

	useImperativeHandle(
		ref,
		() => ({
			ref: cardsContainerScrollBarRef,
		}),
		[]
	);

	useEffect(() => {
		if (!phase) {
			return undefined;
		}

		return projectStateRef.current?.onProjectCardsStateChange(phase?.phaseDTO?.phaseId, (cardDTO) => {
			performLazyLoaderUpdateRef.current?.();
		});
	});

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
								<LoadingDots scale={0.8} />
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
											projectStateRef.current.requestCreateNewCard(phase?.phaseDTO?.phaseId).catch((error) => {
												console.error(`Erro ao criar novo card:`, error);
											});
										}}
									/>
									<DotsIcon className="PP-header-icon" onClick={() => projectStateRef.current?.previewPhaseConfiguration(phase)} />
								</div>

								<div className="PP-cards-container">
									<div ref={lazyLoaderTopOffsetRef} />
									<MouseScrollableModal scrollableDivRef={cardsContainerScrollBarRef} ref={mouseScrollableModalRef}>
										<DragableModalDropLocationWithLazyLoader
											// Referência para a div que será arrastada
											scrollableDivRef={cardsContainerScrollBarRef}
											// Referência para o LazyLoader
											lazyLoaderRef={lazyLoaderRef}
											// Função para criar um placeholder
											createPlaceholder={(setPlaceholder, { order }) => {
												return (
													<div
														className="PC-background PC-background-placeholder"
														style={{ order: order + 1 }}
														ref={(element) => setPlaceholder(element)}
													/>
												);
											}}
											// Referência para o dragable modal
											getComponentFromRef={(ref) => {
												return ref.current?.children?.[0];
											}}
											// Função para obter a ordem de um elemento
											getComponentOrderFromData={({ cardDTO }) => {
												return cardDTO?.order;
											}}
											// Referências das funções de drag
											dragBeginRef={dragableModalOnDragBeginRef}
											dragEndRef={dragableModalOnDragEndRef}
											dragMoveRef={dragableModalOnDragMoveRef}
											// Função chamada quando o drag é concluído
											dragConcludedCallback={({ cardDTO }, newPosition) => {
												const cardState = projectStateRef.current?.getCardState(cardDTO?.phaseId, cardDTO?.cardId);
												if (!cardState) {
													return null;
												}

												// "Salva" a ordem atual da fase
												const currentCardOrder = cardState.cardDTO.order;

												if (currentCardOrder == newPosition) {
													return null;
												}

												projectSocketRef.current?.emit(
													"moveCard",
													{
														cardId: cardDTO?.cardId,
														targetPositionIndex: newPosition,
														targetPhaseId: cardDTO?.phaseId,
													},
													(success, data) => {
														!success &&
															newPopup("Common", {
																severity: "error",
																message: "Erro ao mover o card",
															});
													}
												);

												// Ajusta a ordem das outras fases
												projectStateRef.current?.getCards(cardDTO?.phaseId).forEach((cardState) => {
													if (cardState == undefined || cardState.cardDTO.cardId == cardDTO.cardId) {
														return null;
													}

													if (cardState.cardDTO.order < currentCardOrder && cardState.cardDTO.order >= newPosition) {
														cardState.cardDTO.order += 2;
													} else if (cardState.cardDTO.order > currentCardOrder && cardState.cardDTO.order <= newPosition) {
														cardState.cardDTO.order -= 2;
													}
												});

												// Atualiza a ordem da fase
												cardState.cardDTO.order = newPosition;

												// Atualiza a ordem das fases
												performLazyLoaderUpdateRef.current();
											}}
										>
											<LazyLoader
												className="PP-cards-container-lazy-loader"
												// Função para atualizar o lazy loader
												update={performLazyLoaderUpdateRef}
												// Referências para os offsets
												topLeftOffset={lazyLoaderTopOffsetRef}
												bottomRightOffset={lazyLoaderBottomOffsetRef}
												// Container e barra de rolagem
												scrollBarRef={cardsContainerScrollBarRef}
												// Função para construir os elementos
												constructElement={(card, _, isLoading, setReference) => {
													return (
														<Card
															scrollableDivRef={cardsContainerScrollBarRef}
															isLoading={isLoading}
															card={card}
															projectStateRef={projectStateRef}
															projectSocketRef={projectSocketRef}
															callbacks={{
																dragBegin: [
																	() => {
																		mouseScrollableModalRef.current?.enableMouseScrolling();
																	},
																	dragableModalOnDragBeginRef.current,
																],
																dragEnd: [
																	() => {
																		mouseScrollableModalRef.current?.disableMouseScrolling();
																	},
																	dragableModalOnDragEndRef.current,
																],
																dragMove: [dragableModalOnDragMoveRef.current],
															}}
															ref={(element) => setReference(element)}
														/>
													);
												}}
												// Dimensões dos elementos
												height={138}
												margin={8}
												padding={8}
												// Direção de rolagem
												direction={"vertical"}
												// Funções de controle do conteúdo
												fetchMore={(page) => {
													return new Promise((resolve, reject) => {
														return projectSocketRef.current?.emit("fetchCards", { phaseId: phase?.phaseDTO?.phaseId, page }, (response) => {
															resolve(response?.cards?.taken || []);
														});
													});
												}}
												getAvailableContentCountForFetch={async (sync = false) => {
													return await projectStateRef.current?.getTotalCards(phase?.phaseDTO?.phaseId, sync);
												}}
												insertFetchedElement={(element) => {
													return projectStateRef.current?.cardCreated([element], true, true);
												}}
												// Tamanho da página
												pageSize={100}
												// Função para obter o conteúdo
												getContent={() => projectStateRef.current?.getCards(phase?.phaseDTO?.phaseId) || []}
												// Referência para o lazy loader
												ref={lazyLoaderRef}
											/>
										</DragableModalDropLocationWithLazyLoader>
									</MouseScrollableModal>
									<div ref={lazyLoaderBottomOffsetRef} />
								</div>
							</div>
						)}
					</Suspense>
				</div>
			)}
			// Callbacks
			callbacks={callbacks}
			// Referência para o modal
			ref={ref}
			// Chave
			key={phase?.phaseDTO?.phaseId}
		></DragableModal>
	);
});

export default Phase;
