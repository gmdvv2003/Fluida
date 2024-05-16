import React, { Suspense, useEffect, useImperativeHandle, useRef } from "react";

import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";

import TextInputField from "components/shared/text-input-field/TextInputField";
import LoadingDots from "components/shared/loading/LoadingDots";

import LazyLoader from "utilities/lazy-loader/LazyLoader";
import DragableModal from "utilities/dragable-modal/DragableModal";

import Card from "../card/Card";

import "./Phase.css";

const Phase = React.forwardRef(({ onCreateCardRequest, isLoading, phase, projectState, currentProjectSocket, ...callbacks }, ref) => {
	const backgroundRef = useRef(null);

	const phasesContainerRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);

	const performLazyLoaderUpdateRef = useRef(null);

	/**
	 *
	 */
	function handleCreateNewPhaseButtonClick() {
		onCreateCardRequest(phase?.phaseDTO?.phaseId);
	}

	useImperativeHandle(
		ref,
		() => ({
			ref: backgroundRef,
		}),
		[]
	);

	return (
		<DragableModal
			order={phase?.phaseDTO?.order}
			// Esqueleto de drag
			draggingSkeleton={() => (
				<div className="PP-background PP-background-dragging" ref={backgroundRef}>
					<h1>Salve</h1>
				</div>
			)}
			// Elementos do modal
			elements={(isDragging) => (
				<div className={`PP-background ${isDragging && "PP-background-dragging"}`} ref={backgroundRef}>
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
									<PlusIcon className="PP-header-icon" onClick={handleCreateNewPhaseButtonClick} />
									<DotsIcon className="PP-header-icon" />
								</div>

								<div className="PP-cards-container" ref={phasesContainerRef}>
									<div ref={lazyLoaderTopOffsetRef} />
									<LazyLoader
										update={performLazyLoaderUpdateRef}
										// Referências para os offsets
										topLeftOffset={lazyLoaderBottomOffsetRef}
										bottomRightOffset={lazyLoaderBottomOffsetRef}
										// Container e barra de rolagem
										container={phasesContainerRef}
										scrollBar={phasesContainerRef}
										// Função para construir os elementos
										constructElement={(phase, _, isLoading, setReference) => <Card />}
										// Dimensões dos elementos
										height={138}
										margin={8}
										padding={8}
										// Direção de rolagem
										direction={"vertical"}
										// Funções de controle do conteúdo
										fetchMore={(page) => {
											return new Promise((resolve, reject) => {
												return currentProjectSocket?.emit("fetchCards", { page }, (response) => {
													resolve([]);
												});
											});
										}}
										getAvailableContentCountForFetch={async (sync = false) => {
											// return await projectState?.getTotalCards(sync);
											return 100;
										}}
										// Tamanho da página
										pageSize={10}
										// Função para obter o conteúdo
										getContent={projectState?.getCards(phase?.phaseDTO?.phaseId)}
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
		></DragableModal>
	);
});

export default Phase;
