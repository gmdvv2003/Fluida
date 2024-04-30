import { useRef } from "react";

import { Suspense } from "react";

import { ReactComponent as PlusIcon } from "assets/action-icons/add-circle-unlined.svg";
import { ReactComponent as DotsIcon } from "assets/action-icons/dots.svg";

import TextInputField from "components/shared/text-input-field/TextInputField";
import LoadingDots from "components/shared/loading/LoadingDots";

import LazyLoader from "utilities/lazy-loader/LazyLoader";

import Card from "../card/Card";

import "./Phase.css";

function Phase({ isLoading, phaseId, projectState }) {
	const phasesContainerRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	return (
		<div className="PP-background">
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
								placeholder={"Phase " + index}
								style={{ backgroundColor: "white", width: "100%", height: "100%" }}
							/>
							<PlusIcon className="PP-header-icon" />
							<DotsIcon className="PP-header-icon" />
						</div>

						<div>
							<div ref={lazyLoaderTopOffsetRef} />
							<div className="PP-cards-container" ref={phasesContainerRef}>
								<LazyLoader
									// Referências para os offsets
									topLeftOffset={lazyLoaderBottomOffsetRef}
									bottomRightOffset={lazyLoaderBottomOffsetRef}
									// Container e barra de rolagem
									container={phasesContainerRef}
									scrollBar={phasesContainerRef}
									// Função para construir os elementos
									constructElement={({ cardId }, isLoading) => {
										return <div />;
									}}
									// Dimensões dos elementos
									width={138}
									margin={8}
									padding={8}
									// Direção de rolagem
									direction={"vertical"}
									// Funções de controle do conteúdo
									fetchMore={(page) => {
										return currentProjectSocket?.emit("fetchCards", { page });
									}}
									getAvailableContentCountForFetch={() => {
										return currentProjectSocket?.emit("cardsInPhase", {
											phaseId,
										});
									}}
									// Tamanho da página
									pageSize={10}
									// Função para obter o conteúdo
									getContent={projectState?.getCards(phaseId)}
								/>
							</div>
							<div ref={lazyLoaderBottomOffsetRef} />
						</div>
					</div>
				)}
			</Suspense>
		</div>
	);
}

export default Phase;
