import { v4 as uuidv4 } from "uuid";

import React, { Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";
import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";

import DragableModal from "utilities/dragable-modal/DragableModal";
import LazyLoader from "utilities/lazy-loader/LazyLoader";

import LoadingDots from "components/shared/loading/LoadingDots";
import TextInputField from "components/shared/text-input-field/TextInputField";

import Card from "../card/Card";

import "./Phase.css";

const Phase = React.forwardRef(({ scrollableDivRef, isLoading, phase, projectState, projectSocketRef, callbacks }, ref) => {
	const cardsContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);
	const performLazyLoaderUpdateRef = useRef(null);

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

		return projectState.current?.onProjectCardsStateChange(phase?.phaseDTO?.phaseId, (cardDTO) => {
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
											projectState.current.requestCreateNewCard(phase?.phaseDTO?.phaseId).catch((error) => {
												console.error(`Erro ao criar novo card:`, error);
											});
										}}
									/>
									<DotsIcon
										className="PP-header-icon"
										onClick={() => projectState.current?.previewPhaseConfiguration(phase)}
									/>
								</div>

								<div className="PP-cards-container">
									<div ref={lazyLoaderTopOffsetRef} />
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
													projectState={projectState}
													projectSocketRef={projectSocketRef}
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
										pageSize={100}
										// Função para obter o conteúdo
										getContent={() => projectState.current?.getCards(phase?.phaseDTO?.phaseId) || []}
										// Referência para o lazy loader
										ref={lazyLoaderRef}
									/>

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
