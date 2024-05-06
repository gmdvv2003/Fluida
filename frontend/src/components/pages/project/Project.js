import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";

import HomeHeader from "components/shared/login-registration/header-home/HeaderHome";
import LazyLoader from "utilities/lazy-loader/LazyLoader";

import Phase from "./templates/phase/Phase";

import "./Project.css";

class CardState {
	cardDTO;

	constructor(cardDTO) {
		this.cardDTO = cardDTO;
	}
}

class PhaseState {
	phaseDTO;

	cards = [];
	cardsMap = {};

	constructor(phaseDTO) {
		this.phaseDTO = phaseDTO;
	}
}

class ProjectState {
	#socket;

	phases = [];
	phasesMap = {};

	constructor(socket) {
		// Fetch das fases inicial
		// socket.emit("fetchPhases", { page: 0 });

		this.#socket = socket;
	}

	/**
	 * Pega o estado de uma fase.
	 *
	 * @param {number} phaseId
	 * @returns {PhaseState}
	 */
	getPhaseState(phaseId) {
		return this.phasesMap[phaseId];
	}

	/**
	 * Pega o estado de um card.
	 *
	 * @param {number} phaseId
	 * @param {number} cardId
	 * @returns {CardState}
	 */
	getCardState(phaseId, cardId) {
		return this.getPhaseState(phaseId)?.cardsMap[cardId];
	}

	/**
	 * Retorna as fases do projeto.
	 *
	 * @returns {Array}
	 */
	getPhases() {
		return this.phases;
	}

	/**
	 * Retorna os cards de uma fase.
	 *
	 * @param {number} phaseId
	 * @returns {Array}
	 */
	getCards(phaseId) {
		return this.getPhaseState(phaseId)?.cards;
	}

	/**
	 * Resposta do servidor para a criação de uma fase.
	 *
	 * @param {Object} phaseDTO
	 */
	phaseCreated(phaseDTO) {
		const phaseState = new PhaseState(phaseDTO);
		this.phases.push(phaseState);
	}

	/**
	 * Resposta do servidor para a atualização de uma fase.
	 *
	 * @param {number} phaseId
	 * @param {Object} updatedPhaseDTOFields
	 */
	phaseUpdated(phaseId, updatedPhaseDTOFields) {}

	/**
	 * Resposta do servidor para a remoção de uma fase.
	 *
	 * @param {number} phaseId
	 */
	phaseDeleted(phaseId) {}

	/**
	 * Resposta do servidor para a movimentação de uma fase.
	 *
	 * @param {number} phaseId
	 * @param {number} targetPositionIndex
	 */
	phaseMoved(phaseId, targetPositionIndex) {}

	/**
	 * Resposta do servidor para a criação de um card.
	 *
	 * @param {Object} cardDTO
	 */
	cardCreated(cardDTO) {
		const cardState = new CardState(cardDTO);
		this.getPhaseState(cardDTO.phaseId).cards?.push(cardState);
	}

	/**
	 * Resposta do servidor para a atualização de um card.
	 *
	 * @param {number} cardId
	 * @param {Object} updatedCardDTOFields
	 */
	cardUpdated(cardId, updatedCardDTOFields) {}

	/**
	 * Resposta do servidor para a remoção de um card.
	 *
	 * @param {number} cardId
	 */
	cardDeleted(cardId) {}

	/**
	 * Resposta do servidor para a movimentação de um card.
	 *
	 * @param {number} cardId
	 * @param {number} targetPhaseIndex
	 * @param {number} targetPositionIndex
	 */
	cardMoved(cardId, targetPhaseIndex, targetPositionIndex) {}

	/**
	 * Resposta do servidor para o fetch das fases.
	 *
	 * @param {Array} phases
	 */
	phasesFetched(phases) {
		phases?.taken?.forEach((phaseDTO) => {
			// Cria o estado da fase
			this.phaseCreated(phaseDTO);

			// Realiza o fetch dos cards da fase inicial
			this.#socket.emit("fetchCards", { page: 0, phaseId: phaseDTO.phaseId });
		});
	}

	/**
	 * Resposta do servidor para o fetch dos cards.
	 *
	 * @param {number} phaseId
	 * @param {Array} cards
	 */
	cardsFetched(phaseId, cards) {
		cards?.taken?.forEach((cardDTO) => {
			// Cria o estado do card
			this.cardCreated(cardDTO);
		});
	}
}

function Project() {
	const [currentProjectSocket, setCurrentProjectSocket] = useState(null);

	const { projectId, cardId } = useParams();
	const { getProjectSession } = useProjectAuthentication();

	const [projectState, setProjectState] = useState(null);

	const phasesContainerRef = useRef(null);
	const phasesContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);

	// ============================== Criação de fases e cards ============================== //
	function handleCreateNewPhaseButtonClick() {
		currentProjectSocket.emit("createPhase", {
			phaseName: "Nova Fase",
		});
	}

	function handleCreateNewPhaseCardButtonClick(phaseId) {
		currentProjectSocket.emit("createCard", {
			phaseId,
			cardName: "Novo Card",
		});
	}

	// ============================== Drag das fases ============================== //
	function getPhaseFromRef(ref) {
		return ref.current?.children?.[0];
	}

	function getComponentDataFromRef(ref) {
		return lazyLoaderRef.current?.getComponentDataFromRef(getPhaseFromRef(ref));
	}

	function handlePhaseDragBegin(ref, _, event) {
		console.log("Begin", ref.current, getComponentDataFromRef(ref));
		console.log("=====================================");
		// const { current, index } = getComponentDataFromRef(ref);
		// lazyLoaderRef.current?.associatePlaceholder(current, lazyLoaderRef.current?.addPlaceholder(<h1>Oi</h1>, index));
	}

	function handlePhaseDragEnd(ref, _, event) {
		console.log("End");
	}

	function handlePhaseDragMove(ref, _, event) {
		console.log("Move", ref.current, getComponentDataFromRef(ref));
		console.log("=====================================\n\n");
		// const { current } = getComponentDataFromRef(ref);
	}

	// ============================== Socket ============================== //
	useEffect(() => {
		// Pega o socket do projeto, caso exista
		const socket = getProjectSession(projectId)?.socket;
		setCurrentProjectSocket(socket);

		if (!socket) {
			return undefined;
		}

		const newProjectState = new ProjectState(socket);
		setProjectState(newProjectState);

		// Funções de resposta do servidor
		const disconnect = () => setCurrentProjectSocket(null);

		const phaseCreated = (...data) => newProjectState.phaseCreated(data);
		const phaseUpdated = (...data) => newProjectState.phaseUpdated(data);
		const phaseDeleted = (...data) => newProjectState.phaseDeleted(data);
		const phaseMoved = (...data) => newProjectState.phaseMoved(data);

		const cardCreated = (...data) => newProjectState.cardCreated(data);
		const cardUpdated = (...data) => newProjectState.cardUpdated(data);
		const cardDeleted = (...data) => newProjectState.cardDeleted(data);
		const cardMoved = (...data) => newProjectState.cardMoved(data);

		const phasesFetched = (...data) => newProjectState.phasesFetched(data);
		const cardsFetched = (...data) => newProjectState.cardsFetched(data);

		// Adiciona os listeners
		socket.on("disconnect", disconnect);

		socket.on("phaseCreated", phaseCreated);
		socket.on("phaseUpdated", phaseUpdated);
		socket.on("phaseDeleted", phaseDeleted);
		socket.on("phaseMoved", phaseMoved);

		socket.on("cardCreated", cardCreated);
		socket.on("cardUpdated", cardUpdated);
		socket.on("cardDeleted", cardDeleted);
		socket.on("cardMoved", cardMoved);

		socket.on("cardsFetched", phasesFetched);
		socket.on("phasesFetched", cardsFetched);

		return () => {
			// Remove o socket do projeto
			setCurrentProjectSocket(null);

			// Remove os listeners
			socket.off("disconnect", disconnect);

			socket.off("phaseCreated", phaseCreated);
			socket.off("phaseUpdated", phaseUpdated);
			socket.off("phaseDeleted", phaseDeleted);
			socket.off("phaseMoved", phaseMoved);

			socket.off("cardCreated", cardCreated);
			socket.off("cardUpdated", cardUpdated);
			socket.off("cardDeleted", cardDeleted);
			socket.off("cardMoved", cardMoved);

			socket.off("cardsFetched", phasesFetched);
			socket.off("phasesFetched", cardsFetched);
		};
	}, [projectId]);

	return (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader />
			{projectState && (
				<div className="P-background" ref={phasesContainerScrollBarRef}>
					<div className="P-phases-container-holder">
						<div className="P-phases-container" ref={phasesContainerRef}>
							<div ref={lazyLoaderTopOffsetRef} />
							<LazyLoader
								// Referências para os offsets
								topLeftOffset={lazyLoaderBottomOffsetRef}
								bottomRightOffset={lazyLoaderBottomOffsetRef}
								// Container e barra de rolagem
								container={phasesContainerRef}
								scrollBar={phasesContainerScrollBarRef}
								// Função para construir os elementos
								constructElement={(phase, index, isLoading, setReference) => (
									<Phase
										isLoading={isLoading}
										phase={phase}
										projectState={projectState}
										dragBegin={handlePhaseDragBegin}
										dragEnd={handlePhaseDragEnd}
										dragMove={handlePhaseDragMove}
										ref={(element) => setReference(element)}
									/>
								)}
								// Dimensões dos elementos
								width={320}
								margin={20}
								padding={20}
								// Direção de rolagem
								direction={"horizontal"}
								// Funções de controle do conteúdo
								fetchMore={(page) => {
									return new Promise((resolve, reject) => {
										// return currentProjectSocket?.emit("fetchPhases", { page }, (response) => {
										// 	resolve(response?.phases || []);
										// });
										resolve([new PhaseState({ phaseId: 1, order: 0 })]);
									});
								}}
								getAvailableContentCountForFetch={async () => {
									return new Promise((resolve, reject) => {
										resolve(100);
									});
								}}
								// Tamanho da página
								pageSize={1}
								// Função para obter o conteúdo
								getContent={projectState?.getPhases()}
								// Referência para o lazy loader
								ref={lazyLoaderRef}
							/>
							<div ref={lazyLoaderBottomOffsetRef} />
						</div>

						<div className="P-add-new-phase-button-container">
							<button className="P-add-new-phase-button" onClick={handleCreateNewPhaseButtonClick}>
								<AddButtonIcon className="P-add-new-phase-button-icon" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Project;
