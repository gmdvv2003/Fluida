import { useRef, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { ReactComponent as AddButtonIcon } from "assets/action-icons/add-circle-unlined.svg";

import { useProjectAuthentication } from "context/ProjectAuthenticationContext";

import HomeHeader from "components/shared/login-registration/header-home/HeaderHome";

import EditCard from "./edit-card/EditCard";
import ProjectUsers from "./project-users/ProjectUsers";

import LazyLoader from "utilities/lazy-loader/LazyLoader";
import DragableModalDropLocationWithLazyLoader from "utilities/dragable-modal/drop-location/DragableModalDropLocationWithLazyLoader";

import Phase from "./templates/phase/Phase";
import ConnectionFailure from "./ConnectionFailure";

import "./Project.css";
import Backdrop from "components/shared/backdrop/Backdrop";

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

	totalCards = 0;

	constructor(phaseDTO) {
		this.phaseDTO = phaseDTO;
	}
}

class ProjectState {
	#socket;
	#projectStateUpdated;

	members = [];
	membersMap = {};

	phases = [];
	phasesMap = {};

	totalPhases = 0;

	// Indica se o número total de fases foi sincronizado com o servidor
	totalPhasesSynced = false;

	constructor(socket, projectStateUpdated = () => {}) {
		// Fetch das fases inicial
		socket.emit("fetchPhases", { page: 0 });

		this.#socket = socket;
		this.#projectStateUpdated = projectStateUpdated;
	}

	/**
	 * Retorna o número total de fases.
	 *
	 * @param {boolean} sync
	 * @returns {Promise}
	 */
	async getTotalPhases(sync = false) {
		return new Promise((resolve) => {
			// Caso sync = true ou o número total de fases ainda não tenha sido sincronizado, então é feito um fetch do número total de fases
			// Caso contrário, é retornado o número total de fases local
			if (!this.totalPhasesSynced && !sync) {
				return this.#socket.emit("getTotalPhases", null, (response) => {
					let retrievedCount = response?.amount;

					// Se o número total de fases foi retornado, então o número total de fases foi sincronizado
					if (retrievedCount != undefined) {
						this.totalPhases = retrievedCount;
						this.totalPhasesSynced = true;
					}

					resolve(this.totalPhases);
				});
			}

			return resolve(this.totalPhases);
		});
	}

	/**
	 *
	 * @param {*} phaseId
	 * @param {*} sync
	 * @returns
	 */
	async getTotalCards(phaseId, sync = false) {
		return 0;
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
	phaseCreated(phaseDTO, fromFetch = false) {
		phaseDTO = phaseDTO?.[0];
		if (!phaseDTO) {
			return null;
		}

		// Criar o estado da fase
		const phaseState = new PhaseState(phaseDTO);

		this.phases.push(phaseState);
		this.phasesMap[phaseDTO.phaseId] = phaseState;

		this.totalPhases += fromFetch ? 0 : 1;

		// Atualizar o estado do projeto
		this.#projectStateUpdated();
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
	cardCreated(cardDTO, fromFetch = false) {
		cardDTO = cardDTO?.[0];
		if (!cardDTO) {
			return null;
		}

		// Adicionar o card ao estado da fase
		const phaseState = this.getPhaseState(cardDTO.phaseId);
		if (!phaseState) {
			return null;
		}

		// Criar o estado do card
		const cardState = new CardState(cardDTO);

		phaseState.cards?.push(cardState);
		phaseState.cardsMap[cardDTO.cardId] = cardState;

		// Incrimenta o número total de cards
		phaseState.totalCards += fromFetch ? 0 : 1;

		// Atualizar o estado do projeto
		this.#projectStateUpdated();
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
		phases = phases?.[0]?.taken?.filter(({ phaseId }) => this.phasesMap[phaseId] == undefined);
		phases.forEach(({ phaseId, phase }) => {
			// Cria o estado da fase
			this.phaseCreated([phase], true);

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
			this.cardCreated([cardDTO], true);
		});
	}

	/**
	 *
	 * @param {*} phaseDTO
	 * @returns
	 */
	newPhaseState(phaseDTO) {
		return new PhaseState(phaseDTO);
	}

	/**
	 *
	 * @param {*} cardDTO
	 * @returns
	 */
	newCardState(cardDTO) {
		return new CardState(cardDTO);
	}
}

function Project() {
	const [currentProjectSocket, setCurrentProjectSocket] = useState(null);

	const [isEditCardModalVisible, setIsEditCardModalVisible] = useState(false);
	const [isProjectUsersModalVisible, setIsProjectUsersModalVisible] = useState(false);

	const { projectId, cardId } = useParams();
	const { getProjectSession } = useProjectAuthentication();

	const [projectState, setProjectState] = useState(null);

	const phasesContainerRef = useRef(null);
	const phasesContainerScrollBarRef = useRef(null);

	const lazyLoaderTopOffsetRef = useRef(null);
	const lazyLoaderBottomOffsetRef = useRef(null);

	const lazyLoaderRef = useRef(null);

	const performLazyLoaderUpdateRef = useRef(null);

	const [waitingForReconnect, setWaitingForReconnect] = useState(false);
	const [redirectToHome, setRedirectToHome] = useState(false);

	// ============================== Edição de um card ============================== //
	function toggleEditCardModal() {
		setIsEditCardModalVisible(!isEditCardModalVisible);
	}

	// ============================== Usuários do projeto ============================== //
	function toggleProjectUsersModal() {
		setIsProjectUsersModalVisible(!isProjectUsersModalVisible);
	}

	// ============================== Criação de fases e cards ============================== //
	/**
	 *
	 */
	function handleCreateNewPhaseButtonClick() {
		currentProjectSocket?.emit("createPhase", {
			phaseName: "Nova Fase",
		});
	}

	/**
	 *
	 * @param {*} phaseId
	 */
	function handleCreateNewPhaseCardButtonClick(phaseId) {
		currentProjectSocket?.emit("createCard", {
			phaseId,
			cardName: "Novo Card",
		});
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
		const disconnect = (reason) => {
			if (!reason.active) {
				// Remove a sessão do projeto
				setProjectState(null);
				setCurrentProjectSocket(null);
				setRedirectToHome(true);
			} else {
				setWaitingForReconnect(true);
			}
		};

		const connect = () => {
			setWaitingForReconnect(false);
		};

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
		socket.on("connect", connect);

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
			socket.off("connect", connect);

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

	return redirectToHome ? (
		<Navigate to="/" />
	) : (
		<div style={{ overflowX: "hidden" }}>
			<HomeHeader onUsersInProjectClick={toggleProjectUsersModal} />
			<ConnectionFailure connectionFailure={waitingForReconnect} />

			{isEditCardModalVisible && <EditCard />}

			{isProjectUsersModalVisible && <ProjectUsers />}
			<Backdrop show={isProjectUsersModalVisible} onClick={toggleProjectUsersModal} />

			{projectState && (
				<div className="P-background" ref={phasesContainerScrollBarRef}>
					<div className="P-phases-container-holder">
						<ol className="P-phases-container" ref={phasesContainerRef}>
							<div ref={lazyLoaderTopOffsetRef} />
							<LazyLoader
								update={performLazyLoaderUpdateRef}
								// Referências para os offsets
								topLeftOffset={lazyLoaderBottomOffsetRef}
								bottomRightOffset={lazyLoaderBottomOffsetRef}
								// Container e barra de rolagem
								container={phasesContainerRef}
								scrollBar={phasesContainerScrollBarRef}
								// Função para construir os elementos
								constructElement={(phase, _, isLoading, setReference) => (
									<Phase
										onCreateCardRequest={handleCreateNewPhaseCardButtonClick}
										isLoading={isLoading}
										phase={phase}
										projectState={projectState}
										currentProjectSocket={currentProjectSocket}
										// dragBegin={handlePhaseDragBegin}
										// dragEnd={handlePhaseDragEnd}
										// dragMove={handlePhaseDragMove}
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
										return currentProjectSocket?.emit("fetchPhases", { page }, (response) => {
											resolve(
												response?.phases?.taken.map((taken) => new PhaseState(taken)) || []
											);
										});
									});
								}}
								getAvailableContentCountForFetch={async (sync = false) => {
									return await projectState?.getTotalPhases(sync);
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
