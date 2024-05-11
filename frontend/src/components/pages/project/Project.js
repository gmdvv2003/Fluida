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
		socket.emit("fetchPhases", { page: 0 });

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
		phases?.[0]?.taken?.forEach(({ phaseId, phase }) => {
			// Cria o estado da fase
			this.phaseCreated(phase);

			// Realiza o fetch dos cards da fase inicial
			this.#socket.emit("fetchCards", { page: 0, phaseId: phaseId });
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

	// ============================== Construtor do placeholder da fase ============================== //
	function constructPhasePlaceholder(setPlaceholder, { order }) {
		return (
			<div
				ref={(element) => setPlaceholder(element)}
				className="PP-background PP-background-placeholder"
				style={{ order: order + 1 }}
			/>
		);
	}

	// ============================== Criação de fases e cards ============================== //
	function handleCreateNewPhaseButtonClick() {
		currentProjectSocket?.emit("createPhase", {
			phaseName: "Nova Fase",
		});
	}

	function handleCreateNewPhaseCardButtonClick(phaseId) {
		currentProjectSocket?.emit("createCard", {
			phaseId,
			cardName: "Novo Card",
		});
	}

	// ============================== Drag das fases ============================== //
	/**
	 *
	 * @param {*} clientX
	 * @param {*} clientY
	 * @returns
	 */
	function getNewPhaseOrderIndex(clientX) {
		return Math.max(0, Math.floor((clientX - 20) / (320 + 20)));
	}

	/**
	 *
	 * @param {*} ref
	 * @returns
	 */
	function getPhaseFromRef(ref) {
		return ref.current?.children?.[0];
	}

	/**
	 *
	 * @param {*} ref
	 * @returns
	 */
	function getComponentDataFromRef(ref) {
		return lazyLoaderRef.current?.getComponentDataFromRef(getPhaseFromRef(ref));
	}

	/**
	 *
	 * @param {*} ref
	 * @returns
	 */
	function getAssociatedPlaceholder(ref) {
		return lazyLoaderRef.current?.getAssociatedPlaceholder(ref);
	}

	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function handlePhaseDragBegin(ref, _, event) {
		const { current, data, index } = getComponentDataFromRef(ref);
		lazyLoaderRef.current?.associatePlaceholder(
			current,
			lazyLoaderRef.current?.addPlaceholder(index, constructPhasePlaceholder, data?.phaseDTO)
		);
	}

	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function handlePhaseDragEnd(ref, _, event) {
		// Pega o componente associado ao ref
		const { current, data } = getComponentDataFromRef(ref);

		// Pega o UUID do placeholder associado ao elemento
		const { uuid } = getAssociatedPlaceholder(current);

		// Remove o placeholder associado ao elemento
		lazyLoaderRef.current?.removePlaceholder(uuid);

		// Novo índice de ordem da fase
		let newOrderIndex = getNewPhaseOrderIndex(event.clientX);
		newOrderIndex += newOrderIndex >= data?.phaseDTO?.order ? 1 : 0;

		// Manda um evento para o servidor para mover a fase
		currentProjectSocket?.emit("movePhase", {
			phaseId: data?.phaseDTO?.phaseId,
			targetPositionIndex: newOrderIndex,
		});
	}

	/**
	 *
	 * @param {*} ref
	 * @param {*} _
	 * @param {*} event
	 */
	function handlePhaseDragMove(ref, _, event) {
		// Pega o componente associado ao ref
		const { current, data } = getComponentDataFromRef(ref);

		// Pega o placeholder associado ao elemento
		const { getReference } = getAssociatedPlaceholder(current);

		const { clientX } = event;

		// Novo índice de ordem da fase
		let newOrderIndex = getNewPhaseOrderIndex(clientX);
		newOrderIndex += newOrderIndex >= data?.phaseDTO?.order ? 1 : 0;

		// Atualiza a ordem da fase
		getReference().style.order = newOrderIndex;
	}

	// ============================== Socket ============================== //
	useEffect(() => {
		// Pega o socket do projeto, caso exista
		const project = getProjectSession(projectId);
		if (!project) {
			return undefined;
		}

		const { socket, projectName } = project;
		setCurrentProjectSocket(socket);

		const newProjectState = new ProjectState(socket);
		setProjectState(newProjectState);

		document.title = `Fluida | ${projectName}`;

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

		socket.on("phasesFetched", phasesFetched);
		socket.on("cardsFetched", cardsFetched);

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

			socket.off("phasesFetched", phasesFetched);
			socket.off("cardsFetched", cardsFetched);
		};
	}, [projectId]);

	return (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader />
			{projectState && (
				<div className="P-background" ref={phasesContainerScrollBarRef}>
					<div className="P-phases-container-holder">
						<ol className="P-phases-container" ref={phasesContainerRef}>
							<div ref={lazyLoaderTopOffsetRef} />
							<LazyLoader
								// Referências para os offsets
								topLeftOffset={lazyLoaderBottomOffsetRef}
								bottomRightOffset={lazyLoaderBottomOffsetRef}
								// Container e barra de rolagem
								container={phasesContainerRef}
								scrollBar={phasesContainerScrollBarRef}
								// Função para construir os elementos
								constructElement={(phase, _, isLoading, setReference) => (
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
										return currentProjectSocket?.emit(
											"fetchPhases",
											{ page },
											(response) => {
												resolve(response?.phases?.taken || []);
											}
										);
									});
								}}
								getAvailableContentCountForFetch={() => {
									return new Promise((resolve, reject) => {
										return currentProjectSocket?.emit(
											"getTotalPhases",
											null,
											(response) => {
												resolve(response?.data?.totalPhases || 0);
											}
										);
									});
								}}
								// Tamanho da página
								pageSize={10}
								// Função para obter o conteúdo
								getContent={projectState?.getPhases()}
								// Referência para o lazy loader
								ref={lazyLoaderRef}
							/>
							<div ref={lazyLoaderBottomOffsetRef} />
						</ol>

						<div className="P-add-new-phase-button-container">
							<button
								className="P-add-new-phase-button"
								onClick={handleCreateNewPhaseButtonClick}
							>
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
